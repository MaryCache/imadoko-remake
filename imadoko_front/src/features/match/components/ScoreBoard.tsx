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
 * サイドアウトとブレイクポイントを管理
 */
export const ScoreBoard: React.FC<ScoreBoardProps> = ({ side, sideOut, break_, onUpdateScore, isValid }) => {
    const totalScore = sideOut + break_;

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative">
            {/* リセットボタン - 右上に配置 */}
            <div className="absolute top-4 right-4">
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                        onUpdateScore(side, 'so', 0);
                        onUpdateScore(side, 'br', 0);
                    }}
                    className="w-8 h-8 !p-0 rounded-full shadow-sm"
                    aria-label="得点リセット"
                >
                    <RefreshCw size={14} />
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                {/* モバイル: 縦並び / PC: 横並び */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">

                    {/* サイドアウト */}
                    <div className="flex flex-col items-start flex-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            サイドアウト
                        </label>
                        <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                            <button
                                onClick={() => onUpdateScore(side, 'so', Math.max(0, sideOut - 1))}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-12 text-center text-xl font-bold text-slate-800 tabular-nums">
                                {sideOut}
                            </span>
                            <button
                                onClick={() => onUpdateScore(side, 'so', sideOut + 1)}
                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-white shadow-sm rounded border border-slate-200 transition-all active:scale-95"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* ブレイク */}
                    <div className="flex flex-col items-start flex-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            ブレイク
                        </label>
                        <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                            <button
                                onClick={() => onUpdateScore(side, 'br', Math.max(0, break_ - 1))}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-12 text-center text-xl font-bold text-slate-800 tabular-nums">
                                {break_}
                            </span>
                            <button
                                onClick={() => onUpdateScore(side, 'br', break_ + 1)}
                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-white shadow-sm rounded border border-slate-200 transition-all active:scale-95"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 合計得点表示 */}
                <div className="flex items-end justify-between pt-3 border-t border-slate-100">
                    <span className="text-sm font-bold text-slate-500">合計得点</span>
                    <span className="text-4xl font-black text-red-600 tabular-nums leading-none">
                        {totalScore}
                    </span>
                </div>
            </div>
        </div>
    );
};
