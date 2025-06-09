import type { Meta, StoryObj } from '@storybook/react';
import { TeamPlayers } from './TeamPlayers';

const meta: Meta<typeof TeamPlayers> = {
  title: 'Components/TeamPlayers',
  component: TeamPlayers,
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