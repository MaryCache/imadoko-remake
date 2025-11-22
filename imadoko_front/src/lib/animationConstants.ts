/**
 * アニメーション設定の定数
 */
export const ANIMATION_DURATION = {
    /** ローテーション1ステップの所要時間（ms） */
    ROTATION_STEP: 500,
    /** カードの遷移時間（ms） */
    CARD_TRANSITION: 400,
    /** フェードインの時間（ms） */
    FADE_IN: 300,
    /** ホバー効果の時間（ms） */
    HOVER: 200,
} as const;

/**
 * バレーボールのルール関連定数
 * 
 * ✅ OpenAPI準拠: MIN_PLAYERS と MAX_PLAYERS は apiConstants.ts から取得
 * 定義元: openapi.yaml の minItems/maxItems
 * 
 * 🔄 更新方法:
 * 1. openapi.yaml を修正
 * 2. npm run generate:types を実行
 * 3. apiConstants.ts が自動更新される
 */
import { API_CONSTRAINTS } from '../types/apiConstants';

export const VOLLEYBALL_RULES = {
    /** 最小選手数 (openapi.yaml から自動生成) */
    MIN_PLAYERS: API_CONSTRAINTS.MIN_PLAYERS_PER_TEAM,
    /** 最大選手数 (openapi.yaml から自動生成) */
    MAX_PLAYERS: API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM,
    /** コート上のポジション数 */
    COURT_POSITIONS: 6,
    /** ローテーション順序（時計回り） */
    ROTATION_CYCLE: [1, 6, 5, 4, 3, 2] as const,
} as const;

/**
 * UI関連の定数
 */
export const UI_CONSTANTS = {
    /** Toast表示時間（ms） */
    TOAST_DURATION: 3000,
    /** デバウンス時間（ms） */
    DEBOUNCE_DELAY: 300,
    /** 最大入力文字数 */
    MAX_INPUT_LENGTH: 50,
} as const;

/**
 * S1-S6のポジション表示ラベル
 */
export const POSITION_LABELS: Record<number, string> = {
    1: 'S1',
    2: 'S2',
    3: 'S3',
    4: 'S4',
    5: 'S5',
    6: 'S6',
} as const;
