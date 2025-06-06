import { ScrimCard } from "./ScrimCard";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ScrimCard> = {
  component: ScrimCard,
  argTypes: {
    scrimId: {
      control: "text",
    },
  },
  parameters: {
    docs: {
      description: {
        component: "ScrimCard displays key information about a scrim session, including teams, maps, and results.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ScrimCard>;

export const Default: Story = {
  args: {
    scrimId: "sample-scrim-1",
  },
};

export const AlternateScrim: Story = {
  args: {
    scrimId: "sample-scrim-2",
  },
};

export const LoadingState: Story = {
  args: {
    scrimId: "loading-scrim",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the loading state when scrim data is being fetched.",
      },
    },
  },
};

// Note: This component requires atom data to function properly
// In a real application, you would need to provide mock data or configure
// the atom providers for Storybook to display meaningful content