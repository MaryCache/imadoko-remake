import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

/**
 * ErrorMessage - エラー状態を表示するコンポーネント
 * 
 * @param title - エラーのタイトル
 * @param message - エラーメッセージ
 * @param onRetry - 再試行ボタンのハンドラ（省略時はボタン非表示）
 * @param className - 追加のCSSクラス
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    title = 'エラーが発生しました',
    message,
    onRetry,
    className = ''
}) => {
    return (
        <div 
            className={`bg-red-50 border-2 border-red-200 rounded-xl p-6 space-y-4 ${className}`}
            role="alert"
            aria-live="assertive"
        >
            <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-600 flex-shrink-0" size={24} aria-hidden="true" />
                <h3 className="text-lg font-semibold text-red-900">{title}</h3>
            </div>
            <p className="text-red-700">{message}</p>
            {onRetry && (
                <Button 
                    variant="secondary" 
                    onClick={onRetry} 
                    className="gap-2"
                >
                    <RefreshCw size={16} />
                    再試行
                </Button>
            )}
        </div>
    );
};
