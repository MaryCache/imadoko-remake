import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player } from '../../../types';
import { Zap } from 'lucide-react';

interface ServeIndicatorProps {
    isValid: boolean;
    message?: string;
    server: Player | null;
    isHudOpen: boolean;
}

/**
 * ServeIndicator - サーブ権インジケーター
 * 現在のサーバーと状態を視覚的に表示
 */
export const ServeIndicator: React.FC<ServeIndicatorProps> = ({ isValid, message, server, isHudOpen }) => {
    const show = isValid && server && message;

    return (
        <AnimatePresence>
            {show && isHudOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 100, scaleX: 0 }}
                    animate={{ opacity: 1, x: 0, scaleX: 1 }}
                    exit={{ opacity: 0, x: 100, scaleX: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    style={{ originX: 1 }}
                    className="w-full mb-2"
                >
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-2.5 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                            >
                                <Zap className="text-amber-500" size={18} />
                            </motion.div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-bold text-slate-900">{message}</span>
                                <span className="text-xs font-semibold text-indigo-600">
                                    サーバー: {server.lastName} ({server.position})
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
