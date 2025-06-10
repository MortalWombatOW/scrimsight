import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricsControls } from './MetricsControls';
import { PlayerStatsCategoryKeys, PlayerStatsNumericalKeys } from '@atoms';

const meta: Meta<typeof MetricsControls> = {
  title: 'Components/MetricsControls',
  component: MetricsControls,
  parameters: { 
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groupBy: ["playerName"] as PlayerStatsCategoryKeys[],
    setGroupBy: () => {},
    metrics: ["eliminations", "deaths"] as PlayerStatsNumericalKeys[],
    setMetrics: () => {},
    filters: {
      matchId: ["match1", "match2"],
      roundNumber: ["1", "2"],
      playerTeam: ["Team Alpha", "Team Beta"],
      playerName: ["Player1", "Player2"],
      playerHero: ["Ana", "Mercy"],
      playerRole: ["support", "damage"]
    },
    handleFilterChange: () => {},
    expandedFilters: new Set<PlayerStatsCategoryKeys>(["playerName"]),
    toggleFilterExpansion: () => {},
    uniqueValues: {
      matchId: ["match1", "match2", "match3"],
      roundNumber: ["1", "2", "3"],
      playerTeam: ["Team Alpha", "Team Beta"],
      playerName: ["Player1", "Player2", "Player3"],
      playerHero: ["Ana", "Mercy", "Reinhardt", "Tracer"],
      playerRole: ["support", "damage", "tank"]
    },
    sortBy: "eliminations" as PlayerStatsNumericalKeys,
    setSortBy: () => {},
    sortDirection: "desc" as const,
    setSortDirection: () => {},
  },
};