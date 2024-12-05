import type { Meta, StoryObj } from "@storybook/react";
import MetricCard from "./MetricCard";

const meta: Meta<typeof MetricCard> = {
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    columnName: {
      control: 'select',
      options: ['damage', 'healing', 'deaths', 'eliminations'],
      description: 'The metric to display',
    },
    slice: {
      control: 'object',
      description: 'Filters to apply to the data',
    },
    compareToOther: {
      control: {
        type: 'multi-select',
        options: ['tank', 'damage', 'support'],
      },
      description: 'Other roles to compare against',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MetricCard>;

// Basic damage metric for tanks
export const TankDamage: Story = {
  args: {
    columnName: 'allDamageDealt',
    slice: { role: 'tank' },
    compareToOther: ['damage', 'support'],
  },
};

// Healing metric for supports
export const SupportHealing: Story = {
  args: {
    columnName: 'healing',
    slice: { role: 'support' },
    compareToOther: ['tank', 'damage'],
  },
};

// Deaths metric for damage role
export const DamageDeaths: Story = {
  args: {
    columnName: 'deaths',
    slice: { role: 'damage' },
    compareToOther: ['tank', 'support'],
  },
};

// Eliminations metric
export const DamageEliminations: Story = {
  args: {
    columnName: 'eliminations',
    slice: { role: 'damage' },
    compareToOther: ['tank', 'support'],
  },
};

// Show metrics grid for a role
export const TankMetricsGrid: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gap: '1rem',
      width: '100%',
    }}>
      <MetricCard 
        columnName="damage" 
        slice={{ role: 'tank' }} 
        compareToOther={['damage', 'support']} 
      />
      <MetricCard 
        columnName="deaths" 
        slice={{ role: 'tank' }} 
        compareToOther={['damage', 'support']} 
      />
      <MetricCard 
        columnName="eliminations" 
        slice={{ role: 'tank' }} 
        compareToOther={['damage', 'support']} 
      />
      <MetricCard 
        columnName="healing" 
        slice={{ role: 'tank' }} 
        compareToOther={['damage', 'support']} 
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows all relevant metrics for the tank role in a grid layout.',
      },
    },
  },
};

// Compare roles
export const RoleComparison: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <MetricCard 
        columnName="allDamageDealt" 
        slice={{ role: 'tank' }} 
        compareToOther={['damage', 'support']} 
      />
      <MetricCard 
        columnName="damage" 
        slice={{ role: 'damage' }} 
        compareToOther={['tank', 'support']} 
      />
      <MetricCard 
        columnName="damage" 
        slice={{ role: 'support' }} 
        compareToOther={['tank', 'damage']} 
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compares damage metrics across different roles.',
      },
    },
  },
}; 