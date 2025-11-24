import type { CourtAssignment, CourtSlotId, Player } from '../../../types';
import { COURT_SLOTS } from '../../../lib/constants';

const INITIAL_ASSIGNMENT: CourtAssignment = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
};

/**
 * ローテーション処理
 * バレーボールのルールに従い、時計回りにポジションを移動
 * 1→6→5→4→3→2→1 の順に回転
 */
export const rotateAssignment = (
    base: CourtAssignment,
    rotations: number
): CourtAssignment => {
    const result = { ...base };
    // 負の数や大きな数にも対応するための正規化
    // JavaScriptの % 演算子は負の数を返すことがあるため、((n % 6) + 6) % 6 で正の剰余を得る
    const effectiveRotations = ((rotations % 6) + 6) % 6;

    if (effectiveRotations === 0) return result;

    const cycle = [1, 6, 5, 4, 3, 2];

    const newAssignment: CourtAssignment = { ...INITIAL_ASSIGNMENT };

    COURT_SLOTS.forEach((slot) => {
        const player = base[slot as CourtSlotId];
        if (player) {
            const idx = cycle.indexOf(slot);
            // cycle配列上での新しいインデックス計算
            const newIdx = (idx + effectiveRotations) % 6;
            const newSlot = cycle[newIdx] as CourtSlotId;
            newAssignment[newSlot] = player;
        }
    });

    return newAssignment;
};

/**
 * 逆ローテーション計算
 * 現在のSO数を考慮して、表示位置から元のbase位置を逆算
 */
export const reverseRotateSlot = (
    displaySlot: CourtSlotId,
    rotations: number
): CourtSlotId => {
    const effectiveRotations = ((rotations % 6) + 6) % 6;
    if (effectiveRotations === 0) return displaySlot;

    const cycle = [1, 6, 5, 4, 3, 2];
    const displayIdx = cycle.indexOf(displaySlot);

    // 逆ローテーション = (現在位置 - ローテーション数)
    // 負にならないように +6 してから % 6
    const baseIdx = (displayIdx - effectiveRotations + 6) % 6;
    return cycle[baseIdx] as CourtSlotId;
};

/**
 * セッターローテーション計算
 */
export const calculateSetterRotation = (
    currentBase: CourtAssignment,
    setter: Player,
    targetPosition: CourtSlotId
): { rotations: number; finalAssignment: CourtAssignment } => {
    let currentSetterPosition: CourtSlotId | null = null;
    for (const slot of COURT_SLOTS) {
        if (currentBase[slot as CourtSlotId]?.id === setter.id) {
            currentSetterPosition = slot as CourtSlotId;
            break;
        }
    }

    if (!currentSetterPosition) {
        // セッターが現在の配置に見つからない場合（ベンチにいるなど）
        // ターゲット位置に配置しただけの状態を返す（回転数0）
        // ※本来はありえないケースだが、型安全のために処理
        const assignment: CourtAssignment = { ...INITIAL_ASSIGNMENT };
        assignment[targetPosition] = setter;
        return { rotations: 0, finalAssignment: assignment };
    }

    const cycle = [1, 6, 5, 4, 3, 2];
    const currentIdx = cycle.indexOf(currentSetterPosition);
    const targetIdx = cycle.indexOf(targetPosition);

    // 目標位置までの回転数を計算
    // (目標 - 現在 + 6) % 6 で時計回りの必要回転数が出る
    const rotations = (targetIdx - currentIdx + 6) % 6;

    const finalAssignment = rotateAssignment(currentBase, rotations);

    return { rotations, finalAssignment };
};
