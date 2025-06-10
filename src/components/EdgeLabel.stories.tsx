import type { Meta, StoryObj } from '@storybook/react-vite';
import EdgeLabel from './EdgeLabel';

const meta: Meta<typeof EdgeLabel> = {
  title: 'Components/EdgeLabel',
  component: EdgeLabel,
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