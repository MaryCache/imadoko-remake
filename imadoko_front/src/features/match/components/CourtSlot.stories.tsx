import type { Meta, StoryObj } from '@storybook/react';
import { CourtSlot } from './CourtSlot';

const meta: Meta<typeof CourtSlot> = {
  title: 'Match/CourtSlot',
  component: CourtSlot,
  tags: ['autodocs'],
  argTypes: {
    hasServe: { control: 'boolean' },
    slotRef: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof CourtSlot>;

export const Default: Story = {
  args: {
    slot: 1,
    player: {
      id: 1,
      firstName: 'Shoyo',
      lastName: 'Hinata',
      position: 'MB',
    },
    side: 'A',
    hasServe: false,
    isFocused: false,
    onKeyDown: () => {},
  },
};

export const Empty: Story = {
  args: {
    slot: 2,
    player: null,
    side: 'A',
    hasServe: false,
    isFocused: false,
    onKeyDown: () => {},
  },
};

export const WithServe: Story = {
  args: {
    slot: 1,
    player: {
      id: 1,
      firstName: 'Tobio',
      lastName: 'Kageyama',
      position: 'S',
    },
    side: 'A',
    hasServe: true,
    isFocused: false,
    onKeyDown: () => {},
  },
};
