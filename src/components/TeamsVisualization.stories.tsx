import type { Meta, StoryObj } from '@storybook/react-vite';
import { TeamsVisualization } from './TeamsVisualization';

const meta: Meta<typeof TeamsVisualization> = {
  title: 'Components/TeamsVisualization',
  component: TeamsVisualization,
  parameters: { 
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    teams: [
      { teamName: 'Team A', wins: 5, losses: 3, draws: 0, gamesPlayed: 8, mostRecentGameDate: new Date('2024-01-15'), players: ['Player1', 'Player2'] },
      { teamName: 'Team B', wins: 3, losses: 4, draws: 0, gamesPlayed: 7, mostRecentGameDate: new Date('2024-01-14'), players: ['Player3', 'Player4'] },
      { teamName: 'Team C', wins: 8, losses: 2, draws: 0, gamesPlayed: 10, mostRecentGameDate: new Date('2024-01-16'), players: ['Player5', 'Player6'] },
      { teamName: 'Team D', wins: 2, losses: 6, draws: 0, gamesPlayed: 8, mostRecentGameDate: new Date('2024-01-13'), players: ['Player7', 'Player8'] },
      { teamName: 'Team E', wins: 6, losses: 4, draws: 0, gamesPlayed: 10, mostRecentGameDate: new Date('2024-01-17'), players: ['Player9', 'Player10'] },
    ],
  },
};

export const SingleTeam: Story = {
  args: {
    teams: [
      { teamName: 'Solo Team', wins: 10, losses: 5, draws: 0, gamesPlayed: 15, mostRecentGameDate: new Date('2024-01-18'), players: ['SoloPlayer'] },
    ],
  },
};