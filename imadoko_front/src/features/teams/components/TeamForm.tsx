import React, { useState, Fragment } from 'react';
import type { Team, Player, Position, ApiError } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { POSITIONS } from '../../../lib/constants';
import { PositionBadge } from '../../../components/ui/PositionBadge';
import { sanitizeTeamName, sanitizePlayerName, validateArrayLength } from '../../../lib/sanitize';
import { API_CONSTRAINTS } from '../../../types/apiConstants';
import { X, Plus } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { motion, AnimatePresence } from 'framer-motion';

// ★ 追加: DnD 用インポート
import {
    DndContext,
    closestCenter,
    DragEndEvent,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface TeamFormProps {
    initialData?: Team;
    onSubmit: (data: Omit<Team, 'id'>) => Promise<void>;
    onCancel: () => void;
}

const EMPTY_PLAYER: Omit<Player, 'id'> = {
    firstName: '',
    lastName: '',
    position: 'WS',
};

// ★ 追加: 並べ替え用カードコンポーネント
interface SortablePlayerCardProps {
    id: string;
    index: number;
    player: Omit<Player, 'id'>;
    onPlayerChange: (index: number, field: keyof Omit<Player, 'id'>, value: string) => void;
    onRemove: (index: number) => void;
    canRemove: boolean;
}

const SortablePlayerCard: React.FC<SortablePlayerCardProps> = ({
    id,
    index,
    player,
    onPlayerChange,
    onRemove,
    canRemove,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:border-slate-200 transition-colors"
        >
            {/* ドラッグハンドル */}
            <div
                {...attributes}
                {...listeners}
                className="mt-2 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 touch-none"
                aria-label="ドラッグして並び替え"
            >
                <GripVertical size={20} />
            </div>

            {/* 選手フィールド */}
            <div className="grid grid-cols-2 sm:grid-cols-12 gap-3 flex-grow">
                {/* 姓 */}
                <div className="col-span-1 sm:col-span-4">
                    <Input
                        placeholder="姓"
                        value={player.lastName}
                        onChange={(e) => onPlayerChange(index, 'lastName', e.target.value)}
                        className="bg-white"
                        maxLength={30}
                    />
                </div>
                {/* 名 */}
                <div className="col-span-1 sm:col-span-4">
                    <Input
                        placeholder="名"
                        value={player.firstName}
                        onChange={(e) => onPlayerChange(index, 'firstName', e.target.value)}
                        className="bg-white"
                        maxLength={30}
                    />
                </div>
                {/* ポジション */}
                <div className="col-span-2 sm:col-span-4">
                    <Listbox
                        value={player.position}
                        onChange={(value) => onPlayerChange(index, 'position', value as Position)}
                    >
                        <div className="relative">
                            <Listbox.Button className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-mikasa-blue-light focus:border-mikasa-blue focus:bg-mikasa-blue-light transition-all duration-200 shadow-sm hover:shadow-md hover:border-mikasa-blue hover:bg-mikasa-blue-light font-medium text-left">
                                <span className="flex items-center gap-2">
                                    {player.position ? (
                                        <>
                                            <PositionBadge position={player.position} className="inline-block" />
                                            <span className="text-xs whitespace-nowrap">
                                                {POSITIONS.find((p) => p.value === player.position)?.label}
                                            </span>
                                        </>
                                    ) : (
                                        'ポジションを選択'
                                    )}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-slate-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options
                                    className={`absolute z-20 max-h-60 w-full overflow-auto rounded-xl bg-white p-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm ${index >= 4 ? 'bottom-full mb-1' : 'mt-1'
                                        }`}
                                >
                                    {POSITIONS.map((pos) => (
                                        <Listbox.Option
                                            key={pos.value}
                                            value={pos.value}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none py-2 pl-3 pr-9 rounded-lg transition-colors ${active
                                                    ? 'bg-mikasa-blue-light'
                                                    : 'text-slate-900'
                                                }`
                                            }
                                        >
                                            {({ selected }) => (
                                                <div className="flex items-center gap-2">
                                                    <PositionBadge position={pos.value} />
                                                    <span
                                                        className={`text-xs whitespace-nowrap ${selected ? 'font-semibold' : 'font-normal'
                                                            }`}
                                                    >
                                                        {pos.label}
                                                    </span>
                                                    {selected && (
                                                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-mikasa-blue">
                                                            <CheckIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
            </div>

            {/* 削除ボタン */}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                disabled={!canRemove}
                className="mt-1 text-slate-400 hover:text-red-600 hover:bg-red-50"
                title="選手を削除"
            >
                <X size={18} />
            </Button>
        </motion.div>
    );
};

/**
 * TeamForm - チーム作成・編集フォームコンポーネント
 *
 * @param initialData - 編集時の初期データ(新規作成時はundefined)
 * @param onSubmit - フォーム送信時のコールバック
 * @param onCancel - キャンセル時のコールバック
 */
export const TeamForm: React.FC<TeamFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [teamName, setTeamName] = useState(initialData?.teamName || '');
    const [players, setPlayers] = useState<Omit<Player, 'id'>[]>(
        initialData?.players.map((p) => ({ ...p })) ||
        // 初期表示は6人分のフィールドを表示（バレーボールの基本人数）
        Array(6)
            .fill(null)
            .map(() => ({ ...EMPTY_PLAYER })),
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // ★ 追加: DnD センサー設定（PC: マウス / モバイル: 長押し）
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
    );

    const handlePlayerChange = (
        index: number,
        field: keyof Omit<Player, 'id'>,
        value: string,
    ) => {
        const newPlayers = [...players];
        newPlayers[index] = { ...newPlayers[index], [field]: value };
        setPlayers(newPlayers);
    };

    const addPlayer = () => {
        if (players.length < API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM) {
            setPlayers([...players, { ...EMPTY_PLAYER }]);
        }
    };

    const removePlayer = (index: number) => {
        if (players.length > 1) {
            setPlayers(players.filter((_, i) => i !== index));
        }
    };

    // ★ 追加: DnD 並び替えロジック
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setPlayers((items) => {
                const oldIndex = items.findIndex((_, i) => `player-${i}` === active.id);
                const newIndex = items.findIndex((_, i) => `player-${i}` === over.id);
                if (oldIndex === -1 || newIndex === -1) return items;
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // 入力値のサニタイゼーション
            const sanitizedTeamName = sanitizeTeamName(teamName);
            const sanitizedPlayers = validateArrayLength(
                players.map((p) => ({
                    ...p,
                    firstName: sanitizePlayerName(p.firstName),
                    lastName: sanitizePlayerName(p.lastName),
                })),
                API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM,
            );

            // 基本バリデーション
            if (!sanitizedTeamName.trim()) {
                setSubmitError('チーム名を入力してください');
                setIsSubmitting(false);
                return;
            }

            const validPlayers = sanitizedPlayers.filter(
                (p) => p.firstName.trim() && p.lastName.trim() && p.position,
            );

            if (validPlayers.length === 0) {
                setSubmitError('少なくとも1人の選手を登録してください');
                setIsSubmitting(false);
                return;
            }

            await onSubmit({
                teamName: sanitizedTeamName,
                players: validPlayers as Player[],
            });
        } catch (error) {
            const apiError = error as ApiError;
            const errorMsg =
                apiError?.response?.data?.message || 'フォームの送信に失敗しました';
            setSubmitError(errorMsg);
            // エラーはuseTeamsフックでログ済み
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200"
            aria-label={initialData ? 'チーム編集フォーム' : 'チーム作成フォーム'}
        >
            {submitError && (
                <div
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                    role="alert"
                    aria-live="assertive"
                >
                    <p className="font-medium">{submitError}</p>
                </div>
            )}

            <div className="max-w-md">
                <Input
                    label="チーム名"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="チーム名を入力"
                    maxLength={50}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                        選手 ({players.length}/{API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM})
                    </h3>
                    {players.length < API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM && (
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={addPlayer}
                            className="gap-1"
                        >
                            <Plus size={16} />
                            選手を追加
                        </Button>
                    )}
                </div>

                {/* ★ 置き換え: DnD 対応リスト */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={players.map((_, i) => `player-${i}`)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {players.map((player, index) => (
                                    <SortablePlayerCard
                                        key={`player-${index}`}
                                        id={`player-${index}`}
                                        index={index}
                                        player={player}
                                        onPlayerChange={handlePlayerChange}
                                        onRemove={removePlayer}
                                        canRemove={players.length > 1}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                    キャンセル
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '保存中...' : 'チームを保存'}
                </Button>
            </div>
        </form>
    );
};
