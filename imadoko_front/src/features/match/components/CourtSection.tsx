import React from 'react';
import dynamic from 'next/dynamic';
import type { Player, CourtAssignment, CourtSlotId, Team, SetterRotationConfig } from '../../../types';
import { CourtBoard } from './CourtBoard';
import { Bench } from './Bench';
import { TeamSelector } from './TeamSelector';
import { ScoreBoard } from './ScoreBoard';

// 大きなコンポーネントを動的インポート（コード分割でパフォーマンス向上）
const SetterRotationPanel = dynamic(
    () => import('./SetterRotationPanel').then(mod => ({ default: mod.SetterRotationPanel })),
    {
        ssr: false, // クライアントサイドのみでレンダリング
        loading: () => <div className="h-12 bg-slate-100 animate-pulse rounded-lg" />
    }
);

interface CourtSectionProps {
    team: Team | null;
    teams: Team[];
    // 修正: 動的な選手リストを受け取る
    players: (Player | null)[];
    side: 'A' | 'B';
    assignment: CourtAssignment;
    sideOut: number;
    break_: number;
    isRotating: boolean;
    previousAssignment: CourtAssignment;
    isValid: boolean;
    hasServe: boolean; // サーブ権の有無
    onSelectTeam: (team: Team | null) => void;
    onUpdateScore: (side: 'A' | 'B', type: 'so' | 'br', value: number) => void;
    onResetCourt: () => void; // 変更: コートリセット
    onResetBench: () => void; // 追加: ベンチリセット
    onApplyRotation: (side: 'A' | 'B', config: SetterRotationConfig) => void;
}

/**
 * CourtSection - チームごとのコートセクション
 * チーム選択、得点、コート、ベンチ、ローテーションパネルを統合
 */
export const CourtSection: React.FC<CourtSectionProps> = ({
    team,
    teams,
    players, // 修正: 受け取る
    side,
    assignment,
    sideOut,
    break_,
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
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <TeamSelector value={team} teams={teams} onChange={onSelectTeam} placeholder={placeholder} />
            </div>

            <div className="p-6 space-y-6">
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
                        onResetCourt={onResetCourt} // 変更
                        hasServe={hasServe}
                    />
                    {team && (
                        <Bench
                            // 修正: team.playersではなく、親から来た動的リストを渡す
                            players={players}
                            assignment={assignment}
                            side={side}
                            onResetBench={onResetBench} // 変更
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
                </div>
            </div>
        </div>
    );
};