import { ProgressBar } from "./ProgressBar";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    maxValue: {
      control: "number",
    },
    height: {
      control: "select",
      options: ["h-1", "h-2", "h-3", "h-4", "h-6", "h-8"],
    },
    reverse: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    value: 50,
    maxValue: 100,
  },
};

export const LowProgress: Story = {
  args: {
    value: 15,
    maxValue: 100,
  },
};

export const HighProgress: Story = {
  args: {
    value: 85,
    maxValue: 100,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    maxValue: 100,
  },
};

export const CustomMax: Story = {
  args: {
    value: 350,
    maxValue: 500,
  },
};

export const Thick: Story = {
  args: {
    value: 60,
    maxValue: 100,
    height: "h-6",
  },
};

export const Thin: Story = {
  args: {
    value: 40,
    maxValue: 100,
    height: "h-1",
  },
};

export const Reversed: Story = {
  args: {
    value: 70,
    maxValue: 100,
    reverse: true,
  },
};

export const WithCustomClass: Story = {
  args: {
    value: 45,
    maxValue: 100,
    className: "border border-gray-300",
  },
};