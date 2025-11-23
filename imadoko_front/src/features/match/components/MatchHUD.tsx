import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import type { Player } from '../../../types';
import { ServeIndicator } from './ServeIndicator';

interface MatchHUDProps {
    /** サーブ権情報 */
    serveStatus: {
        isValid: boolean;
        message?: string;
        server: Player | null;
    };
    /** 同じチーム選択の警告表示 */
    sameTeamWarning?: {
        show: boolean;
        teamName: string;
    };
    /** サイドアウト不正の警告メッセージ */
    warning?: string | null;
}

/**
 * MatchHUD - 試合中の情報を表示する右下HUD
 * 
 * トグルバーで開閉可能な通知パネル
 */
export const MatchHUD: React.FC<MatchHUDProps> = ({
    serveStatus,
    sameTeamWarning,
    warning
}) => {
    const [isHudOpen, setIsHudOpen] = useState(true);

    return (
        <div className="fixed bottom-15 right-0 z-50 flex items-end gap-0">
            {/* HUDコンテンツ */}
            <motion.div
                animate={{ width: isHudOpen ? 'auto' : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden"
            >
                <div className="w-80 flex flex-col items-end pr-2">
                    {/* サーブ権インジケーター */}
                    <ServeIndicator
                        isValid={serveStatus.isValid}
                        message={serveStatus.message}
                        server={serveStatus.server}
                        isHudOpen={isHudOpen}
                    />

                    {/* 同じチーム選択の警告 */}
                    <AnimatePresence>
                        {sameTeamWarning?.show && isHudOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: 100, scaleX: 0 }}
                                animate={{ opacity: 1, x: 0, scaleX: 1 }}
                                exit={{ opacity: 0, x: 100, scaleX: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                style={{ originX: 1 }}
                                className="w-full mb-2"
                            >
                                <div className="bg-amber-50 text-amber-800 px-3 py-2.5 rounded-lg border border-amber-300 shadow-lg backdrop-blur-sm">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle size={18} />
                                        <span className="text-sm font-medium">
                                            注意: 同じチーム「{sameTeamWarning.teamName}」
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* サイドアウト不正の警告 */}
                    <AnimatePresence>
                        {warning && isHudOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: 100, scaleX: 0 }}
                                animate={{ opacity: 1, x: 0, scaleX: 1 }}
                                exit={{ opacity: 0, x: 100, scaleX: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                style={{ originX: 1 }}
                                className="w-full mb-2"
                            >
                                <div className="bg-red-50 text-red-700 px-3 py-2.5 rounded-lg border border-red-200 shadow-lg backdrop-blur-sm">
                                    <div className="flex items-center gap-2">
                                        <motion.div
                                            animate={{ rotate: [0, -10, 10, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                                        >
                                            <AlertTriangle size={18} />
                                        </motion.div>
                                        <span className="text-sm font-medium">{warning}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* トグルバー */}
            <motion.button
                onClick={() => setIsHudOpen(!isHudOpen)}
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.98 }}
                aria-label={isHudOpen ? 'HUDを閉じる' : 'HUDを開く'}
                className="h-20 w-6 bg-gradient-to-br from-slate-700/90 via-slate-800/90 to-slate-900/90 hover:from-slate-600/90 hover:via-slate-700/90 hover:to-slate-800/90 backdrop-blur-md rounded-l-2xl shadow-lg flex items-center justify-center transition-all duration-200 border border-white/10 border-r-0"
                style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                }}
            >
                <motion.div
                    animate={{
                        rotate: isHudOpen ? 0 : 180,
                        scale: isHudOpen ? 1 : 0.9
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                    <ChevronRight className="text-white/80 hover:text-white" size={18} strokeWidth={2.5} />
                </motion.div>
            </motion.button>
        </div>
    );
};
