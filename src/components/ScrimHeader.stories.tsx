import type { Meta, StoryObj } from '@storybook/react';
import ScrimHeader from './ScrimHeader';

const meta: Meta<typeof ScrimHeader> = {
  title: 'Components/ScrimHeader',
  component: ScrimHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    scrimId: {
      control: 'text',
    },
    date: {
      control: 'date',
    },
    team1Name: {
      control: 'text',
    },
    team2Name: {
      control: 'text',
    },
    team1MatchesWon: {
      control: 'number',
    },
    team2MatchesWon: {
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
    scrimId: 'SCRIM_2024_001',
    date: new Date('2024-01-15T19:30:00'),
    team1Name: 'Boston Uprising',
    team2Name: 'New York Excelsior',
    team1MatchesWon: 3,
    team2MatchesWon: 1,
  },
};

export const Team2Wins: Story = {
  args: {
    scrimId: 'SCRIM_2024_002',
    date: new Date('2024-01-16T20:00:00'),
    team1Name: 'Seoul Dynasty',
    team2Name: 'San Francisco Shock',
    team1MatchesWon: 2,
    team2MatchesWon: 4,
  },
};

export const Draw: Story = {
  args: {
    scrimId: 'SCRIM_2024_003',
    date: new Date('2024-01-17T18:45:00'),
    team1Name: 'London Spitfire',
    team2Name: 'Philadelphia Fusion',
    team1MatchesWon: 2,
    team2MatchesWon: 2,
  },
};

export const CloseScrim: Story = {
  args: {
    scrimId: 'SCRIM_2024_004',
    date: new Date('2024-01-18T21:15:00'),
    team1Name: 'Dallas Fuel',
    team2Name: 'Houston Outlaws',
    team1MatchesWon: 5,
    team2MatchesWon: 4,
  },
};

export const LongScrim: Story = {
  args: {
    scrimId: 'SCRIM_2024_005',
    date: new Date('2024-01-19T17:30:00'),
    team1Name: 'Shanghai Dragons',
    team2Name: 'Chengdu Hunters',
    team1MatchesWon: 7,
    team2MatchesWon: 3,
  },
};

export const RecentScrim: Story = {
  args: {
    scrimId: 'SCRIM_2024_LATEST',
    date: new Date(),
    team1Name: 'Atlanta Reign',
    team2Name: 'Florida Mayhem',
    team1MatchesWon: 1,
    team2MatchesWon: 0,
  },
};