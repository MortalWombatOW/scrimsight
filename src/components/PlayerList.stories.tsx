import type { Meta, StoryObj } from '@storybook/react-vite';
import PlayerList from './PlayerList';
import { PlayerRelationships } from '../lib/ScrimsightDataModel';

const meta: Meta<typeof PlayerList> = {
  title: 'Components/PlayerList',
  component: PlayerList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    players: {
      control: 'object',
    },
    className: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPlayers: PlayerRelationships[] = [
  {
    player: 'Striker',
    teams: ['Boston Uprising', 'San Francisco Shock'],
    scrims: ['SCRIM_001', 'SCRIM_002', 'SCRIM_003'],
    matches: ['MATCH_001', 'MATCH_002', 'MATCH_003', 'MATCH_004'],
    heroes: [
      { hero: 'Tracer', playtime: 3600 },
      { hero: 'Widowmaker', playtime: 2400 },
      { hero: 'Ashe', playtime: 1800 },
    ],
    roles: [
      { role: 'damage', playtime: 7800 },
    ],
  },
  {
    player: 'Kellex',
    teams: ['Boston Uprising'],
    scrims: ['SCRIM_001', 'SCRIM_002'],
    matches: ['MATCH_001', 'MATCH_002'],
    heroes: [
      { hero: 'Mercy', playtime: 2700 },
      { hero: 'Ana', playtime: 1800 },
      { hero: 'Zenyatta', playtime: 900 },
    ],
    roles: [
      { role: 'support', playtime: 5400 },
    ],
  },
  {
    player: 'NotE',
    teams: ['Boston Uprising', 'Dallas Fuel'],
    scrims: ['SCRIM_001', 'SCRIM_003', 'SCRIM_004'],
    matches: ['MATCH_001', 'MATCH_003', 'MATCH_005'],
    heroes: [
      { hero: 'D.Va', playtime: 4200 },
      { hero: 'Winston', playtime: 2100 },
      { hero: 'Reinhardt', playtime: 1500 },
    ],
    roles: [
      { role: 'tank', playtime: 7800 },
    ],
  },
  {
    player: 'Profit',
    teams: ['London Spitfire', 'Seoul Dynasty'],
    scrims: ['SCRIM_005', 'SCRIM_006', 'SCRIM_007', 'SCRIM_008'],
    matches: ['MATCH_006', 'MATCH_007', 'MATCH_008', 'MATCH_009', 'MATCH_010'],
    heroes: [
      { hero: 'Genji', playtime: 3300 },
      { hero: 'Tracer', playtime: 2700 },
      { hero: 'Hanzo', playtime: 1800 },
      { hero: 'Widowmaker', playtime: 1200 },
    ],
    roles: [
      { role: 'damage', playtime: 9000 },
    ],
  },
];

export const Default: Story = {
  args: {
    players: mockPlayers,
  },
};

export const EmptyList: Story = {
  args: {
    players: [],
  },
};

export const SinglePlayer: Story = {
  args: {
    players: [mockPlayers[0]],
  },
};

export const ManyPlayers: Story = {
  args: {
    players: [
      ...mockPlayers,
      {
        player: 'Fleta',
        teams: ['Seoul Dynasty', 'Shanghai Dragons'],
        scrims: ['SCRIM_009', 'SCRIM_010'],
        matches: ['MATCH_011', 'MATCH_012'],
        heroes: [
          { hero: 'Echo', playtime: 2400 },
          { hero: 'Pharah', playtime: 1800 },
        ],
        roles: [
          { role: 'damage', playtime: 4200 },
        ],
      },
      {
        player: 'Miro',
        teams: ['Seoul Dynasty'],
        scrims: ['SCRIM_011'],
        matches: ['MATCH_013'],
        heroes: [
          { hero: 'Winston', playtime: 3000 },
          { hero: 'Reinhardt', playtime: 1500 },
        ],
        roles: [
          { role: 'tank', playtime: 4500 },
        ],
      },
    ],
  },
};

export const PlayersWithManyTeams: Story = {
  args: {
    players: [
      {
        player: 'SuperStar',
        teams: ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon'],
        scrims: ['SCRIM_012', 'SCRIM_013', 'SCRIM_014'],
        matches: ['MATCH_014', 'MATCH_015', 'MATCH_016'],
        heroes: [
          { hero: 'Tracer', playtime: 5000 },
          { hero: 'Genji', playtime: 3000 },
          { hero: 'Soldier: 76', playtime: 2000 },
        ],
        roles: [
          { role: 'damage', playtime: 10000 },
        ],
      },
    ],
  },
};