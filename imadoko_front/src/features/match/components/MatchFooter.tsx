import React from 'react';

interface MatchFooterProps {
    teamAName: string;
    teamBName: string;
    scoresA: { sets: number; points: number; so: number; br: number };
    scoresB: { sets: number; points: number; so: number; br: number };
}

export const MatchFooter: React.FC<MatchFooterProps> = ({
    teamAName,
    teamBName,
    scoresA,
    scoresB,
}) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40">
            {/* グラデーションボーダー（上部） */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

            {/* メインフッター (Glassmorphism & Safe Area) */}
            <div className="bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] pb-safe">
                <div className="container mx-auto px-2 py-2 max-w-7xl">
                    <div className="flex items-center justify-between gap-1 sm:gap-4">

                        {/* Team A Panel */}
                        <div className="flex-1 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-100 px-2 sm:px-3 py-1.5 shadow-sm">
                            <div className="flex flex-col min-w-0 overflow-hidden">
                                <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                                    {teamAName}
                                </span>
                                <div className="flex gap-1.5 text-[10px] sm:text-xs text-slate-500 font-medium">
                                    <span className="bg-slate-100 px-1 rounded">SO:{scoresA.so}</span>
                                    <span className="bg-slate-100 px-1 rounded">BR:{scoresA.br}</span>
                                </div>
                            </div>
                            <span className="text-2xl sm:text-3xl font-black text-mikasa-blue-deep ml-2 tabular-nums tracking-tight">
                                {scoresA.points}
                            </span>
                        </div>

                        {/* VS / Sets Info */}
                        <div className="flex flex-col items-center px-1 sm:px-2 shrink-0">
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase">SETS</span>
                            <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                                <span>{scoresA.sets}</span>
                                <span className="text-slate-300 text-xs">-</span>
                                <span>{scoresB.sets}</span>
                            </div>
                        </div>

                        {/* Team B Panel */}
                        <div className="flex-1 flex items-center justify-between bg-gradient-to-l from-slate-50 to-white rounded-lg border border-slate-100 px-2 sm:px-3 py-1.5 shadow-sm">
                            <span className="text-2xl sm:text-3xl font-black text-mikasa-blue-deep mr-2 tabular-nums tracking-tight">
                                {scoresB.points}
                            </span>
                            <div className="flex flex-col items-end min-w-0 overflow-hidden">
                                <span className="text-xs sm:text-sm font-bold text-slate-800 truncate text-right">
                                    {teamBName}
                                </span>
                                <div className="flex gap-1.5 text-[10px] sm:text-xs text-slate-500 font-medium">
                                    <span className="bg-slate-100 px-1 rounded">SO:{scoresB.so}</span>
                                    <span className="bg-slate-100 px-1 rounded">BR:{scoresB.br}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};