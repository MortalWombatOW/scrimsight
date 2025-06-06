import { Timeline } from "./Timeline";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Timeline> = {
  component: Timeline,
  argTypes: {
    matchId: {
      control: "text",
    },
  },
  parameters: {
    docs: {
      description: {
        component: "Timeline component provides an interactive visualization of match flow, integrating THREE.js rendering with React UI controls.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Timeline>;

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
        story: "Shows the loading state when match data is being fetched for timeline visualization.",
      },
    },
  },
};

// Note: This component requires comprehensive atom data and THREE.js to function properly
// In a real application, you would need to provide mock data or configure
// the atom providers for Storybook to display meaningful content