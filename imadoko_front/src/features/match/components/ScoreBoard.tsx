import React from 'react';
import { RefreshCw, Plus, Minus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ScoreBoardProps {
  side: 'A' | 'B';
  sideOut: number;
  break_: number;
  onUpdateScore: (side: 'A' | 'B', type: 'so' | 'br', value: number) => void;
  isValid: boolean;
}

/**
 * ScoreBoard - 得点入力エリア
 * モバイル版: 縦圧縮 ＆ 横幅自動（左寄せ）
 */
export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  side,
  sideOut,
  break_,
  onUpdateScore,
  isValid,
}) => {
  const totalScore = sideOut + break_;

  return (
    <div className="bg-white rounded-xl p-2 sm:p-4 shadow-sm border border-slate-100 relative">
      {/* リセットボタン */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            onUpdateScore(side, 'so', 0);
            onUpdateScore(side, 'br', 0);
          }}
          className="w-6 h-6 sm:w-8 sm:h-8 !p-0 rounded-full shadow-sm"
          aria-label="得点リセット"
        >
          <RefreshCw size={12} className="sm:w-3.5 sm:h-3.5" />
        </Button>
      </div>

      {/* 全体のGap */}
      <div className="flex flex-col gap-2 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-4 w-full">
          {/* サイドアウト */}
          <div className="flex flex-col items-start flex-1">
            <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-2">
              サイドアウト
            </label>
            {/* 修正: w-full を削除し、内容量にフィットさせる (inline-flex or flex)
                           justify-between も削除（幅が固定じゃないので不要）
                        */}
            <div className="flex items-center bg-slate-50 rounded-lg p-0.5 sm:p-1 border border-slate-200">
              <button
                onClick={() => onUpdateScore(side, 'so', Math.max(0, sideOut - 1))}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
              >
                <Minus size={14} className="sm:w-4 sm:h-4" />
              </button>

              {/* 修正: flex-1 を削除し、固定幅 (w-10など) を指定して数字の桁数変化によるガタつきを防ぐ */}
              <span className="w-10 sm:w-12 text-center text-lg sm:text-xl font-bold text-slate-800 tabular-nums leading-none">
                {sideOut}
              </span>

              <button
                onClick={() => onUpdateScore(side, 'so', sideOut + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-white shadow-sm rounded border border-slate-200 transition-all active:scale-95"
              >
                <Plus size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* ブレイク */}
          <div className="flex flex-col items-start flex-1">
            <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-2">
              ブレイク
            </label>
            {/* 修正: w-full 削除 */}
            <div className="flex items-center bg-slate-50 rounded-lg p-0.5 sm:p-1 border border-slate-200">
              <button
                onClick={() => onUpdateScore(side, 'br', Math.max(0, break_ - 1))}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
              >
                <Minus size={14} className="sm:w-4 sm:h-4" />
              </button>

              {/* 修正: 固定幅 */}
              <span className="w-10 sm:w-12 text-center text-lg sm:text-xl font-bold text-slate-800 tabular-nums leading-none">
                {break_}
              </span>

              <button
                onClick={() => onUpdateScore(side, 'br', break_ + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-white shadow-sm rounded border border-slate-200 transition-all active:scale-95"
              >
                <Plus size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 合計得点表示 */}
        <div className="flex items-end justify-between pt-1 sm:pt-3 border-t border-slate-100 mt-0.5">
          <span className="text-[10px] sm:text-sm font-bold text-slate-500">合計得点</span>
          <span className="text-2xl sm:text-4xl font-black text-red-600 tabular-nums leading-none">
            {totalScore}
          </span>
        </div>
      </div>
    </div>
  );
};
