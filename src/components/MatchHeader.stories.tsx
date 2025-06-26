import type { Meta, StoryObj } from '@storybook/react-vite';
import MatchHeader from './MatchHeader';

const meta: Meta<typeof MatchHeader> = {
  title: 'Components/MatchHeader',
  component: MatchHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    matchId: {
      control: 'text',
    },
    mapName: {
      control: 'select',
      options: ['Hanamura', 'Temple of Anubis', 'King\'s Row', 'Dorado', 'Nepal', 'Lijiang Tower'],
    },
    gameMode: {
      control: 'select',
      options: ['Control', 'Escort', 'Hybrid', 'Assault', 'Push'],
    },
    team1Name: {
      control: 'text',
    },
    team2Name: {
      control: 'text',
    },
    winningTeam: {
      control: 'text',
    },
    team1Score: {
      control: 'number',
    },
    team2Score: {
      control: 'number',
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Team1Wins: Story = {
  args: {
    matchId: 'MATCH_2024_001',
    mapName: 'King\'s Row',
    gameMode: 'Hybrid',
    team1Name: 'Boston Uprising',
    team2Name: 'New York Excelsior',
    winningTeam: 'Boston Uprising',
    team1Score: 3,
    team2Score: 1,
  },
};

export const Team2Wins: Story = {
  args: {
    matchId: 'MATCH_2024_002',
    mapName: 'Lijiang Tower',
    gameMode: 'Control',
    team1Name: 'Seoul Dynasty',
    team2Name: 'San Francisco Shock',
    winningTeam: 'San Francisco Shock',
    team1Score: 1,
    team2Score: 2,
  },
};

export const Draw: Story = {
  args: {
    matchId: 'MATCH_2024_003',
    mapName: 'Dorado',
    gameMode: 'Escort',
    team1Name: 'London Spitfire',
    team2Name: 'Philadelphia Fusion',
    winningTeam: 'London Spitfire',
    team1Score: 2,
    team2Score: 2,
  },
};

export const CloseMatch: Story = {
  args: {
    matchId: 'MATCH_2024_004',
    mapName: 'Temple of Anubis',
    gameMode: 'Assault',
    team1Name: 'Dallas Fuel',
    team2Name: 'Houston Outlaws',
    winningTeam: 'Dallas Fuel',
    team1Score: 6,
    team2Score: 5,
  },
};

export const Blowout: Story = {
  args: {
    matchId: 'MATCH_2024_005',
    mapName: 'Nepal',
    gameMode: 'Control',
    team1Name: 'Shanghai Dragons',
    team2Name: 'Chengdu Hunters',
    winningTeam: 'Shanghai Dragons',
    team1Score: 3,
    team2Score: 0,
  },
};