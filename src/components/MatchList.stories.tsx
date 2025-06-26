import type { Meta, StoryObj } from '@storybook/react';
import MatchList from './MatchList';
import { MatchRelationships } from '../lib/ScrimsightDataModel';

const meta: Meta<typeof MatchList> = {
  title: 'Components/MatchList',
  component: MatchList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    matches: {
      control: 'object',
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockMatches: MatchRelationships[] = [
  {
    match: 'MATCH_001',
    scrim: 'SCRIM_001',
    teams: ['Boston Uprising', 'New York Excelsior'],
    map: 'King\'s Row',
    date: new Date('2024-01-15T19:30:00'),
    rounds: [1, 2, 3],
    duration: 1245, // 20 minutes 45 seconds
    team1Score: 3,
    team2Score: 1,
    winningTeam: 'Boston Uprising',
    gameMode: 'Hybrid',
  },
  {
    match: 'MATCH_002',
    scrim: 'SCRIM_001',
    teams: ['San Francisco Shock', 'Seoul Dynasty'],
    map: 'Lijiang Tower',
    date: new Date('2024-01-15T20:15:00'),
    rounds: [1, 2],
    duration: 892, // 14 minutes 52 seconds
    team1Score: 2,
    team2Score: 0,
    winningTeam: 'San Francisco Shock',
    gameMode: 'Control',
  },
  {
    match: 'MATCH_003',
    scrim: 'SCRIM_002',
    teams: ['Philadelphia Fusion', 'London Spitfire'],
    map: 'Dorado',
    date: new Date('2024-01-16T18:45:00'),
    rounds: [1, 2, 3],
    duration: 1567, // 26 minutes 7 seconds
    team1Score: 2,
    team2Score: 3,
    winningTeam: 'London Spitfire',
    gameMode: 'Escort',
  },
  {
    match: 'MATCH_004',
    scrim: 'SCRIM_002',
    teams: ['Dallas Fuel', 'Houston Outlaws'],
    map: 'Temple of Anubis',
    date: new Date('2024-01-16T19:30:00'),
    rounds: [1, 2, 3],
    duration: 1823, // 30 minutes 23 seconds
    team1Score: 4,
    team2Score: 4,
    winningTeam: 'Dallas Fuel',
    gameMode: 'Assault',
  },
];

export const Default: Story = {
  args: {
    matches: mockMatches,
  },
};

export const EmptyList: Story = {
  args: {
    matches: [],
  },
};

export const SingleMatch: Story = {
  args: {
    matches: [mockMatches[0]],
  },
};

export const CloseMatches: Story = {
  args: {
    matches: [
      {
        match: 'MATCH_CLOSE_1',
        scrim: 'SCRIM_CLOSE',
        teams: ['Team Alpha', 'Team Beta'],
        map: 'Nepal',
        date: new Date('2024-01-17T20:00:00'),
        rounds: [1, 2, 3],
        duration: 1456,
        team1Score: 2,
        team2Score: 1,
        winningTeam: 'Team Alpha',
        gameMode: 'Control',
      },
      {
        match: 'MATCH_CLOSE_2',
        scrim: 'SCRIM_CLOSE',
        teams: ['Team Gamma', 'Team Delta'],
        map: 'Watchpoint: Gibraltar',
        date: new Date('2024-01-17T20:45:00'),
        rounds: [1, 2, 3],
        duration: 1687,
        team1Score: 3,
        team2Score: 2,
        winningTeam: 'Team Gamma',
        gameMode: 'Escort',
      },
    ],
  },
};

export const Blowouts: Story = {
  args: {
    matches: [
      {
        match: 'MATCH_BLOWOUT_1',
        scrim: 'SCRIM_BLOWOUT',
        teams: ['Dominant Team', 'Struggling Team'],
        map: 'Hanamura',
        date: new Date('2024-01-18T19:00:00'),
        rounds: [1, 2],
        duration: 654,
        team1Score: 2,
        team2Score: 0,
        winningTeam: 'Dominant Team',
        gameMode: 'Assault',
      },
      {
        match: 'MATCH_BLOWOUT_2',
        scrim: 'SCRIM_BLOWOUT',
        teams: ['Strong Team', 'Weak Team'],
        map: 'Numbani',
        date: new Date('2024-01-18T19:30:00'),
        rounds: [1, 2],
        duration: 723,
        team1Score: 3,
        team2Score: 0,
        winningTeam: 'Strong Team',
        gameMode: 'Hybrid',
      },
    ],
  },
};

export const LongMatches: Story = {
  args: {
    matches: [
      {
        match: 'MATCH_LONG_1',
        scrim: 'SCRIM_MARATHON',
        teams: ['Endurance Team A', 'Endurance Team B'],
        map: 'Volskaya Industries',
        date: new Date('2024-01-19T17:00:00'),
        rounds: [1, 2, 3],
        duration: 2456, // 40+ minutes
        team1Score: 6,
        team2Score: 5,
        winningTeam: 'Endurance Team A',
        gameMode: 'Assault',
      },
    ],
  },
};

export const RecentMatches: Story = {
  args: {
    matches: [
      {
        match: 'MATCH_TODAY_1',
        scrim: 'SCRIM_TODAY',
        teams: ['Fresh Team', 'Current Team'],
        map: 'Oasis',
        date: new Date(),
        rounds: [1, 2],
        duration: 987,
        team1Score: 2,
        team2Score: 1,
        winningTeam: 'Fresh Team',
        gameMode: 'Control',
      },
    ],
  },
};