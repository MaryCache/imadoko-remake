import type { CourtSlotId, CourtAssignment } from '../../../types';

// セッターローテーション設定の新しい型定義
export type SetterRotationPreset = {
    name: string; // "S1", "S2", etc.
    setterPosition: CourtSlotId; // セッターがいるポジション
    assignment: CourtAssignment; // 6人全体の配置
};
