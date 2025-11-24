import type { Position } from '../types';

export const POSITIONS = [
  { value: 'WS', label: 'ウイングスパイカー' },
  { value: 'MB', label: 'ミドルブロッカー' },
  { value: 'S', label: 'セッター' },
  { value: 'OP', label: 'オポジット' },
  { value: 'Li', label: 'リベロ' },
] as const;

export const COURT_SLOTS: number[] = [1, 2, 3, 4, 5, 6];

/**
 * z-indexレイヤー定義
 * コート上の要素の重なり順を管理
 */
export const Z_INDEX = {
  COURT_SLOT_EMPTY: 1, // 空きスロット
  COURT_SLOT_OCCUPIED: 10, // 選手が配置されたスロット
  SLOT_BADGE: 60, // 位置番号バッジ (選手カードより上に)
  PLAYER_CARD: 50, // 選手カード
} as const;

// ポジション別テーマカラーを取得するヘルパー関数
// Tailwind CSS v4では動的クラス名が検出されないため、完全なクラス名を返す
export const getPositionStyles = (position: Position): string => {
  switch (position) {
    case 'WS':
      return 'bg-pos-ws text-white border-pos-ws';
    case 'MB':
      return 'bg-pos-mb text-white border-pos-mb';
    case 'S':
      return 'bg-pos-s text-mikasa-blue border-pos-s';
    case 'OP':
      return 'bg-pos-op text-white border-pos-op';
    case 'Li':
      return 'bg-pos-li text-white border-pos-li';
    default:
      return 'bg-slate-500 text-white border-slate-500';
  }
};
