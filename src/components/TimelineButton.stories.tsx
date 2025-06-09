import { TimelineButton } from "./TimelineButton";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof TimelineButton> = {
  component: TimelineButton,
  parameters: {
    docs: {
      description: {
        component: "TimelineButton component for timeline interaction controls.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimelineButton>;

export const Default: Story = {
  args: {},
};

// Note: This component may require timeline context to function properly