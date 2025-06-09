import type { Meta, StoryObj } from '@storybook/react';
import { PlayersPerformance } from './PlayersPerformance';

const meta: Meta<typeof PlayersPerformance> = {
  title: 'Components/PlayersPerformance',
  component: PlayersPerformance,
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