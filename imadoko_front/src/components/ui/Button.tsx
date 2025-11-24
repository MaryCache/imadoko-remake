import React, { memo } from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Button - 再利用可能なボタンコンポーネント
 *
 * クリック時のアニメーション効果を含む、スタイル化されたボタン
 *
 * @param variant - ボタンのスタイルバリアント (primary | secondary | danger | ghost)
 * @param size - ボタンのサイズ (sm | md | lg)
 */
export const Button = memo<ButtonProps>(
  ({ children, variant = 'primary', size = 'md', className, ...props }) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg active:animate-click-pulse hover:scale-105 active:scale-95';

    const variants = {
      primary:
        'bg-mikasa-blue-deep text-white hover:bg-mikasa-blue hover:shadow-md focus:ring-mikasa-yellow shadow-sm',
      secondary:
        'bg-white text-slate-700 border border-slate-300 hover:bg-mikasa-blue-light hover:shadow-md focus:ring-mikasa-yellow shadow-sm',
      danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md focus:ring-red-500 shadow-sm',
      ghost:
        'bg-transparent text-slate-600 hover:bg-mikasa-blue-light hover:text-mikasa-blue-deep hover:shadow-sm',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <button
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        aria-disabled={props.disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);
