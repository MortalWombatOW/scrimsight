import { TimeSegmentDisplay } from "./TimeSegmentDisplay";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TimeSegmentDisplay> = {
  component: TimeSegmentDisplay,
  parameters: {
    docs: {
      description: {
        component: "TimeSegmentDisplay shows individual time segments within the timeline.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimeSegmentDisplay>;

export const Default: Story = {
  args: {},
};

// Note: This component may require timeline context to function properly