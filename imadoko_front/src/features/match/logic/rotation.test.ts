import { rotateAssignment, reverseRotateSlot } from './rotation';
import type { CourtAssignment, CourtSlotId, Player } from '../../../types';

// モックプレイヤー作成ヘルパー
const createPlayer = (id: number, position: Player['position']): Player => ({
    id,
    firstName: 'Test',
    lastName: `Player${id}`,
    position,
    uniformNumber: id,
    teamId: 1,
});

describe('Rotation Logic', () => {
    describe('rotateAssignment', () => {
        const baseAssignment: CourtAssignment = {
            1: createPlayer(1, 'OH'),
            2: createPlayer(2, 'MB'),
            3: createPlayer(3, 'OP'),
            4: createPlayer(4, 'OH'),
            5: createPlayer(5, 'MB'),
            6: createPlayer(6, 'S'),
        };

        // Cycle: 1 -> 6 -> 5 -> 4 -> 3 -> 2 -> 1

        it('should handle 0 rotations (no change)', () => {
            const result = rotateAssignment(baseAssignment, 0);
            expect(result).toEqual(baseAssignment);
        });

        it('should handle 1 rotation (clockwise)', () => {
            // 1->6, 6->5, 5->4, 4->3, 3->2, 2->1
            const result = rotateAssignment(baseAssignment, 1);
            expect(result[6]?.id).toBe(1);
            expect(result[5]?.id).toBe(6);
            expect(result[4]?.id).toBe(5);
            expect(result[3]?.id).toBe(4);
            expect(result[2]?.id).toBe(3);
            expect(result[1]?.id).toBe(2);
        });

        it('should handle 6 rotations (full cycle)', () => {
            const result = rotateAssignment(baseAssignment, 6);
            expect(result).toEqual(baseAssignment);
        });

        it('should handle large number of rotations (n=100)', () => {
            // 100 % 6 = 4 rotations
            // 1->3, 6->2, 5->1, 4->6, 3->5, 2->4
            const result = rotateAssignment(baseAssignment, 100);
            const expected = rotateAssignment(baseAssignment, 4);
            expect(result).toEqual(expected);
        });

        it('should handle negative rotations (counter-clockwise)', () => {
            // -1 rotation is equivalent to 5 rotations
            // 1->2, 2->3, 3->4, 4->5, 5->6, 6->1
            const result = rotateAssignment(baseAssignment, -1);
            expect(result[2]?.id).toBe(1);
            expect(result[3]?.id).toBe(2);
            expect(result[4]?.id).toBe(3);
            expect(result[5]?.id).toBe(4);
            expect(result[6]?.id).toBe(5);
            expect(result[1]?.id).toBe(6);
        });
    });

    describe('reverseRotateSlot', () => {
        // Cycle: 1, 6, 5, 4, 3, 2

        it('should handle 0 rotations', () => {
            expect(reverseRotateSlot(1, 0)).toBe(1);
            expect(reverseRotateSlot(6, 0)).toBe(6);
        });

        it('should handle 1 rotation', () => {
            // If displayed at 6, with 1 rotation, base was 1 (1->6)
            expect(reverseRotateSlot(6, 1)).toBe(1);
            // If displayed at 5, with 1 rotation, base was 6 (6->5)
            expect(reverseRotateSlot(5, 1)).toBe(6);
        });

        it('should handle 6 rotations', () => {
            expect(reverseRotateSlot(1, 6)).toBe(1);
        });

        it('should handle large rotations (n=13)', () => {
            // 13 % 6 = 1 rotation
            expect(reverseRotateSlot(6, 13)).toBe(1);
        });

        it('should handle negative rotations', () => {
            // -1 rotation (counter-clockwise)
            // If displayed at 2, base was 1 (1->2 is -1 rot? No wait.)
            // rotateAssignment(-1) moves 1->2.
            // So if displayed at 2 with -1 rot, base should be 1.
            expect(reverseRotateSlot(2, -1)).toBe(1);
        });
    });
});
