// ============================================================
// 対象ファイル: imadoko_front/src/features/match/components/CourtSection.tsx
// 役割: チームごとのコートセクション（セットカウント機能追加版）
// ============================================================

import React from 'react';
import dynamic from 'next/dynamic';
import { Plus, Minus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { Player, CourtAssignment, Team, SetterRotationConfig } from '../../../types';
import { CourtBoard } from './CourtBoard';
import { Bench } from './Bench';
import { TeamSelector } from './TeamSelector';
import { ScoreBoard } from './ScoreBoard';

// 大きなコンポーネントを動的インポート（コード分割でパフォーマンス向上）
const SetterRotationPanel = dynamic(
  () => import('./SetterRotationPanel').then((mod) => ({ default: mod.SetterRotationPanel })),
  {
    ssr: false, // クライアントサイドのみでレンダリング
    loading: () => <div className="h-12 bg-slate-100 animate-pulse rounded-lg" />,
  }
);

interface CourtSectionProps {
  team: Team | null;
  teams: Team[];
  players: (Player | null)[];
  side: 'A' | 'B';
  assignment: CourtAssignment;
  sideOut: number;
  break_: number;
  sets: number; // ★追加: セットカウント
  isRotating: boolean;
  previousAssignment: CourtAssignment;
  isValid: boolean;
  hasServe: boolean;
  onSelectTeam: (team: Team | null) => void;
  // 修正: typeに 'sets' を追加
  onUpdateScore: (side: 'A' | 'B', type: 'so' | 'br' | 'sets', value: number) => void;
  onResetCourt: () => void;
  onResetBench: () => void;
  onApplyRotation: (side: 'A' | 'B', config: SetterRotationConfig) => void;
}

/**
 * CourtSection - チームごとのコートセクション
 * チーム選択、得点、コート、ベンチ、ローテーションパネルを統合
 */
export const CourtSection: React.FC<CourtSectionProps> = ({
  team,
  teams,
  players,
  side,
  assignment,
  sideOut,
  break_,
  sets,
  isRotating,
  previousAssignment,
  isValid,
  hasServe,
  onSelectTeam,
  onUpdateScore,
  onResetCourt,
  onResetBench,
  onApplyRotation,
}) => {
  const placeholder = side === 'A' ? 'チームAを選択' : 'チームBを選択';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-3 sm:p-6 border-b border-slate-100 bg-slate-50/50">
        <TeamSelector
          value={team}
          teams={teams}
          onChange={onSelectTeam}
          placeholder={placeholder}
        />
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        <ScoreBoard
          side={side}
          sideOut={sideOut}
          break_={break_}
          onUpdateScore={onUpdateScore}
          isValid={isValid}
        />

        <div className="space-y-4">
          <CourtBoard
            assignment={assignment}
            label={team?.teamName || placeholder}
            side={side}
            isRotating={isRotating}
            previousAssignment={previousAssignment}
            onResetCourt={onResetCourt}
            hasServe={hasServe}
          />
          {team && (
            <Bench
              players={players}
              assignment={assignment}
              side={side}
              onResetBench={onResetBench}
            />
          )}
          {team && (
            <SetterRotationPanel
              team={team}
              side={side}
              onApplyRotation={onApplyRotation}
              currentAssignment={assignment}
            />
          )}

          {/* ★追加: セットカウントUI */}
          {team && (
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                セットカウント
              </span>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onUpdateScore(side, 'sets', Math.max(0, sets - 1))}
                  disabled={sets <= 0}
                  className="w-8 h-8 !p-0 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-100"
                >
                  <Minus size={14} className="text-slate-600" />
                </Button>

                <span className="w-6 text-center text-xl font-bold text-slate-800 tabular-nums leading-none">
                  {sets}
                </span>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onUpdateScore(side, 'sets', Math.min(9, sets + 1))}
                  disabled={sets >= 9}
                  className="w-8 h-8 !p-0 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-100"
                >
                  <Plus size={14} className="text-slate-600" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
