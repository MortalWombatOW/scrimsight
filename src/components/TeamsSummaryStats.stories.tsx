import type { Meta, StoryObj } from '@storybook/react';
import { TeamsSummaryStats } from './TeamsSummaryStats';

const meta: Meta<typeof TeamsSummaryStats> = {
  title: 'Components/TeamsSummaryStats',
  component: TeamsSummaryStats,
  parameters: { 
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalTeams: 8,
    totalGames: 150,
    totalWins: 75,
    totalPlayers: 48,
  },
};

export const LowNumbers: Story = {
  args: {
    totalTeams: 2,
    totalGames: 5,
    totalWins: 3,
    totalPlayers: 12,
  },
};