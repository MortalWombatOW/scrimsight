import type { Meta, StoryObj } from '@storybook/react';
import LayerSelector from './LayerSelector';

const meta: Meta<typeof LayerSelector> = {
  title: 'Components/LayerSelector',
  component: LayerSelector,
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