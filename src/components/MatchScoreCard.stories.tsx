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
    matchData: {
      team1Name: "Team Alpha",
      team2Name: "Team Beta", 
      team1Score: 3,
      team2Score: 2,
      roundWinners: ["team1", "team2", "team1", "team2", "team1"],
    },
  },
};