import type { Meta, StoryObj } from '@storybook/react';
import CardStat from './CardStat';

const meta: Meta<typeof CardStat> = {
  title: 'Components/CardStat',
  component: CardStat,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['neutral', 'good', 'bad'],
    },
    label: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    tooltip: {
      control: 'text',
    },
    rank: {
      control: 'number',
    },
    totalCount: {
      control: 'number',
    },
    numericValue: {
      control: 'number',
    },
    averageValue: {
      control: 'number',
    },
    metricKey: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['large', 'small'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Total Users',
    value: '1,234',
  },
};

export const Good: Story = {
  args: {
    label: 'Success Rate',
    value: '98.5%',
    severity: 'good',
  },
};

export const Bad: Story = {
  args: {
    label: 'Error Rate',
    value: '2.1%',
    severity: 'bad',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Active Sessions',
    value: '456',
    severity: 'good',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
  },
};

export const WithTooltip: Story = {
  args: {
    label: 'Revenue',
    value: '$12,345',
    severity: 'good',
    tooltip: 'Monthly recurring revenue from all active subscriptions',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
  },
};

export const LargeNumber: Story = {
  args: {
    label: 'Database Records',
    value: '2,847,392',
    severity: 'neutral',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
  },
};

export const WithRank: Story = {
  args: {
    label: 'Eliminations',
    value: '32',
    severity: 'good',
    rank: 1,
    totalCount: 8,
  },
};

export const RankLower: Story = {
  args: {
    label: 'Deaths',
    value: '8',
    severity: 'good',
    rank: 3,
    totalCount: 8,
  },
};

export const RankWithIcon: Story = {
  args: {
    label: 'Weapon Accuracy',
    value: '71.2%',
    severity: 'good',
    rank: 2,
    totalCount: 8,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CardStat label="Total Users" value="1,234" severity="neutral" />
      <CardStat label="Success Rate" value="98.5%" severity="good" />
      <CardStat label="Error Rate" value="2.1%" severity="bad" />
      <CardStat label="Active Sessions" value="456" severity="good" />
      <CardStat label="Revenue" value="$12,345" severity="good" />
      <CardStat label="Pending Tasks" value="23" severity="neutral" />
    </div>
  ),
};

export const RankComparisonGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CardStat label="Eliminations" value="32" severity="good" rank={1} totalCount={8} />
      <CardStat label="Final Blows" value="28" severity="good" rank={2} totalCount={8} />
      <CardStat label="Hero Damage" value="8,945" severity="neutral" rank={4} totalCount={8} />
      <CardStat label="Deaths" value="6" severity="good" rank={1} totalCount={8} />
      <CardStat label="Weapon Accuracy" value="71.2%" severity="good" rank={3} totalCount={8} />
      <CardStat label="First Kill Rate" value="42.8%" severity="neutral" rank={5} totalCount={8} />
    </div>
  ),
};

export const RankOnlyVsTotalCount: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CardStat label="Eliminations (rank only)" value="32" severity="good" rank={1} />
      <CardStat label="Eliminations (with total)" value="32" severity="good" rank={1} totalCount={8} />
    </div>
  ),
};

export const WithValueDelta: Story = {
  args: {
    label: 'Eliminations',
    numericValue: 32,
    averageValue: 24,
    metricKey: 'eliminations',
    rank: 1,
    totalCount: 8,
  },
};

export const ValueDeltaBelowAverage: Story = {
  args: {
    label: 'Deaths',
    numericValue: 8,
    averageValue: 5,
    metricKey: 'deaths',
    rank: 6,
    totalCount: 8,
  },
};

export const ValueDeltaWithAccuracy: Story = {
  args: {
    label: 'Weapon Accuracy',
    numericValue: 0.712,
    averageValue: 0.685,
    metricKey: 'weaponAccuracy',
    rank: 3,
    totalCount: 8,
  },
};

export const ValueDeltaComparison: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CardStat 
        label="Eliminations (Above Avg)" 
        numericValue={32} 
        averageValue={24} 
        metricKey="eliminations"
        rank={1} 
        totalCount={8} 
      />
      <CardStat 
        label="Deaths (Above Avg - Bad)" 
        numericValue={12} 
        averageValue={8} 
        metricKey="deaths"
        rank={7} 
        totalCount={8} 
      />
      <CardStat 
        label="Weapon Accuracy (Below Avg)" 
        numericValue={0.625} 
        averageValue={0.685} 
        metricKey="weaponAccuracy"
        rank={6} 
        totalCount={8} 
      />
      <CardStat 
        label="Hero Damage (On Average)" 
        numericValue={8945} 
        averageValue={8945} 
        metricKey="heroDamageDealt"
        rank={4} 
        totalCount={8} 
      />
      <CardStat 
        label="First Kill Rate (Above Avg)" 
        numericValue={0.428} 
        averageValue={0.315} 
        metricKey="firstKillRate"
        rank={2} 
        totalCount={8} 
      />
      <CardStat 
        label="Ultimate Charge Time (Below Avg)" 
        numericValue={35.2} 
        averageValue={45.8} 
        metricKey="ultimateChargeTime"
        rank={2} 
        totalCount={8} 
      />
    </div>
  ),
};

