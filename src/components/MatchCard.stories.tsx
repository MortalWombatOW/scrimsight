import { MatchCard } from "./MatchCard";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof MatchCard> = {
  component: MatchCard,
  argTypes: {
    matchId: {
      control: "text",
    },
  },
  parameters: {
    docs: {
      description: {
        component: "MatchCard displays key information about a match, including teams, result, and duration.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MatchCard>;

export const Default: Story = {
  args: {
    matchId: "sample-match-1",
  },
};

export const AlternateMatch: Story = {
  args: {
    matchId: "sample-match-2", 
  },
};

export const LoadingState: Story = {
  args: {
    matchId: "loading-match",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the loading state when match data is being fetched.",
      },
    },
  },
};

// Note: This component requires atom data to function properly
// In a real application, you would need to provide mock data or configure
// the atom providers for Storybook to display meaningful content