import { TimelineControls } from "./TimelineControls";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TimelineControls> = {
  component: TimelineControls,
  parameters: {
    docs: {
      description: {
        component: "TimelineControls provides control interface for timeline playback and navigation.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimelineControls>;

export const Default: Story = {
  args: {},
};

// Note: This component requires timeline context to function properly