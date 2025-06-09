import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerList } from './PlayerList';
import { PlayerListSummary } from '@atoms';

const mockPlayers: PlayerListSummary[] = [
  {
    playerName: "Player1",
    eliminations: 45,
    assists: 32,
    deaths: 18,
    damageDone: 12500,
    healingDone: 2500,
    primaryTeam: "Team Alpha",
    topHero: "tracer",
    topRole: "damage",
    playtime: 3600,
    winRate: 0.65,
    firstKillRate: 0.3,
  },
  {
    playerName: "Player2", 
    eliminations: 38,
    assists: 28,
    deaths: 22,
    damageDone: 8200,
    healingDone: 8500,
    primaryTeam: "Team Beta",
    topHero: "mercy",
    topRole: "support",
    playtime: 3200,
    winRate: 0.58,
    firstKillRate: 0.15,
  },
  {
    playerName: "Player3",
    eliminations: 41,
    assists: 25,
    deaths: 15,
    damageDone: 15200,
    healingDone: 800,
    primaryTeam: "Team Alpha", 
    topHero: "reinhardt",
    topRole: "tank",
    playtime: 3800,
    winRate: 0.72,
    firstKillRate: 0.22,
  },
];

const meta: Meta<typeof PlayerList> = {
  title: 'Components/PlayerList',
  component: PlayerList,
  parameters: { 
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    players: mockPlayers,
  },
};