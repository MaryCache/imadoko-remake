import React, { memo } from 'react';
import type { Player, CourtAssignment, CourtSlotId } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { RefreshCw } from 'lucide-react';
import { useCourtAnimation } from '../hooks/useCourtAnimation';
import { useCourtKeyboard } from '../hooks/useCourtKeyboard';
import { CourtSlot } from './CourtSlot';
import clsx from 'clsx';

interface CourtBoardProps {
  assignment: CourtAssignment;
  readOnly?: boolean;
  label?: string;
  side: 'A' | 'B'; // サイド識別子（必須）
  isRotating?: boolean; // ローテーション中フラグ
  previousAssignment?: CourtAssignment; // 前回の配置
  onResetCourt?: () => void; // 変更: 配置リセット
  hasServe?: boolean; // サーブ権の有無
  onDrop?: (slot: CourtSlotId, player: Player) => void; // 追加
  onRemove?: (slot: CourtSlotId) => void; // 追加
  droppableIdPrefix?: string; // 追加
}

export const CourtBoard = memo<CourtBoardProps>(
  ({ assignment, label, side, previousAssignment, onResetCourt, hasServe = false }) => {
    const { isRotating } = useCourtAnimation(assignment);
    const { focusedSlot, setFocusedSlot, slotRefs, handleKeyDown } = useCourtKeyboard();

    // グリッド配置順序（前衛：4,3,2 / 後衛：5,6,1）
    const grid = [
      [4, 3, 2],
      [5, 6, 1],
    ] as const;

    return (
      <div className="space-y-3">
        {label && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{label}</h3>
            {onResetCourt && (
              <Button
                size="sm"
                variant="danger"
                onClick={onResetCourt}
                title="コート上の選手を全てベンチに戻す"
                className="group"
              >
                <RefreshCw size={14} />
              </Button>
            )}
          </div>
        )}

        <div
          className={clsx(
            'relative rounded-2xl p-4 sm:p-6 overflow-hidden transition-all duration-500',
            isRotating && 'scale-[1.02]'
          )}
          style={{
            background:
              'linear-gradient(135deg, rgba(2, 4, 43, 0.95) 0%, rgba(0, 56, 130, 0.9) 50%, rgba(0, 85, 164, 0.85) 100%)',
          }}
        >
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none" />

          <div className="relative z-10" style={{ isolation: 'isolate' }}>
            {/* コートキャンバス */}
            <div className="w-full aspect-[3/2] sm:aspect-[2/1.4]">
              {/* セル分割 */}
              <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-2 sm:gap-3">
                {grid.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    {row.map((slot) => (
                      <CourtSlot
                        key={`${slot}-${assignment[slot]?.id ?? 'empty'}`}
                        slot={slot}
                        player={assignment[slot]}
                        side={side}
                        hasServe={hasServe}
                        isFocused={focusedSlot === slot}
                        onKeyDown={(e) => handleKeyDown(slot, e)}
                        slotRef={(el) => {
                          slotRefs.current[slot] = el;
                        }}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
