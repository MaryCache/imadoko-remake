import React, { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import type { Team, Player, CourtSlotId, SetterRotationConfig } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { RotateCw, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SetterRotationPanelProps {
  /** チーム情報（セッターと他の選手を含む） */
  team: Team | null;
  /** どちらのサイドか（A または B） */
  side: 'A' | 'B';
  /** ローテーション適用時のコールバック */
  onApplyRotation: (side: 'A' | 'B', config: SetterRotationConfig) => void;
  /** 現在のコート配置（セッター位置判定用） */
  currentAssignment: Record<CourtSlotId, Player | null>;
}

// S1-S6のボタン表示用ラベル（定数化で再生成を防止）
const POSITION_LABELS: Record<CourtSlotId, string> = {
  1: 'S1',
  2: 'S2',
  3: 'S3',
  4: 'S4',
  5: 'S5',
  6: 'S6',
};

/**
 * SetterRotationPanel - セッターを軸にしたローテーション設定コンポーネント
 *
 * セッターと配置位置（S1-S6）を選択し、自動的にローテーションを生成します。
 * 折りたたみ可能で視界を確保できます。
 *
 * @param team - 対象チーム
 * @param side - サイド（A または B）
 * @param onApplyRotation - ローテーション適用コールバック
 */
export const SetterRotationPanel: React.FC<SetterRotationPanelProps> = ({
  team,
  side,
  onApplyRotation,
  currentAssignment,
}) => {
  const { showToast } = useToast();
  const [selectedSetter, setSelectedSetter] = useState<Player | null>(null);
  const [targetPosition, setTargetPosition] = useState<CourtSlotId>(1);
  const [isExpanded, setIsExpanded] = useState(false); // 折りたたみ状態

  // 現在のセッター位置を判定
  const currentSetterPosition = selectedSetter
    ? Object.entries(currentAssignment).find(([_, player]) => player?.id === selectedSetter.id)?.[0]
      ? Number(
          Object.entries(currentAssignment).find(
            ([_, player]) => player?.id === selectedSetter.id
          )?.[0]
        )
      : undefined
    : undefined;

  // チームがない場合は何も表示しない
  if (!team || team.players.length < 6) {
    return null;
  }

  // セッターポジションの選手を抽出
  const setters = team.players.filter((p) => p.position === 'S');

  // セッター以外の選手
  const otherPlayers = team.players.filter((p) => p.id !== selectedSetter?.id);

  /**
   * ローテーション適用ハンドラー（新ロジック）
   * 現在のコート状態を基準に、選択されたS番号までローテーション
   */
  const handleApply = (position: CourtSlotId) => {
    if (!selectedSetter) {
      showToast('error', 'セッターを選択してください');
      return;
    }

    const config: SetterRotationConfig = {
      setter: selectedSetter,
      targetPosition: position,
      otherPlayers: [], // 新ロジックでは不要
    };

    onApplyRotation(side, config);
    // パネルは開いたまま（連続でローテーション可能に）
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200 shadow-sm overflow-hidden"
    >
      {/* ヘッダー（常に表示・クリック可能） */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-indigo-100/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <RotateCw className="text-indigo-600" size={20} />
          <h4 className="text-base font-bold text-indigo-900">セッターローテーション設定</h4>
        </div>
        {isExpanded ? (
          <ChevronUp className="text-indigo-600" size={20} />
        ) : (
          <ChevronDown className="text-indigo-600" size={20} />
        )}
      </button>

      {/* 展開可能なコンテンツ */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 space-y-4">
              {/* セッター選択 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  セッターを選択
                  {setters.length === 0 && (
                    <span className="text-red-600 ml-2 text-xs">(セッターがいません)</span>
                  )}
                </label>
                <Listbox
                  value={selectedSetter}
                  onChange={setSelectedSetter}
                  disabled={setters.length === 0}
                >
                  <div className="relative">
                    <Listbox.Button
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-sky-200/60 bg-white text-slate-900 
                                     focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 focus:bg-sky-50/50
                                     transition-all duration-200 shadow-sm hover:shadow-md hover:border-sky-300 hover:bg-sky-50/30
                                     font-medium disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                      <span className="block truncate">
                        {selectedSetter
                          ? `${selectedSetter.lastName} ${selectedSetter.firstName}`
                          : '-- セッターを選択 --'}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronUpDownIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white p-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {setters.length === 0 ? (
                          <div className="p-2 text-slate-500 text-xs text-center">
                            候補がいません
                          </div>
                        ) : (
                          setters.map((setter) => (
                            <Listbox.Option
                              key={setter.id}
                              value={setter}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2 pl-10 pr-4 rounded-lg transition-colors ${
                                  active ? 'bg-sky-100 text-sky-900' : 'text-slate-700'
                                }`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}
                                  >
                                    {setter.lastName} {setter.firstName}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))
                        )}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* 配置位置選択 (S1-S6) - CourtBoardと同じレイアウト */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  初期配置位置 (S1-S6)
                  <span className="text-xs text-slate-500 ml-2">※コートと同じ配置</span>
                </label>
                {/* CourtBoardと同じ配置: 一行目4,3,2 二行目5,6,1 */}
                <div className="grid grid-cols-3 grid-rows-2 gap-2">
                  {/* Front Row */}
                  {[4, 3, 2].map((pos) => {
                    const isCurrent = currentSetterPosition === pos;
                    return (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => handleApply(pos as CourtSlotId)}
                        disabled={!selectedSetter}
                        className={`px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                          !selectedSetter
                            ? 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed'
                            : isCurrent
                              ? 'bg-slate-300 text-slate-700 border-2 border-slate-400 shadow-sm'
                              : 'bg-sky-500 text-white border-2 border-sky-300 shadow-md hover:shadow-lg hover:bg-sky-600 active:scale-95'
                        }`}
                      >
                        {POSITION_LABELS[pos as CourtSlotId]}
                      </button>
                    );
                  })}
                  {/* Back Row */}
                  {[5, 6, 1].map((pos) => {
                    const isCurrent = currentSetterPosition === pos;
                    return (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => handleApply(pos as CourtSlotId)}
                        disabled={!selectedSetter}
                        className={`px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                          !selectedSetter
                            ? 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed'
                            : isCurrent
                              ? 'bg-slate-300 text-slate-700 border-2 border-slate-400 shadow-sm'
                              : 'bg-sky-500 text-white border-2 border-sky-300 shadow-md hover:shadow-lg hover:bg-sky-600 active:scale-95'
                        }`}
                      >
                        {POSITION_LABELS[pos as CourtSlotId]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ヘルプテキスト */}
              <p className="text-xs text-slate-600 bg-white/60 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                <span className="font-semibold text-indigo-700">💡 使い方:</span>
                <br />
                1. セッターを選択
                <br />
                2. S1～S6のボタンをクリック → 即座にローテーション！
                <br />
                3. 何度でもクリックして連続ローテーション可能
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
