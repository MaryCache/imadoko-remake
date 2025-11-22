'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

/**
 * ToastProvider - Toast通知システムのプロバイダー
 * アプリケーション全体を囲むように配置する
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string) => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts(prev => [...prev, { id, type, message }]);
        
        // 3秒後に自動削除
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const icons = {
        success: CheckCircle,
        error: XCircle,
        info: Info,
    };

    const colors = {
        success: 'bg-green-50 border-green-500 text-green-900',
        error: 'bg-red-50 border-red-500 text-red-900',
        info: 'bg-blue-50 border-blue-500 text-blue-900',
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => {
                        const Icon = icons[toast.type];
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 shadow-lg min-w-[300px] max-w-[400px] pointer-events-auto ${colors[toast.type]}`}
                                role="alert"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                <Icon size={20} className="flex-shrink-0" aria-hidden="true" />
                                <span className="font-medium flex-grow">{toast.message}</span>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                                    aria-label="通知を閉じる"
                                >
                                    <X size={16} aria-hidden="true" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

/**
 * useToast - Toast通知を表示するためのカスタムフック
 * 
 * @example
 * const { showToast } = useToast();
 * showToast('success', 'チームを保存しました');
 * showToast('error', '保存に失敗しました');
 */
export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};
