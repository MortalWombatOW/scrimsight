import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrimsMatchCard } from '@components';

const meta: Meta<typeof ScrimsMatchCard> = {
  title: 'Components/ScrimsMatchCard',
  component: ScrimsMatchCard,
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