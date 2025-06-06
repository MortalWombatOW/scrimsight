import { PlayerCard } from "./PlayerCard";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PlayerCard> = {
  component: PlayerCard,
  argTypes: {
    playerId: {
      control: "text",
    },
  },
  parameters: {
    docs: {
      description: {
        component: "PlayerCard displays key information about a player, including stats and performance metrics.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PlayerCard>;

export const Default: Story = {
  args: {
    playerId: "sample-player-1",
  },
};

export const AlternatePlayer: Story = {
  args: {
    playerId: "sample-player-2",
  },
};

export const LoadingState: Story = {
  args: {
    playerId: "loading-player",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the loading state when player data is being fetched.",
      },
    },
  },
};

// Note: This component requires atom data to function properly
// In a real application, you would need to provide mock data or configure
// the atom providers for Storybook to display meaningful content