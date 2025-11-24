import type { Meta, StoryObj } from '@storybook/react';
import { MatchFooter } from './MatchFooter';

const meta: Meta<typeof MatchFooter> = {
    title: 'Match/MatchFooter',
    component: MatchFooter,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof MatchFooter>;

export const Default: Story = {
    args: {
        onReset: () => console.log('Reset clicked'),
        onSave: () => console.log('Save clicked'),
        onLoad: () => console.log('Load clicked'),
    },
};

export const Mobile: Story = {
    args: {
        onReset: () => { },
        onSave: () => { },
        onLoad: () => { },
    },
    parameters: {
        viewport: {
            defaultViewport: 'iphone14',
        },
    },
};
