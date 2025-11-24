import { useState, useEffect } from 'react';
import type {
  Team,
  Player,
  CourtAssignment,
  CourtSlotId,
  MatchScore,
  ServeStatus,
  SetterRotationConfig,
} from '../../../types';
import { COURT_SLOTS } from '../../../lib/constants';
import { logger } from '../../../lib/logger';

import {
  rotateAssignment,
  reverseRotateSlot,
  calculateSetterRotation,
} from '../logic/rotation';
import { useToast } from '../../../components/ui/Toast';

const STORAGE_KEY = 'match-state-v2';
const CURRENT_VERSION = 1;

interface PersistedState {
  version: number;
  data: MatchState;
}

// サイド固有のプレイヤー情報（内部管理用）
interface PlayerWithSide extends Player {
  _side: 'A' | 'B'; // 内部的なサイド識別子
}

interface MatchState {
  teamA: Team | null;
  teamB: Team | null;
  playersA: (PlayerWithSide | null)[]; // サイドA固有のプレイヤーリスト
  playersB: (PlayerWithSide | null)[]; // サイドB固有のプレイヤーリスト
  baseA: CourtAssignment;
  baseB: CourtAssignment;
  scoresA: MatchScore;
  scoresB: MatchScore;
}

const INITIAL_ASSIGNMENT: CourtAssignment = {
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
};

const INITIAL_SCORE: MatchScore = {
  so: 0,
  br: 0,
  sets: 0,
  points: 0,
};

const INITIAL_STATE: MatchState = {
  teamA: null,
  teamB: null,
  playersA: [],
  playersB: [],
  baseA: { ...INITIAL_ASSIGNMENT },
  baseB: { ...INITIAL_ASSIGNMENT },
  scoresA: { ...INITIAL_SCORE },
  scoresB: { ...INITIAL_SCORE },
};



/**
 * 重複選手の削除
 */
const removePlayerFromAssignment = (
  assignment: CourtAssignment,
  playerId: number
): CourtAssignment => {
  const newAssignment = { ...assignment };
  (COURT_SLOTS as readonly CourtSlotId[]).forEach((slot) => {
    if (newAssignment[slot]?.id === playerId) {
      newAssignment[slot] = null;
    }
  });
  return newAssignment;
};

/**
 * サーブ権の判定
 */
const calculateServeStatus = (
  scoresA: MatchScore,
  scoresB: MatchScore,
  assignA: CourtAssignment,
  assignB: CourtAssignment
): ServeStatus => {
  const diff = scoresB.so - scoresA.so;

  if (diff === 0) {
    return {
      team: 'A',
      server: assignA[1],
      isValid: true,
      message: 'チームA サーブ',
    };
  } else if (diff === 1) {
    return {
      team: 'B',
      server: assignB[1],
      isValid: true,
      message: 'チームB サーブ',
    };
  } else {
    return {
      team: null,
      server: null,
      isValid: false,
      message: 'サイドアウト数が不正です',
    };
  }
};

