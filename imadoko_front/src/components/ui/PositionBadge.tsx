import React from 'react';
import { getPositionStyles } from '@/lib/constants';
import type { Position } from '@/types';

interface PositionBadgeProps {
    position: Position;
    className?: string;
}

/**
 * ポジションバッジコンポーネント
 * ポジション（S, WS, MB, OP, Li）を統一されたスタイルで表示
 */
export const PositionBadge: React.FC<PositionBadgeProps> = ({ position, className = '' }) => {
    return (
        <span 
            className={`text-xs font-bold px-2 py-0.5 rounded-full border min-w-[2.5rem] text-center ${getPositionStyles(position)} ${className}`}
        >
            {position}
        </span>
    );
};
