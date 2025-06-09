import { Navigation } from "./Navigation";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Navigation> = {
  component: Navigation,
  parameters: {
    docs: {
      description: {
        component: "Navigation component provides the main application navigation menu.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  args: {},
};

export const Expanded: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Navigation component in its default expanded state showing all menu items.",
      },
    },
  },
};

// Note: This component requires routing context to function properly
// In a real application, you would need to provide mock router context for Storybook