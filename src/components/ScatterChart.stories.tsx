import type { Meta, StoryObj } from '@storybook/react-vite';
import ScatterChart from './ScatterChart';
import type { ScatterDataPoint } from './ScatterChart';

const meta: Meta<typeof ScatterChart> = {
  title: 'Components/ScatterChart',
  component: ScatterChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A scatter chart component built on top of Recharts with support for team-based data visualization. Features custom tooltips, team-based coloring, and responsive design.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of scatter data points with x, y, playerName, and playerTeam properties',
      control: false,
    },
    xAxisLabel: {
      control: 'text',
      description: 'Label for the X axis',
    },
    yAxisLabel: {
      control: 'text',
      description: 'Label for the Y axis',
    },
    showGrid: {
      control: 'boolean',
      description: 'Whether to show the grid lines',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Whether to show tooltips on hover',
    },
    showLegend: {
      control: 'boolean',
      description: 'Whether to show the legend',
    },
    height: {
      control: 'number',
      description: 'Height of the chart in pixels',
    },
    loading: {
      control: 'boolean',
      description: 'Whether to show loading state',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    colorFunction: {
      description: 'Function to determine color based on team name',
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const sampleData: ScatterDataPoint[] = [
  { x: 85, y: 92, playerName: 'Player Alpha', playerTeam: 'Team Red' },
  { x: 78, y: 88, playerName: 'Player Beta', playerTeam: 'Team Red' },
  { x: 82, y: 85, playerName: 'Player Gamma', playerTeam: 'Team Red' },
  { x: 90, y: 95, playerName: 'Player Delta', playerTeam: 'Team Blue' },
  { x: 88, y: 91, playerName: 'Player Echo', playerTeam: 'Team Blue' },
  { x: 86, y: 89, playerName: 'Player Foxtrot', playerTeam: 'Team Blue' },
  { x: 75, y: 82, playerName: 'Player Golf', playerTeam: 'Team Green' },
  { x: 79, y: 86, playerName: 'Player Hotel', playerTeam: 'Team Green' },
  { x: 81, y: 84, playerName: 'Player India', playerTeam: 'Team Green' },
];

const performanceData: ScatterDataPoint[] = [
  { x: 92, y: 88, playerName: 'Pro Player 1', playerTeam: 'Elite Squad' },
  { x: 89, y: 91, playerName: 'Pro Player 2', playerTeam: 'Elite Squad' },
  { x: 87, y: 85, playerName: 'Pro Player 3', playerTeam: 'Elite Squad' },
  { x: 84, y: 78, playerName: 'Rookie 1', playerTeam: 'Newcomers' },
  { x: 82, y: 76, playerName: 'Rookie 2', playerTeam: 'Newcomers' },
  { x: 80, y: 74, playerName: 'Rookie 3', playerTeam: 'Newcomers' },
  { x: 88, y: 82, playerName: 'Veteran 1', playerTeam: 'Veterans' },
  { x: 86, y: 84, playerName: 'Veteran 2', playerTeam: 'Veterans' },
  { x: 90, y: 86, playerName: 'Veteran 3', playerTeam: 'Veterans' },
];

const largeDataset: ScatterDataPoint[] = Array.from({ length: 50 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  playerName: `Player ${i + 1}`,
  playerTeam: `Team ${String.fromCharCode(65 + (i % 8))}`, // Teams A-H
}));

// Custom color function
const customColorFunction = (teamName: string): string => {
  const colors: Record<string, string> = {
    'Team Red': '#ef4444',
    'Team Blue': '#3b82f6', 
    'Team Green': '#10b981',
    'Elite Squad': '#8b5cf6',
    'Newcomers': '#f59e0b',
    'Veterans': '#06b6d4',
  };
  return colors[teamName] || '#6b7280';
};

// Basic Examples
export const Default: Story = {
  args: {
    data: sampleData,
    xAxisLabel: 'Skill Rating',
    yAxisLabel: 'Performance Score',
  },
};

export const WithCustomLabels: Story = {
  args: {
    data: sampleData,
    xAxisLabel: 'Accuracy (%)',
    yAxisLabel: 'Reaction Time (ms)',
    colorFunction: customColorFunction,
  },
};

export const WithLegend: Story = {
  args: {
    data: sampleData,
    xAxisLabel: 'Attack Rating',
    yAxisLabel: 'Defense Rating',
    showLegend: true,
    colorFunction: customColorFunction,
  },
};

export const WithoutGrid: Story = {
  args: {
    data: sampleData,
    xAxisLabel: 'Speed',
    yAxisLabel: 'Accuracy',
    showGrid: false,
    colorFunction: customColorFunction,
  },
};

export const WithoutTooltip: Story = {
  args: {
    data: sampleData,
    xAxisLabel: 'Experience',
    yAxisLabel: 'Skill Level',
    showTooltip: false,
    colorFunction: customColorFunction,
  },
};

// Performance Data Example
export const PerformanceAnalysis: Story = {
  args: {
    data: performanceData,
    xAxisLabel: 'Technical Skill',
    yAxisLabel: 'Game Sense',
    showLegend: true,
    colorFunction: customColorFunction,
    height: 450,
  },
};

// Large Dataset
export const LargeDataset: Story = {
  args: {
    data: largeDataset,
    xAxisLabel: 'Random Metric X',
    yAxisLabel: 'Random Metric Y',
    showLegend: true,
    height: 500,
  },
};

// Different Heights
export const SmallHeight: Story = {
  args: {
    data: sampleData.slice(0, 6),
    xAxisLabel: 'Metric A',
    yAxisLabel: 'Metric B',
    height: 250,
    colorFunction: customColorFunction,
  },
};

export const TallHeight: Story = {
  args: {
    data: sampleData,
    xAxisLabel: 'Metric A',
    yAxisLabel: 'Metric B',
    height: 600,
    showLegend: true,
    colorFunction: customColorFunction,
  },
};

// Loading State
export const LoadingState: Story = {
  args: {
    data: [],
    xAxisLabel: 'Loading...',
    yAxisLabel: 'Loading...',
    loading: true,
    height: 400,
  },
};

// Error State
export const ErrorState: Story = {
  args: {
    data: [],
    xAxisLabel: 'Error',
    yAxisLabel: 'Error',
    error: 'Failed to load chart data. Please try again later.',
    height: 400,
  },
};

// Empty Data State
export const EmptyDataState: Story = {
  args: {
    data: [],
    xAxisLabel: 'No Data',
    yAxisLabel: 'No Data',
    height: 400,
  },
};

// Single Team
export const SingleTeam: Story = {
  args: {
    data: sampleData.filter(d => d.playerTeam === 'Team Red'),
    xAxisLabel: 'Individual Performance',
    yAxisLabel: 'Team Contribution',
    showLegend: true,
    colorFunction: customColorFunction,
  },
};

// Two Teams Comparison
export const TwoTeamsComparison: Story = {
  args: {
    data: sampleData.filter(d => d.playerTeam === 'Team Red' || d.playerTeam === 'Team Blue'),
    xAxisLabel: 'Offensive Rating',
    yAxisLabel: 'Defensive Rating',
    showLegend: true,
    colorFunction: customColorFunction,
    height: 450,
  },
};

// Extreme Values
export const ExtremeValues: Story = {
  args: {
    data: [
      { x: 0, y: 0, playerName: 'Min Player', playerTeam: 'Outliers' },
      { x: 100, y: 100, playerName: 'Max Player', playerTeam: 'Outliers' },
      { x: 50, y: 50, playerName: 'Average Player', playerTeam: 'Normal' },
      { x: 10, y: 90, playerName: 'Specialist A', playerTeam: 'Specialists' },
      { x: 90, y: 10, playerName: 'Specialist B', playerTeam: 'Specialists' },
    ],
    xAxisLabel: 'Min-Max Scale',
    yAxisLabel: 'Performance Range',
    showLegend: true,
    colorFunction: customColorFunction,
  },
};

// Real-world Use Case: Player Performance
export const PlayerPerformanceAnalysis: Story = {
  args: {
    data: [
      { x: 85, y: 92, playerName: 'John "Ace" Smith', playerTeam: 'Phoenix Rising' },
      { x: 78, y: 88, playerName: 'Sarah "Sniper" Johnson', playerTeam: 'Phoenix Rising' },
      { x: 82, y: 85, playerName: 'Mike "Tank" Williams', playerTeam: 'Phoenix Rising' },
      { x: 90, y: 95, playerName: 'Alex "Flash" Brown', playerTeam: 'Lightning Bolts' },
      { x: 88, y: 91, playerName: 'Emma "Eagle" Davis', playerTeam: 'Lightning Bolts' },
      { x: 86, y: 89, playerName: 'Chris "Clutch" Miller', playerTeam: 'Lightning Bolts' },
      { x: 75, y: 82, playerName: 'David "Viper" Wilson', playerTeam: 'Shadow Hunters' },
      { x: 79, y: 86, playerName: 'Lisa "Frost" Moore', playerTeam: 'Shadow Hunters' },
      { x: 81, y: 84, playerName: 'Ryan "Rocket" Taylor', playerTeam: 'Shadow Hunters' },
    ],
    xAxisLabel: 'Aim Accuracy (%)',
    yAxisLabel: 'Game Sense Rating',
    showLegend: true,
    colorFunction: (teamName: string) => {
      const colors: Record<string, string> = {
        'Phoenix Rising': '#ff6b35',
        'Lightning Bolts': '#f7931e',
        'Shadow Hunters': '#8e44ad',
      };
      return colors[teamName] || '#6b7280';
    },
    height: 500,
  },
};

// Responsive Layout
export const ResponsiveLayout: Story = {
  render: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Team Performance</h3>
        <ScatterChart
          data={sampleData}
          xAxisLabel="Skill"
          yAxisLabel="Performance"
          colorFunction={customColorFunction}
          height={300}
          showLegend={true}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Individual Stats</h3>
        <ScatterChart
          data={performanceData}
          xAxisLabel="Experience"
          yAxisLabel="Rating"
          colorFunction={customColorFunction}
          height={300}
          showLegend={true}
        />
      </div>
    </div>
  ),
};

// In Card Layout
export const InCard: Story = {
  render: () => (
    <div className="card bg-base-100 shadow-xl max-w-4xl">
      <div className="card-body">
        <h2 className="card-title">Player Performance Analysis</h2>
        <p className="text-base-content/70 mb-4">
          Scatter plot showing the relationship between player skill and performance metrics across different teams.
        </p>
        <ScatterChart
          data={sampleData}
          xAxisLabel="Skill Rating (0-100)"
          yAxisLabel="Performance Score (0-100)"
          colorFunction={customColorFunction}
          showLegend={true}
          height={400}
        />
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary">Export Data</button>
          <button className="btn btn-outline">View Details</button>
        </div>
      </div>
    </div>
  ),
};