export const RankDisplayComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Legacy Value Display (Separate Rank)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardStat 
            label="Eliminations (Text Value)" 
            value="32" 
            severity="good" 
            rank={1} 
            totalCount={8} 
          />
          <CardStat 
            label="Deaths (Text Value)" 
            value="8" 
            severity="good" 
            rank={3} 
            totalCount={8} 
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">ValueDelta Display (Integrated Rank)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardStat 
            label="Eliminations (vs Average)" 
            numericValue={32} 
            averageValue={24} 
            metricKey="eliminations"
            rank={1} 
            totalCount={8} 
          />
          <CardStat 
            label="Deaths (vs Average)" 
            numericValue={8} 
            averageValue={10} 
            metricKey="deaths"
            rank={3} 
            totalCount={8} 
          />
        </div>
      </div>
    </div>
  ),
};

// New size-related stories
export const SmallSize: Story = {
  args: {
    label: 'Eliminations',
    value: '32',
    severity: 'good',
    size: 'small',
  },
};

export const SmallWithValueDelta: Story = {
  args: {
    label: 'Hero Damage',
    numericValue: 8945,
    averageValue: 7200,
    metricKey: 'heroDamageDealt',
    rank: 2,
    totalCount: 8,
    size: 'small',
  },
};

export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Large Size (Default)</h3>
        <div className="flex flex-wrap gap-4">
          <CardStat 
            label="Eliminations" 
            value="32" 
            severity="good" 
            size="large"
          />
          <CardStat 
            label="Hero Damage" 
            numericValue={8945} 
            averageValue={7200} 
            metricKey="heroDamageDealt"
            rank={2} 
            totalCount={8} 
            size="large"
          />
          <CardStat 
            label="Weapon Accuracy" 
            value="71.2%" 
            severity="good" 
            rank={3} 
            totalCount={8} 
            size="large"
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Small Size</h3>
        <div className="flex flex-wrap gap-4">
          <CardStat 
            label="Eliminations" 
            value="32" 
            severity="good" 
            size="small"
          />
          <CardStat 
            label="Hero Damage" 
            numericValue={8945} 
            averageValue={7200} 
            metricKey="heroDamageDealt"
            rank={2} 
            totalCount={8} 
            size="small"
          />
          <CardStat 
            label="Weapon Accuracy" 
            value="71.2%" 
            severity="good" 
            rank={3} 
            totalCount={8} 
            size="small"
          />
        </div>
      </div>
    </div>
  ),
};

export const DensityComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-3">Primary Metrics Layout (Large Cards)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardStat 
            label="Final Blows/10min" 
            numericValue={15.2} 
            averageValue={12.8} 
            metricKey="finalBlowsPer10Minutes"
            rank={1} 
            totalCount={8} 
            size="large"
          />
          <CardStat 
            label="Hero Damage/10min" 
            numericValue={8945} 
            averageValue={7200} 
            metricKey="heroDamageDealtPer10Minutes"
            rank={2} 
            totalCount={8} 
            size="large"
          />
          <CardStat 
            label="First Kill Rate" 
            numericValue={0.428} 
            averageValue={0.315} 
            metricKey="firstKillRate"
            rank={1} 
            totalCount={8} 
            size="large"
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Secondary Metrics Layout (Small Cards)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <CardStat 
            label="Eliminations/10min" 
            numericValue={18.5} 
            averageValue={16.2} 
            metricKey="eliminationsPer10Minutes"
            rank={2} 
            totalCount={8} 
            size="small"
          />
          <CardStat 
            label="All Damage/10min" 
            numericValue={9245} 
            averageValue={8100} 
            metricKey="allDamageDealtPer10Minutes"
            rank={3} 
            totalCount={8} 
            size="small"
          />
          <CardStat 
            label="Tank Focus Rate" 
            numericValue={0.35} 
            averageValue={0.28} 
            metricKey="tankFocusRate"
            rank={1} 
            totalCount={8} 
            size="small"
          />
          <CardStat 
            label="Support Focus Rate" 
            numericValue={0.42} 
            averageValue={0.38} 
            metricKey="supportFocusRate"
            rank={2} 
            totalCount={8} 
            size="small"
          />
        </div>
      </div>
    </div>
  ),
};