import { TimelineDisplay } from "./TimelineDisplay";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TimelineDisplay> = {
  component: TimelineDisplay,
  parameters: {
    docs: {
      description: {
        component: "TimelineDisplay provides the main timeline visualization interface.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimelineDisplay>;

export const Default: Story = {
  args: {},
};

// Note: This component requires timeline context and THREE.js to function properly