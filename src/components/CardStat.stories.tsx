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