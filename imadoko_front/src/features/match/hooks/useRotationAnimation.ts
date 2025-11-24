import { useState, useEffect } from 'react';
import type { CourtAssignment } from '../../../types';
import { ANIMATION_DURATION } from '../../../lib/animationConstants';

/**
 * useRotationAnimation - ローテーションアニメーション管理フック
 * サイドアウト変更時のアニメーション状態を管理
 */
export const useRotationAnimation = (
  sideOut: number,
  assignment: CourtAssignment
): {
  isRotating: boolean;
  previousAssignment: CourtAssignment;
} => {
  const [prevSideOut, setPrevSideOut] = useState(sideOut);
  const [isRotating, setIsRotating] = useState(false);
  const [previousAssignment, setPreviousAssignment] = useState(assignment);

  useEffect(() => {
    if (sideOut !== prevSideOut) {
      setPreviousAssignment(assignment);
      setIsRotating(true);
      setTimeout(() => setIsRotating(false), ANIMATION_DURATION.CARD_TRANSITION);
      setPrevSideOut(sideOut);
    }
  }, [sideOut, prevSideOut, assignment]);

  return { isRotating, previousAssignment };
};
