import React from 'react';
import clsx from 'clsx';
import { validateXSSPatterns } from '../../lib/xssHelpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    validateOnChange?: boolean; // XSS検証を有効化
}

export const Input: React.FC<InputProps> = ({ 
    label, 
    error, 
    className, 
    validateOnChange = true,
    onChange,
    id,
    ...props 
}) => {
    const inputId = id || `input-${React.useId()}`;
    const errorId = error ? `${inputId}-error` : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 開発環境でXSSパターンを検証
        if (validateOnChange && e.target.value) {
            validateXSSPatterns(e.target.value);
        }
        onChange?.(e);
    };

    return (
        <div className="space-y-1">
            {label && (
                <label 
                    htmlFor={inputId}
                    className="block text-sm font-medium text-slate-700"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={clsx(
                    "w-full px-3 py-2 rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:bg-slate-50 transition-shadow",
                    error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-slate-300 focus:border-mikasa-blue focus:ring-mikasa-yellow",
                    className
                )}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={errorId}
                onChange={handleChange}
                {...props}
            />
            {error && (
                <span 
                    id={errorId}
                    className="text-sm text-red-600"
                    role="alert"
                >
                    {error}
                </span>
            )}
        </div>
    );
};
