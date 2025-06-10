import { TimelineTable } from "./TimelineTable";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof TimelineTable> = {
  component: TimelineTable,
  parameters: {
    docs: {
      description: {
        component: "TimelineTable displays timeline data in a tabular format.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimelineTable>;

export const Default: Story = {
  args: {},
};

// Note: This component requires timeline context to function properly