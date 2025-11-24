import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  /** 表示するアイコン */
  icon: LucideIcon;
  /** タイトル */
  title: string;
  /** 説明文 */
  description: string;
  /** アクションボタン（オプション） */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 空状態の表示コンポーネント
 * データがない場合や初回訪問時に表示される統一UIコンポーネント
 *
 * @example
 * <EmptyState
 *   icon={Users}
 *   title="チームがまだありません"
 *   description="最初のチームを作成しましょう"
 *   action={{ label: '+ 新しいチームを作成', onClick: handleCreate }}
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-20 h-20 bg-mikasa-blue-light rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Icon className="text-mikasa-blue" size={40} aria-hidden="true" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-8 max-w-md leading-relaxed">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary" size="lg">
          {action.label}
        </Button>
      )}
    </div>
  );
};
