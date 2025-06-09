import type { Meta, StoryObj } from '@storybook/react-vite';
import { TeamCompositions } from './TeamCompositions';

const meta: Meta<typeof TeamCompositions> = {
  title: 'Components/TeamCompositions',
  component: TeamCompositions,
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