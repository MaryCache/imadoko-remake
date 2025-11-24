import type { Meta, StoryObj } from '@storybook/react';
import { TeamSelector } from './TeamSelector';

const meta: Meta<typeof TeamSelector> = {
  title: 'Match/TeamSelector',
  component: TeamSelector,
  tags: ['autodocs'],
  argTypes: {
    onTeamChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof TeamSelector>;

const mockTeams = [
  { id: 1, teamName: 'Karasuno' },
  { id: 2, teamName: 'Nekoma' },
  { id: 3, teamName: 'Aoba Johsai' },
];

export const Default: Story = {
  args: {
    label: 'Select Team',
    teams: mockTeams,
    selectedTeamId: null,
    isLoading: false,
  },
};

export const Selected: Story = {
  args: {
    label: 'Team A',
    teams: mockTeams,
    selectedTeamId: 1,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    label: 'Loading...',
    teams: [],
    selectedTeamId: null,
    isLoading: true,
  },
};
