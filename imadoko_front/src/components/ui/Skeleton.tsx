import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  /** カスタムクラス名 */
  className?: string;
}

/**
 * スケルトンローディング（コンテンツ読み込み中の代替表示）
 *
 * @example
 * <Skeleton className="h-6 w-3/4" />
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={clsx('animate-pulse bg-slate-200 rounded', className)}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="読み込み中"
    />
  );
};

/**
 * チームカードのスケルトン
 */
export const TeamCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-4">
      <Skeleton className="h-7 w-2/3" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
};

/**
 * コートのスケルトン
 */
export const CourtSkeleton: React.FC = () => {
  return (
    <div
      className="bg-white rounded-xl p-6 border border-slate-200 space-y-4"
      style={{ minHeight: '600px' }}
    >
      {/* チーム選択 */}
      <Skeleton className="h-10 w-full rounded-lg" />

      {/* スコアボード */}
      <div className="bg-slate-50 rounded-lg p-4 space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      </div>

      {/* コート */}
      <div className="bg-slate-100 rounded-2xl p-4 space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-rows-2 gap-2">
          {[0, 1].map((row) => (
            <div key={row} className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((col) => (
                <Skeleton key={col} className="aspect-square rounded-lg" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ベンチ */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};
