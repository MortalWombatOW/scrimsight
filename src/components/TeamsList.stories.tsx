import type { Meta, StoryObj } from '@storybook/react';
import { TeamsList } from './TeamsList';

const meta: Meta<typeof TeamsList> = {
  title: 'Components/TeamsList',
  component: TeamsList,
  parameters: { 
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    teams: [
      {
        teamName: 'Team Alpha',
        playerCount: 6,
        winRate: 0.75,
        gamesPlayed: 20,
        firstKillWinRate: 0.8,
      },
      {
        teamName: 'Team Beta',
        playerCount: 8,
        winRate: 0.60,
        gamesPlayed: 15,
        firstKillWinRate: 0.65,
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    teams: [],
  },
};