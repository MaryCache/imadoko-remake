import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import type { Player, CourtSlotId } from '@/types';
import { Z_INDEX } from '@/lib/constants';
import { PositionBadge } from '@/components/ui/PositionBadge';
import clsx from 'clsx';

interface CourtSlotProps {
    /** スロット番号（1-6） */
    slot: CourtSlotId;
    /** 配置されている選手（nullの場合は空き） */
    player: Player | null;
    /** どちら側のコートか（A or B） */
    side: 'A' | 'B';
    /** サーブ権があるか */
    hasServe: boolean;
    /** フォーカス状態 */
    isFocused: boolean;
    /** キーボード操作ハンドラー */
    onKeyDown: (e: React.KeyboardEvent) => void;
    /** Ref設定用コールバック */
    slotRef: (el: HTMLDivElement | null) => void;
}

/**
 * コートスロット（1つのポジション位置）
 * dnd-kit対応版
 */
export const CourtSlot = memo<CourtSlotProps>(({
    slot,
    player,
    side,
    hasServe,
    isFocused,
    onKeyDown,
    slotRef,
}) => {
    const isServerPosition = slot === 1 && hasServe;

    // Droppable (スロット自体)
    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: `court-${side}-${slot}`,
        data: {
            type: 'court',
            side,
            slotId: slot,
            player, // 現在の選手情報も渡しておくと便利かも
        },
    });

    // Draggable (選手カード)
    const {
        attributes,
        listeners,
        setNodeRef: setDraggableRef,
        transform,
        isDragging
    } = useDraggable({
        id: `court-${side}-${slot}-player`, // 選手IDではなくスロット位置ベースのIDにする（選手がnullの場合もあるが、Draggableはplayerが存在するときのみ有効）
        data: {
            type: 'court',
            side,
            slotId: slot,
            player,
        },
        disabled: !player, // 選手がいない場合はドラッグ不可
    });

    // 外部Refとdnd-kitのRefを合成
    const setRefs = (el: HTMLDivElement | null) => {
        setDroppableRef(el);
        slotRef(el);
    };

    return (
        <div
            ref={setRefs}
            tabIndex={0}
            role="button"
            aria-label={`ポジション${slot}${player ? `: ${player.lastName} (${player.position})` : ': 空き'}${isServerPosition ? ' (サーブ権)' : ''}`}
            style={{ zIndex: player ? Z_INDEX.COURT_SLOT_OCCUPIED : Z_INDEX.COURT_SLOT_EMPTY }}
            className={clsx(
                "relative aspect-square border-2 flex items-center justify-center p-2 transition-all duration-200",
                isOver ? "border-mikasa-yellow bg-mikasa-yellow/20 scale-105" : "border-white/40",
                "hover:bg-white/20 cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-mikasa-yellow focus:ring-offset-2 focus:bg-white/30"
            )}
            onKeyDown={onKeyDown}
        >
            {/* パルスアニメーション（枠のみ） */}
            {isServerPosition && (
                <div className="absolute inset-0 shadow-[0_0_20px_8px_rgba(250,204,21,0.6)] animate-pulse pointer-events-none" />
            )}

            {/* 位置番号 - 半透明バッジスタイル */}
            <div className="absolute top-1.5 left-1.5" style={{ zIndex: Z_INDEX.SLOT_BADGE }}>
                <div className="w-7 h-7 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/50 shadow-sm">
                    <span className="text-sm font-bold text-white drop-shadow-sm">
                        {slot}
                    </span>
                </div>
            </div>

            {/* 選手カード */}
            {player && (
                <motion.div
                    ref={setDraggableRef}
                    {...listeners}
                    layoutId={`player-${side}-${player.id}`}
                    layout
                    transition={{
                        layout: {
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                            duration: 0.5
                        }
                    }}
                    style={{
                        zIndex: Z_INDEX.PLAYER_CARD,
                        position: 'relative',
                        opacity: isDragging ? 0.5 : 1,
                    }}
                    className="flex flex-col items-center justify-center w-full max-h-[65%] bg-white rounded-lg shadow-md px-2 py-1 cursor-grab active:cursor-grabbing touch-none"
                >
                    <PositionBadge position={player.position} className="mb-0.5 flex-shrink-0" />
                    <span className="text-sm font-semibold text-slate-900 w-full text-center overflow-hidden text-ellipsis px-1" style={{ whiteSpace: 'nowrap', lineHeight: '1.2rem', height: '1.2rem' }}>
                        {player.lastName} {player.firstName}
                    </span>
                </motion.div>
            )}

            {!player && (
                <div className="text-white/30 text-xs uppercase tracking-wider font-medium">EMPTY</div>
            )}
        </div>
    );
});

CourtSlot.displayName = 'CourtSlot';
