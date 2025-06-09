import { TimelineProvider } from "./TimelineContext";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof TimelineProvider> = {
  component: TimelineProvider,
  argTypes: {
    matchId: {
      control: "text",
    },
  },
  parameters: {
    docs: {
      description: {
        component: "TimelineProvider provides timeline context for child components.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TimelineProvider>;

export const Default: Story = {
  args: {
    matchId: "sample-match-1",
    children: <div className="p-4">Timeline context provided</div>,
  },
};

// Note: This is a context provider component