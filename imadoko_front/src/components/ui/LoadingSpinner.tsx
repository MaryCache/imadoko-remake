import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * LoadingSpinner - ローディング状態を表示するスピナーコンポーネント
 *
 * @param size - スピナーのサイズ（sm: 16px, md: 32px, lg: 48px）
 * @param className - 追加のCSSクラス
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`} aria-busy="true">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-mikasa-blue-light border-t-mikasa-blue`}
        role="status"
        aria-label="読み込み中"
      >
        <span className="sr-only">読み込み中...</span>
      </div>
    </div>
  );
};
