import React from 'react';
import { Button } from '../../../components/ui/Button';
import { RefreshCw } from 'lucide-react';

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
        <div className="bg-slate-50 p-4 rounded-lg relative">
            <Button
                size="sm"
                variant="danger"
                onClick={() => {
                    onUpdateScore(side, 'so', 0);
                    onUpdateScore(side, 'br', 0);
                }}
                className="absolute top-10 right-0"
            >
                <RefreshCw size={14} />
            </Button>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 uppercase tracking-wider">サイドアウト</label>
                    <div className="flex items-center gap-3">
                        <Button size="sm" variant="secondary" onClick={() => onUpdateScore(side, 'so', sideOut - 1)}>
                            -
                        </Button>
                        <input
                            type="number"
                            min="0"
                            value={sideOut}
                            onChange={(e) => onUpdateScore(side, 'so', parseInt(e.target.value) || 0)}
                            className="text-2xl font-bold text-slate-900 w-16 text-center border-2 border-slate-200 rounded-lg focus:border-sky-400 focus:outline-none appearance-none"
                            style={{ textAlign: 'center' }}
                            suppressHydrationWarning={true}
                        />
                        <Button size="sm" variant="secondary" onClick={() => onUpdateScore(side, 'so', sideOut + 1)}>
                            +
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 uppercase tracking-wider">ブレイク</label>
                    <div className="flex items-center gap-3">
                        <Button size="sm" variant="secondary" onClick={() => onUpdateScore(side, 'br', break_ - 1)}>
                            -
                        </Button>
                        <input
                            type="number"
                            min="0"
                            value={break_}
                            onChange={(e) => onUpdateScore(side, 'br', parseInt(e.target.value) || 0)}
                            className="text-2xl font-bold text-slate-900 w-16 text-center border-2 border-slate-200 rounded-lg focus:border-sky-400 focus:outline-none appearance-none"
                            style={{ textAlign: 'center' }}
                            suppressHydrationWarning={true}
                        />
                        <Button size="sm" variant="secondary" onClick={() => onUpdateScore(side, 'br', break_ + 1)}>
                            +
                        </Button>
                    </div>
                </div>
                <div className="col-span-2 pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="font-medium text-slate-600">合計得点</span>
                    <span className={`text-3xl font-bold ${!isValid ? 'text-red-600' : 'text-indigo-600'}`}>
                        {totalScore}
                    </span>
                </div>
            </div>
        </div>
    );
};
