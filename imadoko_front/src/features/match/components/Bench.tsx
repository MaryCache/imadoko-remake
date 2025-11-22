import React, { memo, useState } from 'react';
import type { Player, CourtAssignment } from '../../../types';
import { GripVertical, RefreshCw, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { PositionBadge } from '../../../components/ui/PositionBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import clsx from 'clsx';

interface BenchProps {
    // 修正: nullを含む配列を受け取る
    players: (Player | null)[];
    assignment: CourtAssignment;
    side: 'A' | 'B';
    onResetBench?: () => void; // 変更: ベンチリセット
    droppableIdPrefix?: string; // 追加
}

/**
 * Bench - ベンチ/ロスター表示コンポーネント
 * dnd-kit対応版 (固定スロット方式)
 */
export const Bench = memo<BenchProps>(({ players, side, onResetBench, droppableIdPrefix }) => {

    // 修正: フィルタリングロジックを削除。親から渡されたplayers(null含む)をそのまま使う。
    // これにより、[PlayerA, null, PlayerB] のような「歯抜け」状態が維持される。

    // playersの長さが14未満なら埋める(念の為)
    const slots = [...players];
    while (slots.length < 14) slots.push(null);

    const [isExpanded, setIsExpanded] = useState(true);

    // 有効な選手数をカウント
    const validPlayerCount = players.filter(p => p !== null).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden"
        >
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-200/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Users className="text-slate-600" size={20} />
                    <h4 className="text-base font-bold text-slate-900">
                        選手一覧 ({validPlayerCount})
                    </h4>
                </div>
                {isExpanded ? (
                    <ChevronUp className="text-slate-600" size={20} />
                ) : (
                    <ChevronDown className="text-slate-600" size={20} />
                )}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 space-y-3">
                            <div className="flex justify-end">
                                {onResetBench && (
                                    <Button size="sm" variant="danger" onClick={onResetBench} title="選手一覧の位置をリセット" className="group">
                                        <RefreshCw size={14} />
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-2">
                                {slots.map((player, index) => (
                                    <BenchSlot
                                        key={index}
                                        index={index}
                                        player={player}
                                        side={side}
                                        droppableIdPrefix={droppableIdPrefix}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

const BenchSlot = ({ index, player, side, droppableIdPrefix }: { index: number, player: Player | null, side: 'A' | 'B', droppableIdPrefix?: string }) => {
    const prefix = droppableIdPrefix ? `${droppableIdPrefix}-` : '';
    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: `${prefix}bench-${side}-${index}`,
        data: {
            type: 'bench',
            side,
            index,
            player,
        },
    });

    const {
        attributes,
        listeners,
        setNodeRef: setDraggableRef,
        isDragging
    } = useDraggable({
        id: player ? `${prefix}bench-${side}-${index}-${player.id}` : `${prefix}bench-${side}-${index}-empty`,
        data: {
            type: 'bench',
            side,
            index,
            player,
        },
        disabled: !player,
    });

    return (
        <div
            ref={setDroppableRef}
            className={clsx(
                "flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 h-12",
                isOver ? "ring-2 ring-mikasa-blue ring-offset-1 bg-slate-200" : "",
                player
                    ? "bg-white border-slate-200 hover:border-mikasa-blue hover:shadow-md"
                    : "bg-slate-100 border-slate-300 border-dashed"
            )}
        >
            {player ? (
                <div
                    ref={setDraggableRef}
                    {...listeners}
                    {...attributes}
                    className={clsx(
                        "flex items-center gap-2 w-full h-full cursor-grab active:cursor-grabbing touch-none",
                        isDragging && "opacity-50"
                    )}
                >
                    <GripVertical size={14} className="text-slate-400 flex-shrink-0" />
                    <PositionBadge position={player.position} className="px-1.5 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-900 overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0">
                        {player.lastName} {player.firstName}
                    </span>
                </div>
            ) : (
                <span className="text-xs text-slate-400 mx-auto">空</span>
            )}
        </div>
    );
};