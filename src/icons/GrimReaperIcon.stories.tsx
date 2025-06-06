import GrimReaperIcon from "./GrimReaperIcon";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof GrimReaperIcon> = {
  component: GrimReaperIcon,
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

type Story = StoryObj<typeof GrimReaperIcon>;

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

export const Red: Story = {
  args: {
    size: 32,
    fill: "#ef4444",
  },
};

export const Dark: Story = {
  args: {
    size: 32,
    fill: "#1f2937",
  },
};

export const Small: Story = {
  args: {
    size: 16,
    fill: "#000000",
  },
};