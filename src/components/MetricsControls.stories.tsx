import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricsControls } from './MetricsControls';

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
    // Add component props as needed
  },
};