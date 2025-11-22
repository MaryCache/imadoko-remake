import React, { memo } from 'react';
import clsx from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card = memo<CardProps>(({ children, className, title }) => {
    return (
        <div className={clsx("bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", className)}>
            {title && (
                <div className="px-6 py-4 border-b border-mikasa-blue-light bg-mikasa-blue-light">
                    <h3 className="text-lg font-semibold text-mikasa-blue-deep">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
});
