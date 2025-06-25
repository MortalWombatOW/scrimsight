import type { Meta, StoryObj } from "@storybook/react";
import ComputedText from "./ComputedText";

const meta: Meta<typeof ComputedText> = {
  title: "Components/ComputedText",
  component: ComputedText,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A component that wraps its children in a DaisyUI badge with outline, soft, and secondary styling.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Content to display inside the badge",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Computed Value",
  },
};

export const WithNumber: Story = {
  args: {
    children: "42",
  },
};

export const WithPercentage: Story = {
  args: {
    children: "85.7%",
  },
};

export const WithCalculation: Story = {
  args: {
    children: "avg: 156.2",
  },
};

export const WithMultipleValues: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <ComputedText>Total: 1,234</ComputedText>
      <ComputedText>Average: 42.5</ComputedText>
      <ComputedText>Max: 89</ComputedText>
      <ComputedText>Min: 12</ComputedText>
    </div>
  ),
};

export const InText: Story = {
  render: () => (
    <p className="text-base">
      The player's KDA ratio is <ComputedText>2.5</ComputedText> with an average
      damage of <ComputedText>15,420</ComputedText> per match.
    </p>
  ),
};

export const StatsSummary: Story = {
  render: () => (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Player Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-base-content/70">Wins:</span>
            <ComputedText>127</ComputedText>
          </div>
          <div>
            <span className="text-sm text-base-content/70">Win Rate:</span>
            <ComputedText>73.4%</ComputedText>
          </div>
          <div>
            <span className="text-sm text-base-content/70">KDA:</span>
            <ComputedText>1.85</ComputedText>
          </div>
          <div>
            <span className="text-sm text-base-content/70">Avg Damage:</span>
            <ComputedText>18,945</ComputedText>
          </div>
        </div>
      </div>
    </div>
  ),
};
