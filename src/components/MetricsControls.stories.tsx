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
      playerName: ["Player1", "Player2"],
      heroName: ["Ana", "Mercy"],
      mapName: ["Hanamura"],
      gameMode: ["Assault"],
      teamName: ["Team Alpha"]
    },
    handleFilterChange: () => {},
    expandedFilters: new Set<PlayerStatsCategoryKeys>(["playerName"]),
    toggleFilterExpansion: () => {},
    uniqueValues: {
      playerName: ["Player1", "Player2", "Player3"],
      heroName: ["Ana", "Mercy", "Reinhardt", "Tracer"],
      mapName: ["Hanamura", "King's Row", "Dorado"],
      gameMode: ["Assault", "Escort", "Hybrid"],
      teamName: ["Team Alpha", "Team Beta"]
    },
    sortBy: "eliminations" as PlayerStatsNumericalKeys,
    setSortBy: () => {},
    sortDirection: "desc" as const,
    setSortDirection: () => {},
  },
};