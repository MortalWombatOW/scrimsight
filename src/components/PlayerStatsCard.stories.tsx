import type { Meta, StoryObj } from '@storybook/react';
import { PlayerStatsCard } from './PlayerStatsCard';

const meta: Meta<typeof PlayerStatsCard> = {
  title: 'Components/PlayerStatsCard',
  component: PlayerStatsCard,
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