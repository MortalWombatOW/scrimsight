import type { Meta, StoryObj } from '@storybook/react';
import TeamList from './TeamList';
import { TeamRelationships } from '../lib/ScrimsightDataModel';

const meta: Meta<typeof TeamList> = {
  title: 'Components/TeamList',
  component: TeamList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    teams: {
      control: 'object',
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockTeams: TeamRelationships[] = [
  {
    team: 'Boston Uprising',
    players: ['Striker', 'Kellex', 'NotE', 'Neko', 'Mistakes', 'AimGod'],
    scrims: ['SCRIM_001', 'SCRIM_002', 'SCRIM_003', 'SCRIM_004'],
  },
  {
    team: 'San Francisco Shock',
    players: ['Sinatraa', 'Moth', 'Super', 'Choihyobin', 'Architect', 'Viol2t'],
    scrims: ['SCRIM_005', 'SCRIM_006', 'SCRIM_007'],
  },
  {
    team: 'Seoul Dynasty',
    players: ['Profit', 'Tobi', 'Zunba', 'ryujehong', 'Fleta', 'Miro'],
    scrims: ['SCRIM_008', 'SCRIM_009', 'SCRIM_010', 'SCRIM_011', 'SCRIM_012'],
  },
  {
    team: 'New York Excelsior',
    players: ['SBB', 'JJoNak', 'Meko', 'MekO', 'Libero', 'Pine'],
    scrims: ['SCRIM_013', 'SCRIM_014'],
  },
];

export const Default: Story = {
  args: {
    teams: mockTeams,
  },
};

export const EmptyList: Story = {
  args: {
    teams: [],
  },
};

export const SingleTeam: Story = {
  args: {
    teams: [mockTeams[0]],
  },
};

export const SmallRoster: Story = {
  args: {
    teams: [
      {
        team: 'Small Squad',
        players: ['Player1', 'Player2', 'Player3'],
        scrims: ['SCRIM_015'],
      },
    ],
  },
};

export const LargeRoster: Story = {
  args: {
    teams: [
      {
        team: 'Mega Roster',
        players: [
          'Player1', 'Player2', 'Player3', 'Player4', 'Player5', 'Player6',
          'Player7', 'Player8', 'Player9', 'Player10', 'Player11', 'Player12',
          'Sub1', 'Sub2', 'Sub3', 'Coach1', 'Analyst1'
        ],
        scrims: ['SCRIM_016', 'SCRIM_017', 'SCRIM_018', 'SCRIM_019', 'SCRIM_020'],
      },
    ],
  },
};

export const ManyTeams: Story = {
  args: {
    teams: [
      ...mockTeams,
      {
        team: 'Dallas Fuel',
        players: ['Effect', 'Cocco', 'Taimou', 'HarryHook', 'Mickie', 'Chips'],
        scrims: ['SCRIM_021', 'SCRIM_022'],
      },
      {
        team: 'Philadelphia Fusion',
        players: ['Carpe', 'Alarm', 'Poko', 'FunnyAstro', 'EQO', 'Hotba'],
        scrims: ['SCRIM_023', 'SCRIM_024', 'SCRIM_025'],
      },
      {
        team: 'London Spitfire',
        players: ['birdring', 'Fury', 'Gesture', 'Bdosin', 'NUS', 'Profit'],
        scrims: ['SCRIM_026'],
      },
    ],
  },
};

export const TeamsWithLongNames: Story = {
  args: {
    teams: [
      {
        team: 'Very Long Team Name That Tests Layout Constraints',
        players: ['PlayerWithVeryLongUsernameThatTestsLayout', 'ShortName', 'AnotherLongPlayerName'],
        scrims: ['SCRIM_027', 'SCRIM_028'],
      },
      {
        team: 'Short',
        players: ['A', 'B'],
        scrims: ['SCRIM_029'],
      },
    ],
  },
};

export const NoScrims: Story = {
  args: {
    teams: [
      {
        team: 'New Team',
        players: ['Rookie1', 'Rookie2', 'Rookie3', 'Rookie4', 'Rookie5', 'Rookie6'],
        scrims: [],
      },
    ],
  },
};