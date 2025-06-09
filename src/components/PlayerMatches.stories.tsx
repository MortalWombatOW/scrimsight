import type { Meta, StoryObj } from '@storybook/react';
import { PlayerMatches } from './PlayerMatches';

const meta: Meta<typeof PlayerMatches> = {
  title: 'Components/PlayerMatches',
  component: PlayerMatches,
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