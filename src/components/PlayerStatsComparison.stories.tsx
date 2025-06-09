import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerStatsComparison } from './PlayerStatsComparison';

const meta: Meta<typeof PlayerStatsComparison> = {
  title: 'Components/PlayerStatsComparison',
  component: PlayerStatsComparison,
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