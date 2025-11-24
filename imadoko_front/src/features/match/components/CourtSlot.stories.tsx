import type { Meta, StoryObj } from '@storybook/react';
import { CourtSlot } from './CourtSlot';

const meta: Meta<typeof CourtSlot> = {
    title: 'Match/CourtSlot',
    component: CourtSlot,
    tags: ['autodocs'],
    argTypes: {
        positionName: { control: 'text' },
        isServe: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof CourtSlot>;

export const Default: Story = {
    args: {
        id: '1',
        positionName: '1',
        player: {
            id: 1,
            firstName: 'Shoyo',
            lastName: 'Hinata',
            jerseyNumber: 10,
            position: 'MB',
        },
        isServe: false,
    },
};

export const Empty: Story = {
    args: {
        id: '2',
        positionName: '2',
        player: null,
        isServe: false,
    },
};

export const WithServe: Story = {
    args: {
        id: '1',
        positionName: '1',
        player: {
            id: 1,
            firstName: 'Tobio',
            lastName: 'Kageyama',
            jerseyNumber: 9,
            position: 'S',
        },
        isServe: true,
    },
};
