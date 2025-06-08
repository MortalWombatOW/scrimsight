import type { Meta, StoryObj } from '@storybook/react';
import { AllPlayerComparison } from './AllPlayerComparison';

const meta: Meta<typeof AllPlayerComparison> = {
  title: 'Components/AllPlayerComparison',
  component: AllPlayerComparison,
  parameters: { 
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    matchId: 'sample-match-id',
  },
};