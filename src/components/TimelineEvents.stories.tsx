import { TimelineEvents } from "./TimelineEvents";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof TimelineEvents> = {
  component: TimelineEvents,
  parameters: {
    docs: {
      description: {
        component: "TimelineEvents displays events within the timeline visualization.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimelineEvents>;

export const Default: Story = {
  args: {},
};

// Note: This component requires timeline context to function properly