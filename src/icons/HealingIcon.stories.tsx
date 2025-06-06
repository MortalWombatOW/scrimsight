import HealingIcon from "./HealingIcon";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof HealingIcon> = {
  component: HealingIcon,
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

type Story = StoryObj<typeof HealingIcon>;

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

export const Green: Story = {
  args: {
    size: 32,
    fill: "#10b981",
  },
};

export const Yellow: Story = {
  args: {
    size: 32,
    fill: "#f59e0b",
  },
};

export const Small: Story = {
  args: {
    size: 16,
    fill: "#000000",
  },
};