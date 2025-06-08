import type { Meta, StoryObj } from '@storybook/react';
import { TeamMatches } from './TeamMatches';

const meta: Meta<typeof TeamMatches> = {
  title: 'Components/TeamMatches',
  component: TeamMatches,
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