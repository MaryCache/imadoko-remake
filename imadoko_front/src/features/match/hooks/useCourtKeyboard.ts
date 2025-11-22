import { useState, useRef, useCallback } from 'react';

/**
 * コートのキーボード操作管理フック
 * 
 * 矢印キーでのフォーカス移動、Enterキーでの選択機能を提供します。
 * 
 * @param onSlotSelect - スロット選択時のコールバック（オプション）
 * @returns focusedSlot, setFocusedSlot, slotRefs, handleKeyDown
 * 
 * @example
 * const { focusedSlot, setFocusedSlot, slotRefs, handleKeyDown } = useCourtKeyboard();
 * 
 * <div
 *   ref={(el) => { slotRefs.current[slot] = el; }}
 *   onKeyDown={(e) => handleKeyDown(slot, e)}
 *   onFocus={() => setFocusedSlot(slot)}
 * />
 */
export const useCourtKeyboard = (onSlotSelect?: (slot: number) => void) => {
    const [focusedSlot, setFocusedSlot] = useState<number | null>(null);
    const slotRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    /**
     * キーボードイベントハンドラー
     * 矢印キー: フォーカス移動
     * Enter/Space: スロット選択
     */
    const handleKeyDown = useCallback((slot: number, e: React.KeyboardEvent) => {
        // グリッド配置順序（前衛：4,3,2 / 後衛：5,6,1）
        const gridOrder = [4, 3, 2, 5, 6, 1];
        const currentIndex = gridOrder.indexOf(slot);

        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault();
                if (currentIndex < gridOrder.length - 1) {
                    const nextSlot = gridOrder[currentIndex + 1];
                    slotRefs.current[nextSlot]?.focus();
                    setFocusedSlot(nextSlot);
                } else {
                    // 最後の要素で右を押したら最初に戻る
                    const firstSlot = gridOrder[0];
                    slotRefs.current[firstSlot]?.focus();
                    setFocusedSlot(firstSlot);
                }
                break;

            case 'ArrowLeft':
                e.preventDefault();
                if (currentIndex > 0) {
                    const prevSlot = gridOrder[currentIndex - 1];
                    slotRefs.current[prevSlot]?.focus();
                    setFocusedSlot(prevSlot);
                } else {
                    // 最初の要素で左を押したら最後に戻る
                    const lastSlot = gridOrder[gridOrder.length - 1];
                    slotRefs.current[lastSlot]?.focus();
                    setFocusedSlot(lastSlot);
                }
                break;

            case 'ArrowDown':
                e.preventDefault();
                // 前衛→後衛への移動（4→5, 3→6, 2→1）
                if (currentIndex < 3) {
                    const nextSlot = gridOrder[currentIndex + 3];
                    slotRefs.current[nextSlot]?.focus();
                    setFocusedSlot(nextSlot);
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                // 後衛→前衛への移動（5→4, 6→3, 1→2）
                if (currentIndex >= 3) {
                    const prevSlot = gridOrder[currentIndex - 3];
                    slotRefs.current[prevSlot]?.focus();
                    setFocusedSlot(prevSlot);
                }
                break;

            case 'Enter':
            case ' ':
                e.preventDefault();
                onSlotSelect?.(slot);
                break;

            default:
                break;
        }
    }, [onSlotSelect]);

    return {
        focusedSlot,
        setFocusedSlot,
        slotRefs,
        handleKeyDown,
    };
};
