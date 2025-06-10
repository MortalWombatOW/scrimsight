import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerList } from './PlayerList';
import { PlayerListSummary } from '@atoms';

const mockPlayers: PlayerListSummary[] = [
  {
    playerName: "Player1",
    teamName: "Team Alpha",
    topHero: "tracer",
    eliminations: 45,
    deaths: 18,
    assists: 32,
    role: "damage",
    firstKillRate: 0.3,
  },
  {
    playerName: "Player2",
    teamName: "Team Beta", 
    topHero: "mercy",
    eliminations: 38,
    deaths: 22,
    assists: 28,
    role: "support",
    firstKillRate: 0.15,
  },
  {
    playerName: "Player3",
    teamName: "Team Alpha",
    topHero: "reinhardt", 
    eliminations: 41,
    deaths: 15,
    assists: 25,
    role: "tank",
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