import BeamsAuraIcon from "./BeamsAuraIcon";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof BeamsAuraIcon> = {
  component: BeamsAuraIcon,
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

type Story = StoryObj<typeof BeamsAuraIcon>;

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

export const Blue: Story = {
  args: {
    size: 32,
    fill: "#3b82f6",
  },
};

export const Green: Story = {
  args: {
    size: 32,
    fill: "#10b981",
  },
};

export const Small: Story = {
  args: {
    size: 16,
    fill: "#000000",
  },
};