'use client';

import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { motion, LayoutGroup } from 'framer-motion';
import clsx from 'clsx';
import { useMatchGame } from './hooks/useMatchGame';
import { useTeams } from '../teams/hooks/useTeams';
import { CourtSection } from './components/CourtSection';
import { MatchControls } from './components/MatchControls';
import { MatchFooter } from './components/MatchFooter';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { CourtSkeleton } from './components/CourtSkeleton';
import { PositionBadge } from '../../components/ui/PositionBadge';
import { dropAnimation } from './utils/animations';
import { useRotationAnimation } from './hooks/useRotationAnimation';
import type { Player, CourtSlotId } from '../../types';
import { MatchHUD } from './components/MatchHUD';

export default function MatchPage() {
    const { state, actions } = useMatchGame();
    const { teams, error, isLoading, actions: teamActions } = useTeams();

    const [activeId, setActiveId] = useState<string | null>(null);
    const [draggedItem, setDraggedItem] = useState<Player | null>(null);
    const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');

    // Animation hooks
    const { isRotating: isRotatingA, previousAssignment: prevAssignA } = useRotationAnimation(
        state.scoresA.so,
        state.assignA
    );
    const { isRotating: isRotatingB, previousAssignment: prevAssignB } = useRotationAnimation(
        state.scoresB.so,
        state.assignB
    );

    // Sensors (Touch対応: 250ms長押しでドラッグ開始)
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    useEffect(() => {
        if (teams.length === 0) {
            teamActions.fetchTeams();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teams.length]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
        setDraggedItem(active.data.current?.player || null);
    };

    // 🛡 Drag & Drop ロジックの核心部
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveId(null);
        setDraggedItem(null);

        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (!activeData || !overData) return;

        // ドラッグ元の情報
        const sourceSide = activeData.side as 'A' | 'B';
        const sourceType = activeData.type as 'court' | 'bench';
        const player = activeData.player as Player;

        // ドロップ先の情報
        const targetSide = overData.side as 'A' | 'B';
        const targetType = overData.type as 'court' | 'bench';

        // 異なるサイドへの移動は禁止（現状の仕様）
        if (sourceSide !== targetSide) return;

        // ------------------------------------------------------------------
        // ケース1: ベンチ -> コート (配置)
        // ------------------------------------------------------------------
        if (sourceType === 'bench' && targetType === 'court') {
            const slotId = overData.slotId as CourtSlotId;
            // ★ Step 6修正: ベンチのindexを取得して渡す（スワップ用）
            const benchIndex = activeData.index as number;

            if (sourceSide === 'A') {
                actions.dropPlayerA(slotId, player, benchIndex);
            } else {
                actions.dropPlayerB(slotId, player, benchIndex);
            }
        }
        // ------------------------------------------------------------------
        // ケース2: コート -> ベンチ (入れ替え / 戻す)
        // ------------------------------------------------------------------
        else if (sourceType === 'court' && targetType === 'bench') {
            const courtSlot = activeData.slotId as CourtSlotId;
            const benchIndex = overData.index as number;

            // 🛡 専用関数で Court(Object) <-> Bench(Array) のスワップを処理
            // これにより、コートの選手をベンチに戻したり、ベンチの選手と交換したりが可能になる
            actions.swapCourtAndBench(sourceSide, courtSlot, benchIndex);
        }
        // ------------------------------------------------------------------
        // ケース3: コート -> コート (ポジション移動 / 入れ替え)
        // ------------------------------------------------------------------
        else if (sourceType === 'court' && targetType === 'court') {
            const sourceSlot = activeData.slotId as CourtSlotId;
            const targetSlot = overData.slotId as CourtSlotId;

            // 🛡 専用関数でCourt内のスワップ/移動を処理（ローテーション考慮済み）
            actions.swapCourtPlayers(sourceSide, sourceSlot, targetSlot);
        }
        // ------------------------------------------------------------------
        // ケース4: ベンチ -> ベンチ (並び替え)
        // ------------------------------------------------------------------
        else if (sourceType === 'bench' && targetType === 'bench') {
            const sourceIndex = activeData.index as number;
            const targetIndex = overData.index as number;

            // ベンチ内の並び替えを実行
            actions.swapBenchPlayers(sourceSide, sourceIndex, targetIndex);
        }
    };

    const warning = !state.serveStatus.isValid ? state.serveStatus.message : null;

    if (isLoading && teams.length === 0) {
        return (
            <div className="space-y-8">
                <h1 className="text-2xl font-bold text-slate-900">試合シミュレーション</h1>
                <div className="grid lg:grid-cols-2 gap-8">
                    <CourtSkeleton />
                    <CourtSkeleton />
                </div>
            </div>
        );
    }

    if (error && teams.length === 0) {
        return (
            <div className="space-y-8">
                <h1 className="text-2xl font-bold text-slate-900">試合シミュレーション</h1>
                <ErrorMessage message={error} onRetry={teamActions.fetchTeams} />
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* ★ Step 8修正: メインコンテンツを独立させ、レイアウト干渉を防ぐ */}
            <div className="space-y-4 pb-28">
                <MatchControls onSwapSides={actions.swapSides} onResetAll={actions.resetAll} />

                {/* ★ モバイル用タブ切り替え: 「フォルダタブ」風デザインに刷新 
                   下のコンテンツエリアと物理的に繋がっているように見せる
                */}
                <div className="md:hidden flex items-end px-2 -mb-[2px] relative z-10 select-none">
                    <button
                        onClick={() => setActiveTab('A')}
                        className={clsx(
                            "flex-1 py-3 text-sm font-bold rounded-t-xl border-t-2 border-x-2 transition-all duration-150",
                            activeTab === 'A'
                                // Active: 白背景、下線なし(border-b-0)、z-index高(手前)
                                // 下のマージンを調整してコンテンツエリアに「被せる」
                                ? "bg-white text-mikasa-blue-deep border-slate-200 border-b-0 z-20 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]"
                                // Inactive: グレー背景、下線あり(border-b-2)、z-index低(奥)
                                : "bg-slate-100 text-slate-400 border-transparent border-b-2 border-b-slate-200 hover:bg-slate-50 z-0"
                        )}
                    >
                        {state.teamA?.teamName || 'チームA'}
                    </button>
                    {/* 隙間 */}
                    <div className="w-1 border-b-2 border-slate-200"></div>
                    <button
                        onClick={() => setActiveTab('B')}
                        className={clsx(
                            "flex-1 py-3 text-sm font-bold rounded-t-xl border-t-2 border-x-2 transition-all duration-150",
                            activeTab === 'B'
                                ? "bg-white text-mikasa-blue-deep border-slate-200 border-b-0 z-20 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]"
                                : "bg-slate-100 text-slate-400 border-transparent border-b-2 border-b-slate-200 hover:bg-slate-50 z-0"
                        )}
                    >
                        {state.teamB?.teamName || 'チームB'}
                    </button>
                </div>

                {/* レイアウトアニメーション用のグループ（サイドごとに分離） */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* チームAセクション */}
                    <div className={clsx("md:block", activeTab === 'A' ? "block" : "hidden")}>
                        <LayoutGroup id="team-A">
                            <motion.div
                                layout
                                key={state.teamA?.id || 'empty-A'}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <CourtSection
                                    team={state.teamA}
                                    teams={teams}
                                    players={state.playersA}
                                    side="A"
                                    assignment={state.assignA}
                                    sideOut={state.scoresA.so}
                                    break_={state.scoresA.br}
                                    isRotating={isRotatingA}
                                    previousAssignment={prevAssignA}
                                    isValid={state.serveStatus.isValid}
                                    hasServe={state.serveStatus.team === 'A'}
                                    onSelectTeam={(team) => actions.setTeamA(team)}
                                    onUpdateScore={actions.updateScore}
                                    onResetCourt={() => actions.resetCourt('A')}
                                    onResetBench={() => actions.resetBench('A')}
                                    onApplyRotation={actions.setSetterRotation}
                                />
                            </motion.div>
                        </LayoutGroup>
                    </div>

                    {/* チームBセクション */}
                    <div className={clsx("md:block", activeTab === 'B' ? "block" : "hidden")}>
                        <LayoutGroup id="team-B">
                            <motion.div
                                layout
                                key={state.teamB?.id || 'empty-B'}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <CourtSection
                                    team={state.teamB}
                                    teams={teams}
                                    players={state.playersB}
                                    side="B"
                                    assignment={state.assignB}
                                    sideOut={state.scoresB.so}
                                    break_={state.scoresB.br}
                                    isRotating={isRotatingB}
                                    previousAssignment={prevAssignB}
                                    isValid={state.serveStatus.isValid}
                                    hasServe={state.serveStatus.team === 'B'}
                                    onSelectTeam={(team) => actions.setTeamB(team)}
                                    onUpdateScore={actions.updateScore}
                                    onResetCourt={() => actions.resetCourt('B')}
                                    onResetBench={() => actions.resetBench('B')}
                                    onApplyRotation={actions.setSetterRotation}
                                />
                            </motion.div>
                        </LayoutGroup>
                    </div>
                </div>
            </div>
            {/* ↑ メインコンテンツの閉じタグ */}

            {/* スティッキーフッター */}
            <MatchFooter
                teamAName={state.teamA?.teamName || 'Team A'}
                teamBName={state.teamB?.teamName || 'Team B'}
                scoresA={state.scoresA}
                scoresB={state.scoresB}
            />

            {/* ドラッグオーバーレイ (ドラッグ中の表示) */}
            <DragOverlay dropAnimation={dropAnimation}>
                {draggedItem ? (
                    // 修正: サイズを可変に (w-20 h-20 sm:w-24 sm:h-24)、パディング縮小
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg shadow-xl border-2 border-mikasa-blue flex flex-col items-center justify-center p-1 sm:p-2 opacity-90 cursor-grabbing">
                        {/* 修正: バッジ縮小 */}
                        <PositionBadge position={draggedItem.position} className="mb-0.5 sm:mb-1 scale-90 sm:scale-100 origin-bottom" />
                        {/* 修正: 文字サイズ縮小 */}
                        <span className="text-xs sm:text-sm font-bold text-slate-900 text-center truncate w-full leading-tight px-1">
                            {draggedItem.lastName}
                        </span>
                    </div>
                ) : null}
            </DragOverlay>

            {/* HUD */}
            <MatchHUD
                serveStatus={state.serveStatus}
                sameTeamWarning={{
                    show: state.teamA !== null && state.teamB !== null && state.teamA.id === state.teamB.id,
                    teamName: state.teamA?.teamName || ''
                }}
                warning={warning}
            />
        </DndContext>
    );
}