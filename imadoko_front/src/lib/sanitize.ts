/**
 * sanitize.ts - 入力値サニタイゼーションユーティリティ
 * XSS攻撃を防ぐため、危険な文字列をエスケープ
 */

/**
 * HTMLタグと危険な文字をエスケープ
 */
export const sanitizeHtml = (input: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return input.replace(/[&<>"'/]/g, (char) => map[char]);
};

/**
 * チーム名のバリデーションとサニタイゼーション
 * - 最大50文字
 * - 危険な文字をエスケープ
 */
export const sanitizeTeamName = (name: string): string => {
  const trimmed = name.trim().slice(0, 50);
  return sanitizeHtml(trimmed);
};

/**
 * 選手名のバリデーションとサニタイゼーション
 * - 最大30文字
 * - 危険な文字をエスケープ
 */
export const sanitizePlayerName = (name: string): string => {
  const trimmed = name.trim().slice(0, 30);
  return sanitizeHtml(trimmed);
};

/**
 * ポジション名のバリデーション
 * - 許可されたポジションのみ受け付け
 */
const ALLOWED_POSITIONS = ['S', 'WS', 'MB', 'OP', 'L'] as const;
export type Position = (typeof ALLOWED_POSITIONS)[number];

export const sanitizePosition = (position: string): Position | null => {
  const upper = position.toUpperCase().trim();
  return ALLOWED_POSITIONS.includes(upper as Position) ? (upper as Position) : null;
};

/**
 * 数値のバリデーション
 * - 範囲チェック付き
 */
export const sanitizeNumber = (value: number | string, min = 0, max = 999): number => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
};

/**
 * 配列の長さチェック
 * - 大量のデータ送信を防止
 */
export const validateArrayLength = <T>(array: T[], maxLength: number): T[] => {
  return array.slice(0, maxLength);
};
