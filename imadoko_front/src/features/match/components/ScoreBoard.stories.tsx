import type { Meta, StoryObj } from '@storybook/react';
import { ScoreBoard } from './ScoreBoard';

const meta: Meta<typeof ScoreBoard> = {
    title: 'Match/ScoreBoard',
    component: ScoreBoard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof ScoreBoard>;

export const Default: Story = {
    args: {
        scoreA: 0,
        scoreB: 0,
        setCountA: 0,
        setCountB: 0,
        onScoreAChange: () => { },
        onScoreBChange: () => { },
        onSetCountAChange: () => { },
        onSetCountBChange: () => { },
        onReset: () => { },
    },
};

export const MidGame: Story = {
    args: {
        scoreA: 15,
        scoreB: 12,
        setCountA: 1,
        setCountB: 0,
        onScoreAChange: () => { },
        onScoreBChange: () => { },
        onSetCountAChange: () => { },
        onSetCountBChange: () => { },
        onReset: () => { },
    },
};

export const Deuce: Story = {
    args: {
        scoreA: 24,
        scoreB: 24,
        setCountA: 2,
        setCountB: 2,
        onScoreAChange: () => { },
        onScoreBChange: () => { },
        onSetCountAChange: () => { },
        onSetCountBChange: () => { },
        onReset: () => { },
    },
};
