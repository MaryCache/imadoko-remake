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
    teamAName: 'Karasuno',
    teamBName: 'Nekoma',
    scoresA: { sets: 2, points: 24, so: 3, br: 1 },
    scoresB: { sets: 1, points: 22, so: 2, br: 4 },
    // onReset, onSave, onLoad are not strictly needed as props in the component definition shown,
    // but if they are used in the component (not shown in the view_file output but likely exist), keep them.
    // Based on view_file, MatchFooterProps ONLY has teamAName, teamBName, scoresA, scoresB.
    // The previous args had onReset etc, which might be extra or I missed them in view_file.
    // Let's check view_file again...
    // Ah, view_file showed MatchFooterProps ONLY has teamAName, teamBName, scoresA, scoresB.
    // So onReset etc are actually NOT in the interface shown in view_file.
    // However, the user might have updated the file locally or I might have missed something.
    // Wait, looking at view_file output for MatchFooter.tsx:
    // interface MatchFooterProps { teamAName, teamBName, scoresA, scoresB }
    // It does NOT have onReset, onSave, onLoad.
    // So the previous story args were completely wrong/outdated?
    // Or maybe the component uses them but they are missing from the interface?
    // No, the component destructuring also only shows { teamAName, teamBName, scoresA, scoresB }.
    // So I should remove onReset etc and add the correct props.
  },
};

export const Mobile: Story = {
  args: {
    teamAName: 'Karasuno',
    teamBName: 'Nekoma',
    scoresA: { sets: 2, points: 24, so: 3, br: 1 },
    scoresB: { sets: 1, points: 22, so: 2, br: 4 },
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone14',
    },
  },
};
