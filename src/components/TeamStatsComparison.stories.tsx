import type { Meta, StoryObj } from '@storybook/react';
import { TeamStatsComparison } from './TeamStatsComparison';

const meta: Meta<typeof TeamStatsComparison> = {
  title: 'Components/TeamStatsComparison',
  component: TeamStatsComparison,
  parameters: { 
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    matchId: 'sample-match-id',
  },
};