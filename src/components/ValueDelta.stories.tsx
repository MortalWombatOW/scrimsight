import type { Meta, StoryObj } from '@storybook/react';
import ValueDelta from './ValueDelta';

const meta: Meta<typeof ValueDelta> = {
  title: 'Components/ValueDelta',
  component: ValueDelta,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'The current value to display',
    },
    baseline: {
      control: 'number',
      description: 'The baseline value to compare against',
    },
    higherIsBetter: {
      control: 'boolean',
      description: 'Whether higher values are considered better (affects color coding)',
    },
    precision: {
      control: 'number',
      description: 'Number of decimal places to show',
    },
    rank: {
      control: 'number',
      description: 'Player rank (1-based)',
    },
    totalCount: {
      control: 'number',
      description: 'Total number of players for ranking context',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PositiveHigherIsBetter: Story = {
  args: {
    value: 85.7,
    baseline: 72.3,
    higherIsBetter: true,
    rank: 2,
    totalCount: 8,
  },
};

export const NegativeHigherIsBetter: Story = {
  args: {
    value: 65.2,
    baseline: 78.9,
    higherIsBetter: true,
    rank: 6,
    totalCount: 8,
  },
};

export const PositiveLowerIsBetter: Story = {
  args: {
    value: 2.8,
    baseline: 4.1,
    higherIsBetter: false,
    rank: 1,
    totalCount: 8,
  },
};

export const NegativeLowerIsBetter: Story = {
  args: {
    value: 5.7,
    baseline: 3.2,
    higherIsBetter: false,
    rank: 7,
    totalCount: 8,
  },
};

export const NoChange: Story = {
  args: {
    value: 50.0,
    baseline: 50.0,
    higherIsBetter: true,
    rank: 4,
    totalCount: 8,
  },
};

export const KillDeathRatio: Story = {
  args: {
    value: 2.45,
    baseline: 1.8,
    higherIsBetter: true,
    precision: 2,
    rank: 2,
    totalCount: 8,
  },
};

export const DamagePerMinute: Story = {
  args: {
    value: 487,
    baseline: 425,
    higherIsBetter: true,
    precision: 0,
    rank: 3,
    totalCount: 8,
  },
};

export const DeathsPerMatch: Story = {
  args: {
    value: 3.2,
    baseline: 4.8,
    higherIsBetter: false,
    precision: 1,
    rank: 2,
    totalCount: 8,
  },
};

export const LargeValues: Story = {
  args: {
    value: 1250,
    baseline: 980,
    higherIsBetter: true,
    precision: 0,
    rank: 1,
    totalCount: 8,
  },
};

export const PercentageValues: Story = {
  args: {
    value: 67.8,
    baseline: 59.2,
    higherIsBetter: true,
    precision: 1,
    rank: 3,
    totalCount: 8,
  },
};

export const LargeNumbers: Story = {
  args: {
    value: 15420,
    baseline: 12850,
    higherIsBetter: true,
    precision: 0,
    rank: 2,
    totalCount: 8,
  },
};

export const SmallDecimals: Story = {
  args: {
    value: 0.0342,
    baseline: 0.0289,
    higherIsBetter: false,
    precision: 4,
    rank: 6,
    totalCount: 8,
  },
};

export const ZeroBaseline: Story = {
  args: {
    value: 25,
    baseline: 0,
    higherIsBetter: true,
    rank: 1,
    totalCount: 8,
  },
};

export const WithRankAndTotal: Story = {
  args: {
    value: 32,
    baseline: 24,
    higherIsBetter: true,
    precision: 0,
    rank: 1,
    totalCount: 8,
  },
};

export const WithRankOnly: Story = {
  args: {
    value: 8,
    baseline: 10,
    higherIsBetter: false,
    precision: 1,
    rank: 3,
    totalCount: 8,
  },
};

export const RankComparison: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium">1st Place (Above Average)</span>
        <ValueDelta 
          value={32} 
          baseline={24} 
          higherIsBetter={true} 
          precision={0}
          rank={1}
          totalCount={8}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium">3rd Place (Average)</span>
        <ValueDelta 
          value={24} 
          baseline={24} 
          higherIsBetter={true} 
          precision={0}
          rank={3}
          totalCount={8}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium">6th Place (Below Average)</span>
        <ValueDelta 
          value={18} 
          baseline={24} 
          higherIsBetter={true} 
          precision={0}
          rank={6}
          totalCount={8}
        />
      </div>
    </div>
  ),
};

export const StatsComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="bg-base-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Player Performance vs Team Average</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-base-content/70 mb-1">K/D Ratio</span>
            <ValueDelta value={2.45} baseline={1.8} higherIsBetter={true} precision={2} rank={2} totalCount={8} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-base-content/70 mb-1">Damage/Min</span>
            <ValueDelta 
              value={542} 
              baseline={425} 
              higherIsBetter={true} 
              precision={0}
              rank={1}
              totalCount={8}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-base-content/70 mb-1">Deaths/Match</span>
            <ValueDelta value={3.2} baseline={4.8} higherIsBetter={false} precision={1} rank={2} totalCount={8} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-base-content/70 mb-1">Accuracy</span>
            <ValueDelta 
              value={78.5} 
              baseline={65.2} 
              higherIsBetter={true} 
              precision={1}
              rank={1}
              totalCount={8}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-base-content/70 mb-1">Healing/Min</span>
            <ValueDelta 
              value={1250} 
              baseline={980} 
              higherIsBetter={true} 
              precision={0}
              rank={3}
              totalCount={8}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-base-content/70 mb-1">Ult Charge Time</span>
            <ValueDelta 
              value={42.3} 
              baseline={48.7} 
              higherIsBetter={false} 
              precision={1}
              rank={2}
              totalCount={8}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const TeamComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="bg-base-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Team Stats vs League Average</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Offensive Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Team Kills/Match</span>
                <ValueDelta value={28.4} baseline={24.7} higherIsBetter={true} precision={1} rank={2} totalCount={12} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Damage/Match</span>
                <ValueDelta 
                  value={45680} 
                  baseline={38920} 
                  higherIsBetter={true} 
                  precision={0}
                  rank={1}
                  totalCount={12}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">First Blood %</span>
                <ValueDelta 
                  value={68.2} 
                  baseline={52.1} 
                  higherIsBetter={true} 
                  precision={1}
                  rank={3}
                  totalCount={12}
                />
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Defensive Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Deaths/Match</span>
                <ValueDelta value={19.3} baseline={24.7} higherIsBetter={false} precision={1} rank={4} totalCount={12} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Damage Blocked</span>
                <ValueDelta 
                  value={12450} 
                  baseline={8920} 
                  higherIsBetter={true} 
                  precision={0}
                  rank={2}
                  totalCount={12}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ults Interrupted</span>
                <ValueDelta value={3.8} baseline={2.1} higherIsBetter={true} precision={1} rank={1} totalCount={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};