import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricsChart } from './MetricsChart';

const meta: Meta<typeof MetricsChart> = {
  title: 'Components/MetricsChart',
  component: MetricsChart,
  parameters: { 
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [],
    groupBy: ['playerName'],
    metrics: ['eliminations'],
  },
};