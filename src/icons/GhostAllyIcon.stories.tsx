import GhostAllyIcon from "./GhostAllyIcon";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof GhostAllyIcon> = {
  component: GhostAllyIcon,
  argTypes: {
    size: {
      control: { type: "range", min: 12, max: 128, step: 4 },
    },
    fill: {
      control: "color",
    },
  },
};

export default meta;

type Story = StoryObj<typeof GhostAllyIcon>;

export const Default: Story = {
  args: {
    size: 32,
    fill: "#000000",
  },
};

export const Large: Story = {
  args: {
    size: 64,
    fill: "#000000",
  },
};

export const Purple: Story = {
  args: {
    size: 32,
    fill: "#8b5cf6",
  },
};

export const White: Story = {
  args: {
    size: 32,
    fill: "#ffffff",
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Small: Story = {
  args: {
    size: 16,
    fill: "#000000",
  },
};