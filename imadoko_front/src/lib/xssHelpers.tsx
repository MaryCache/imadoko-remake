/**
 * XSS対策 - React表示用ヘルパー
 *
 * Reactは基本的に自動エスケープするが、明示的なサニタイゼーションで
 * 二重の安全性を確保
 */

import { sanitizeHtml } from './sanitize';

/**
 * 安全な文字列表示
 * Reactのデフォルトエスケープに加えて、明示的にサニタイゼーション
 */
export const SafeText: React.FC<{ children: string }> = ({ children }) => {
  return <>{sanitizeHtml(children)}</>;
};

/**
 * 条件付きレンダリング用の安全な文字列
 */
export const useSafeText = (text: string | undefined | null): string => {
  if (!text) return '';
  return sanitizeHtml(text);
};

/**
 * 開発環境でのXSS検証
 * 危険なパターンを検出してコンソールに警告
 */
export const validateXSSPatterns = (text: string): void => {
  if (process.env.NODE_ENV !== 'development') return;

  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onerror, etc.
    /<iframe/i,
    /eval\(/i,
    /expression\(/i,
  ];

  dangerousPatterns.forEach((pattern) => {
    if (pattern.test(text)) {
      // 開発環境のみコンソール警告（本番では無効）
      console.warn('⚠️ XSS Warning: Potentially dangerous pattern detected:', text);
    }
  });
};