export const useMatchGame = () => {
  const { showToast } = useToast();

  // ★ 修正: 初期化時は必ず INITIAL_STATE を使い、Hydration Errorを防ぐ
  const [state, setState] = useState<MatchState>(INITIAL_STATE);
  // ★ 追加: 初期ロード完了フラグ（空データで上書き保存してしまうのを防ぐため）
  const [isInitialized, setIsInitialized] = useState(false);

  // ★ 追加: マウント後にローカルストレージから読み込む
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // バージョンチェック
          if (parsed.version === CURRENT_VERSION && parsed.data) {
            setState(parsed.data);
          } else {
            // バージョン不整合または形式不正
            logger.warn('Storage version mismatch or invalid format. Resetting state.');
            showToast('info', 'データ形式が更新されたため、試合データをリセットしました');
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (e) {
          logger.error('Failed to parse match state', e);
          showToast('error', '保存データの読み込みに失敗しました');
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsInitialized(true); // 読み込み完了
    }
  }, [showToast]);

  // ★ 修正: 読み込み完了後のみ保存を実行する
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      const persisted: PersistedState = {
        version: CURRENT_VERSION,
        data: state,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    }
  }, [state, isInitialized]);

  // Derived state: Current Assignments
  const assignA = rotateAssignment(state.baseA, state.scoresA.so);
  const assignB = rotateAssignment(state.baseB, state.scoresB.so);

  // Actions
  const setTeamA = (team: Team | null) =>
    setState((s) => ({
      ...s,
      teamA: team ? JSON.parse(JSON.stringify(team)) : null,
      playersA: team ? team.players.map((p) => ({ ...p, _side: 'A' as const })) : [],
      baseA: { ...INITIAL_ASSIGNMENT },
    }));

  const setTeamB = (team: Team | null) =>
    setState((s) => ({
      ...s,
      teamB: team ? JSON.parse(JSON.stringify(team)) : null,
      playersB: team ? team.players.map((p) => ({ ...p, _side: 'B' as const })) : [],
      baseB: { ...INITIAL_ASSIGNMENT },
    }));

  const dropPlayerA = (slot: CourtSlotId, player: Player, benchIndex?: number) => {
    setState((s) => {
      const belongsToTeam = s.teamA?.players.some((p) => p.id === player.id);
      if (!belongsToTeam) {
        logger.debug('Invalid operation: Player does not belong to Team A');
        return s;
      }

      const playerWithSide = player as PlayerWithSide;
      if (playerWithSide._side && playerWithSide._side !== 'A') {
        logger.debug('Invalid operation: Cannot place Team B player in Team A court');
        return s;
      }

      const baseSlot = reverseRotateSlot(slot, s.scoresA.so);
      logger.debug(`dropPlayerA: display slot=${slot}, SO=${s.scoresA.so} → base slot=${baseSlot}`);

      const targetPlayer = s.baseA[baseSlot];

      // ベンチから選手を削除
      const newPlayersA = s.playersA.map((p) => (p?.id === player.id ? null : p));

      if (targetPlayer && targetPlayer.id !== player.id) {
        // Court内にすでに該当選手がいる場合はスワップ（Court <-> Court のケース）
        let sourceBaseSlot: CourtSlotId | null = null;
        for (const slot of COURT_SLOTS) {
          if (s.baseA[slot as CourtSlotId]?.id === player.id) {
            sourceBaseSlot = slot as CourtSlotId;
            break;
          }
        }

        if (sourceBaseSlot) {
          logger.debug(
            `Swapping: ${player.lastName} (base slot ${sourceBaseSlot}) ↔ ${targetPlayer.lastName} (base slot=${baseSlot})`
          );
          return {
            ...s,
            baseA: {
              ...s.baseA,
              [baseSlot]: player,
              [sourceBaseSlot]: targetPlayer,
            },
            playersA: newPlayersA,
          };
        }
      }

      // 通常の配置（空き枠 or 置き換え）
      const cleanedBaseA = removePlayerFromAssignment(s.baseA, player.id);

      // targetPlayerが存在し、benchIndexが指定されている場合、スワップ（Bench <-> Court のケース）
      if (targetPlayer && benchIndex !== undefined) {
        newPlayersA[benchIndex] = { ...targetPlayer, _side: 'A' } as PlayerWithSide;
      }

      return {
        ...s,
        baseA: { ...cleanedBaseA, [baseSlot]: player },
        playersA: newPlayersA,
      };
    });
  };

  const dropPlayerB = (slot: CourtSlotId, player: Player, benchIndex?: number) => {
    setState((s) => {
      const belongsToTeam = s.teamB?.players.some((p) => p.id === player.id);
      if (!belongsToTeam) {
        logger.debug('Invalid operation: Player does not belong to Team B');
        return s;
      }

      const playerWithSide = player as PlayerWithSide;
      if (playerWithSide._side && playerWithSide._side !== 'B') {
        logger.debug('Invalid operation: Cannot place Team A player in Team B court');
        return s;
      }

      const baseSlot = reverseRotateSlot(slot, s.scoresB.so);
      logger.debug(`dropPlayerB: display slot=${slot}, SO=${s.scoresB.so} → base slot=${baseSlot}`);

      const targetPlayer = s.baseB[baseSlot];

      // ベンチから選手を削除
      const newPlayersB = s.playersB.map((p) => (p?.id === player.id ? null : p));

      if (targetPlayer && targetPlayer.id !== player.id) {
        // Court内にすでに該当選手がいる場合はスワップ（Court <-> Court のケース）
        let sourceBaseSlot: CourtSlotId | null = null;
        for (const slot of COURT_SLOTS) {
          if (s.baseB[slot as CourtSlotId]?.id === player.id) {
            sourceBaseSlot = slot as CourtSlotId;
            break;
          }
        }

        if (sourceBaseSlot) {
          logger.debug(
            `Swapping: ${player.lastName} (base slot ${sourceBaseSlot}) ↔ ${targetPlayer.lastName} (base slot=${baseSlot})`
          );
          return {
            ...s,
            baseB: {
              ...s.baseB,
              [baseSlot]: player,
              [sourceBaseSlot]: targetPlayer,
            },
            playersB: newPlayersB,
          };
        }
      }

      // 通常の配置（空き枠 or 置き換え）
      const cleanedBaseB = removePlayerFromAssignment(s.baseB, player.id);

      // targetPlayerが存在し、benchIndexが指定されている場合、スワップ（Bench <-> Court のケース）
      if (targetPlayer && benchIndex !== undefined) {
        newPlayersB[benchIndex] = { ...targetPlayer, _side: 'B' } as PlayerWithSide;
      }

      return {
        ...s,
        baseB: { ...cleanedBaseB, [baseSlot]: player },
        playersB: newPlayersB,
      };
    });
  };

  const swapSides = () => {
    setState((s) => {
      const newPlayersA = s.playersB.map((p) => (p ? { ...p, _side: 'A' as const } : null));
      const newPlayersB = s.playersA.map((p) => (p ? { ...p, _side: 'B' as const } : null));

      return {
        ...s,
        teamA: s.teamB,
        teamB: s.teamA,
        playersA: newPlayersA,
        playersB: newPlayersB,
        baseA: s.baseB,
        baseB: s.baseA,
        scoresA: s.scoresB,
        scoresB: s.scoresA,
      };
    });
  };

  const removePlayerA = (slot: CourtSlotId) => {
    setState((s) => ({ ...s, baseA: { ...s.baseA, [slot]: null } }));
  };

  const removePlayerB = (slot: CourtSlotId) => {
    setState((s) => ({ ...s, baseB: { ...s.baseB, [slot]: null } }));
  };

  const setBaseRotationA = (assignment: CourtAssignment) => {
    setState((s) => ({ ...s, baseA: assignment }));
  };

  const setBaseRotationB = (assignment: CourtAssignment) => {
    setState((s) => ({ ...s, baseB: assignment }));
  };

  const updateScore = (side: 'A' | 'B', type: 'so' | 'br' | 'sets', value: number) => {
    setState((s) => {
      const newScores = side === 'A' ? { ...s.scoresA } : { ...s.scoresB };

      if (type === 'sets') {
        newScores.sets = value;
      } else {
        newScores[type] = Math.max(0, value);
        newScores.points = newScores.so + newScores.br;
      }

      return side === 'A' ? { ...s, scoresA: newScores } : { ...s, scoresB: newScores };
    });
  };

  // 🛡 Bench players swap (Array <-> Array)
  const swapBenchPlayers = (side: 'A' | 'B', index1: number, index2: number) => {
    setState((s) => {
      const players = side === 'A' ? [...s.playersA] : [...s.playersB];
      [players[index1], players[index2]] = [players[index2], players[index1]];

      return side === 'A' ? { ...s, playersA: players } : { ...s, playersB: players };
    });
  };

  // 🛡 Court and Bench swap
  const swapCourtAndBench = (side: 'A' | 'B', displaySlot: CourtSlotId, benchIndex: number) => {
    setState((s) => {
      const scores = side === 'A' ? s.scoresA : s.scoresB;
      const base = side === 'A' ? s.baseA : s.baseB;
      const players = side === 'A' ? [...s.playersA] : [...s.playersB];

      const baseSlot = reverseRotateSlot(displaySlot, scores.so);

      const courtPlayer = base[baseSlot];
      const benchPlayer = players[benchIndex]; // can be null

      // 入れ替え
      const newBase = { ...base, [baseSlot]: benchPlayer };

      if (courtPlayer) {
        // コートの選手をベンチへ
        const p = { ...courtPlayer, _side: side };
        players[benchIndex] = p;
      } else {
        // コートが空だった場合、ベンチのその位置も空にする（移動したから）
        players[benchIndex] = null;
      }

      return side === 'A'
        ? { ...s, baseA: newBase, playersA: players }
        : { ...s, baseB: newBase, playersB: players };
    });
  };

  // 🛡 Court players swap (Court <-> Court)
  const swapCourtPlayers = (
    side: 'A' | 'B',
    displaySourceSlot: CourtSlotId,
    displayTargetSlot: CourtSlotId
  ) => {
    setState((s) => {
      const scores = side === 'A' ? s.scoresA : s.scoresB;
      const base = side === 'A' ? s.baseA : s.baseB;

      const baseSourceSlot = reverseRotateSlot(displaySourceSlot, scores.so);
      const baseTargetSlot = reverseRotateSlot(displayTargetSlot, scores.so);

      const sourcePlayer = base[baseSourceSlot];
      const targetPlayer = base[baseTargetSlot];

      // スワップまたは移動（targetがnullの場合は移動）
      const newBase = {
        ...base,
        [baseSourceSlot]: targetPlayer,
        [baseTargetSlot]: sourcePlayer,
      };

      return side === 'A' ? { ...s, baseA: newBase } : { ...s, baseB: newBase };
    });
  };

  // 🛡 Reset Bench
  const resetBench = (side: 'A' | 'B') => {
    setState((s) => {
      const team = side === 'A' ? s.teamA : s.teamB;
      const currentBase = side === 'A' ? s.baseA : s.baseB;
      if (!team) return s;

      const onCourtIds = new Set(
        Object.values(currentBase)
          .filter((p) => p !== null)
          .map((p) => p!.id)
      );

      const newBench: (PlayerWithSide | null)[] = team.players.map((p) => {
        if (onCourtIds.has(p.id)) {
          return null; // コートにいるなら、そのベンチ枠は空ける
        }
        return { ...p, _side: side };
      });

      while (newBench.length < 14) newBench.push(null);

      return side === 'A' ? { ...s, playersA: newBench } : { ...s, playersB: newBench };
    });
  };

  // 🛡 Reset Court (Move all court players to bench)
  const resetCourt = (side: 'A' | 'B') => {
    setState((s) => {
      const currentBase = side === 'A' ? s.baseA : s.baseB;
      const currentPlayers = side === 'A' ? s.playersA : s.playersB;

      const courtPlayers = Object.values(currentBase).filter((p) => p !== null) as PlayerWithSide[];

      if (courtPlayers.length === 0) return s;

      const newPlayers = [...currentPlayers];
      let playerIdx = 0;

      for (let i = 0; i < newPlayers.length; i++) {
        if (newPlayers[i] === null && playerIdx < courtPlayers.length) {
          newPlayers[i] = { ...courtPlayers[playerIdx], _side: side };
          playerIdx++;
        }
      }

      const newBase = { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };

      return side === 'A'
        ? { ...s, baseA: newBase, playersA: newPlayers }
        : { ...s, baseB: newBase, playersB: newPlayers };
    });
  };

  const resetAll = () => {
    if (window.confirm('試合をリセットしますか？')) {
      setState({ ...INITIAL_STATE });
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const setSetterRotation = (side: 'A' | 'B', config: SetterRotationConfig) => {
    const currentBase = side === 'A' ? state.baseA : state.baseB;
    const currentSO = side === 'A' ? state.scoresA.so : state.scoresB.so;

    const baseTargetPosition = reverseRotateSlot(config.targetPosition, currentSO);

    const { rotations, finalAssignment } = calculateSetterRotation(
      currentBase,
      config.setter,
      baseTargetPosition
    );

    if (rotations === 0) return;

    if (rotations === 1) {
      setState((s) => {
        if (side === 'A') {
          return { ...s, baseA: finalAssignment };
        } else {
          return { ...s, baseB: finalAssignment };
        }
      });
      return;
    }

    const intermediateSteps: CourtAssignment[] = [];
    let tempAssignment = currentBase;

    for (let i = 0; i < rotations; i++) {
      tempAssignment = rotateAssignment(tempAssignment, 1);
      intermediateSteps.push({ ...tempAssignment });
    }

    intermediateSteps.forEach((assignment, index) => {
      setTimeout(
        () => {
          setState((prevState) => {
            if (side === 'A') {
              return { ...prevState, baseA: assignment };
            } else {
              return { ...prevState, baseB: assignment };
            }
          });
        },
        (index + 1) * 500
      );
    });
  };

  const serveStatus = calculateServeStatus(state.scoresA, state.scoresB, assignA, assignB);

  return {
    state: { ...state, assignA, assignB, serveStatus },
    actions: {
      setTeamA,
      setTeamB,
      dropPlayerA,
      dropPlayerB,
      removePlayerA,
      removePlayerB,
      setBaseRotationA,
      setBaseRotationB,
      updateScore,
      swapSides,
      resetAll,
      setSetterRotation,
      swapBenchPlayers,
      swapCourtAndBench,
      resetBench,
      resetCourt,
      swapCourtPlayers,
    },
  };
};
