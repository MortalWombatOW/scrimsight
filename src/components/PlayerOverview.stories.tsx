import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerOverview } from './PlayerOverview';

const meta: Meta<typeof PlayerOverview> = {
  title: 'Components/PlayerOverview',
  component: PlayerOverview,
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