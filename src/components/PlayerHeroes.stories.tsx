import type { Meta, StoryObj } from '@storybook/react';
import { PlayerHeroes } from './PlayerHeroes';

const meta: Meta<typeof PlayerHeroes> = {
  title: 'Components/PlayerHeroes',
  component: PlayerHeroes,
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