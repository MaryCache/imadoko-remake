import { useState, useEffect, useRef } from 'react';
import type { CourtAssignment } from '@/types';

/**
 * コートローテーションアニメーション管理フック
 *
 * 配置が変更された際に、短時間アニメーション状態をtrueにして、
 * UIにローテーション中の視覚効果を適用するためのフックです。
 *
 * @param assignment - 現在のコート配置
 * @returns isRotating - アニメーション中かどうか, prevAssign - 前回の配置
 *
 * @example
 * const { isRotating, prevAssign } = useCourtAnimation(assignment);
 *
 * <div className={isRotating ? 'scale-[1.02]' : ''}>
 *   {/* コート表示 *\/}
 * </div>
 */
export const useCourtAnimation = (assignment: CourtAssignment) => {
  const [isRotating, setIsRotating] = useState(false);
  const [prevAssign, setPrevAssign] = useState<CourtAssignment>(assignment);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 配置が変更されたかチェック（選手IDで比較）
    const assignmentChanged = Object.keys(assignment).some((key) => {
      const slotId = Number(key) as keyof CourtAssignment;
      return assignment[slotId]?.id !== prevAssign[slotId]?.id;
    });

    if (assignmentChanged) {
      setIsRotating(true);

      // 既存のタイマーをクリア（連続変更に対応）
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }

      // 500ms後にアニメーション終了
      animationTimerRef.current = setTimeout(() => {
        setIsRotating(false);
      }, 500);
    }

    setPrevAssign(assignment);

    // クリーンアップ: アンマウント時にタイマーをクリア（メモリリーク防止）
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [assignment, prevAssign]);

  return { isRotating, prevAssign };
};
