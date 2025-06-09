import type { Meta, StoryObj } from '@storybook/react-vite';
import { MatchScoreCard } from './MatchScoreCard';

const meta: Meta<typeof MatchScoreCard> = {
  title: 'Components/MatchScoreCard',
  component: MatchScoreCard,
  parameters: { 
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add component props as needed
  },
};