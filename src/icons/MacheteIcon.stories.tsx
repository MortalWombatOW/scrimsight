import MacheteIcon from "./MacheteIcon";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof MacheteIcon> = {
  component: MacheteIcon,
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

type Story = StoryObj<typeof MacheteIcon>;

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

export const Silver: Story = {
  args: {
    size: 32,
    fill: "#9ca3af",
  },
};

export const Red: Story = {
  args: {
    size: 32,
    fill: "#dc2626",
  },
};

export const Small: Story = {
  args: {
    size: 16,
    fill: "#000000",
  },
};