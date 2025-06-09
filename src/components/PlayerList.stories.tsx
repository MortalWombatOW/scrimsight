import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerList } from './PlayerList';

const meta: Meta<typeof PlayerList> = {
  title: 'Components/PlayerList',
  component: PlayerList,
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