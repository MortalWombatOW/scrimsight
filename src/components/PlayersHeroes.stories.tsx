import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayersHeroes } from './PlayersHeroes';

const meta: Meta<typeof PlayersHeroes> = {
  title: 'Components/PlayersHeroes',
  component: PlayersHeroes,
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