import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricsDataTable } from './MetricsDataTable';

const meta: Meta<typeof MetricsDataTable> = {
  title: 'Components/MetricsDataTable',
  component: MetricsDataTable,
  parameters: { 
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add component props as needed
  },
};