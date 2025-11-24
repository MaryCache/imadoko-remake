'use client';

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// [変更点] isHovered を受け取れるように拡張
interface IconProps {
  className?: string;
  color?: string;
  size?: number;
  isHovered?: boolean;
}

// ==========================================
// MatchIcon (CSS Pause Control)
// ==========================================
export const MatchIcon: React.FC<IconProps> = ({
  className,
  color = 'currentColor',
  size = 24,
  isHovered = false,
}) => {
  // 左右の隙間を埋めたパス (シームレス用)
  const seamlessPath = 'M24 12 L22 12 h-4l-3 9L9 3l-3 9H2 L0 12';

  return (
    <div
      className={clsx('relative overflow-hidden', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* [トリック解説]
                    Framer Motionではなく、生のCSSアニメーションを使用します。
                    animation-play-state を切り替えることで、
                    「その場で一時停止」「続きから再生」が物理的に可能になります。
                */}
        <g
          style={{
            // 24px分(アイコン1個分)を1.5秒かけて移動し続ける
            animation: 'infinite-scroll 1.5s linear infinite',
            // ここが魔法のスイッチ！
            // ホバー中なら "running"(再生)、外したら "paused"(一時停止)
            animationPlayState: isHovered ? 'running' : 'paused',
            // 2個並べているので幅は2倍
            width: '200%',
            display: 'flex',
          }}
        >
          {/* インラインスタイルでKeyframesを定義してしまう（Next.jsのCSSModule依存を避けるため） */}
          <style>
            {`
                            @keyframes infinite-scroll {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-24px); }
                            }
                        `}
          </style>

          {/* 1つ目 */}
          <path d={seamlessPath} />

          {/* 2つ目 (右隣に配置) */}
          <g transform="translate(24, 0)">
            <path d={seamlessPath} />
          </g>
        </g>
      </svg>
    </div>
  );
};

// ==========================================
// TeamIcon (Team) - 完全制御版
// ==========================================
export const TeamIcon: React.FC<IconProps> = ({
  className,
  color = 'currentColor',
  size = 24,
  isHovered = false,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx('overflow-visible', className)}
    >
      {/* 手前の人 */}
      <motion.g
        animate={isHovered ? { y: -3 } : { y: 0 }}
        transition={
          isHovered
            ? {
                duration: 0.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
              }
            : {
                // [重要] ホバー解除時はスプリングで即座に戻る（ループ設定なし）
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }
        }
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </motion.g>

      {/* 奥の人 */}
      <motion.g
        animate={isHovered ? { y: -3 } : { y: 0 }}
        transition={
          isHovered
            ? {
                duration: 0.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
                delay: 0.1,
              }
            : {
                // [重要] ホバー解除時
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }
        }
      >
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </motion.g>
    </svg>
  );
};

// ==========================================
// UsageIcon (Book) - State対応版
// ==========================================
export const UsageIcon: React.FC<IconProps> = ({
  className,
  color = 'currentColor',
  size = 24,
  isHovered = false,
}) => {
  // 共通設定: ホバー時はループ、解除時は0.2秒で戻る
  const transitionSettings = isHovered
    ? {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
      }
    : {
        duration: 0.2,
      };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx('overflow-visible', className)}
      style={{ perspective: '1000px' }}
    >
      <motion.g
        style={{ originX: 0.5, originY: 0.5 }}
        animate={{ rotateY: isHovered ? -10 : 0 }}
        transition={transitionSettings}
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />

        {/* ページ1 */}
        <motion.path
          d="M10 6h6"
          animate={
            isHovered
              ? { pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={
            isHovered ? { ...transitionSettings, times: [0, 0.3, 0.7, 1] } : { duration: 0.2 }
          }
        />
        {/* ページ2 */}
        <motion.path
          d="M10 10h6"
          animate={
            isHovered
              ? { pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={
            isHovered
              ? { ...transitionSettings, times: [0, 0.3, 0.7, 1], delay: 0.3 }
              : { duration: 0.2 }
          }
        />
        {/* ページ3 */}
        <motion.path
          d="M10 14h6"
          animate={
            isHovered
              ? { pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }
              : { pathLength: 1, opacity: 1 }
          }
          transition={
            isHovered
              ? { ...transitionSettings, times: [0, 0.3, 0.7, 1], delay: 0.6 }
              : { duration: 0.2 }
          }
        />
      </motion.g>
    </svg>
  );
};
