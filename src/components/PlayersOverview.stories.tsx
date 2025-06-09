import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayersOverview } from './PlayersOverview';

const meta: Meta<typeof PlayersOverview> = {
  title: 'Components/PlayersOverview',
  component: PlayersOverview,
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