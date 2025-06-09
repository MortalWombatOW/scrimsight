import type { Meta, StoryObj } from '@storybook/react';
import { TeamOverview } from './TeamOverview';

const meta: Meta<typeof TeamOverview> = {
  title: 'Components/TeamOverview',
  component: TeamOverview,
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