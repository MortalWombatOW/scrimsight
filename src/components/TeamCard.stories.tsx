import { TeamCard } from "./TeamCard";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TeamCard> = {
  component: TeamCard,
  argTypes: {
    teamId: {
      control: "text",
    },
  },
  parameters: {
    docs: {
      description: {
        component: "TeamCard displays key information about a team, including players, stats, and performance metrics.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TeamCard>;

export const Default: Story = {
  args: {
    teamId: "sample-team-1",
  },
};

export const AlternateTeam: Story = {
  args: {
    teamId: "sample-team-2",
  },
};

export const LoadingState: Story = {
  args: {
    teamId: "loading-team",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the loading state when team data is being fetched.",
      },
    },
  },
};

// Note: This component requires atom data to function properly
// In a real application, you would need to provide mock data or configure
// the atom providers for Storybook to display meaningful content