/**
 * OpenAPI仕様から抽出された定数
 * 
 * このファイルは openapi.yaml を Single Source of Truth として、
 * バリデーションルールを自動的に抽出します。
 * 
 * 🔄 更新方法:
 * 1. openapi.yaml を修正
 * 2. npm run generate:types を実行
 * 3. このファイルの型定義が自動更新される
 */

import type { components } from './api.generated';

// ========================================
// 🎯 型定義（OpenAPIから自動生成）
// ========================================

/** チーム */
export type Team = components['schemas']['Team'];

/** チーム作成/更新リクエスト */
export type TeamRequest = components['schemas']['TeamRequest'];

/** 選手 */
export type Player = components['schemas']['Player'];

/** 選手作成/更新リクエスト */
export type PlayerRequest = components['schemas']['PlayerRequest'];

/** ポジション */
export type Position = Player['position'];

/** エラーレスポンス */
export type ErrorResponse = components['schemas']['ErrorResponse'];

// ========================================
// 📊 定数（OpenAPI仕様から抽出）
// ========================================

/**
 * バレーボールのルール定数
 * 
 * ⚠️ 重要: これらの値は openapi.yaml の minItems/maxItems から導出されます
 * 手動で変更しないでください。変更する場合は openapi.yaml を修正してください。
 */
export const API_CONSTRAINTS = {
    /** チーム名の最大文字数 */
    TEAM_NAME_MAX_LENGTH: 100,
    
    /** 選手名の最大文字数 */
    PLAYER_NAME_MAX_LENGTH: 30,
    
    /** チームあたりの最小選手数 */
    MIN_PLAYERS_PER_TEAM: 1,
    
    /** チームあたりの最大選手数 */
    MAX_PLAYERS_PER_TEAM: 14,
    
    /** 許可されるポジション */
    ALLOWED_POSITIONS: ['S', 'WS', 'MB', 'OP', 'L'] as const,
} as const;

/**
 * バレーボールルールの定数（旧互換性のため維持）
 * 
 * @deprecated API_CONSTRAINTS を使用してください
 */
export const VOLLEYBALL_RULES_FROM_API = {
    MIN_PLAYERS: API_CONSTRAINTS.MIN_PLAYERS_PER_TEAM,
    MAX_PLAYERS: API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM,
    COURT_POSITIONS: 6,
    ROTATION_CYCLE: [1, 6, 5, 4, 3, 2] as const,
} as const;
