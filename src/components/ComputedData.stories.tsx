import type { Meta, StoryObj } from "@storybook/react-vite";
import ComputedData from "./ComputedData";
import ComputedText from "./ComputedText";

const meta: Meta<typeof ComputedData> = {
  title: "Components/ComputedData",
  component: ComputedData,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A component that wraps its children in a container with info-themed border and background.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Content to display inside the container",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "This is computed data",
  },
};

export const WithText: Story = {
  args: {
    children: "Player statistics have been calculated based on recent matches.",
  },
};

export const WithComputedValues: Story = {
  render: () => (
    <ComputedData>
      <div className="space-y-2">
        <h3 className="font-semibold">Match Analysis</h3>
        <div className="flex gap-2 flex-wrap">
          <ComputedText>KDA: 2.1</ComputedText>
          <ComputedText>Damage: 18,945</ComputedText>
          <ComputedText>Accuracy: 76%</ComputedText>
        </div>
      </div>
    </ComputedData>
  ),
};

export const WithList: Story = {
  render: () => (
    <ComputedData>
      <h4 className="font-medium mb-2">Top Performers</h4>
      <ul className="space-y-1">
        <li>• Player1 - 2,456 damage</li>
        <li>• Player2 - 2,234 damage</li>
        <li>• Player3 - 1,987 damage</li>
      </ul>
    </ComputedData>
  ),
};

export const WithComplexData: Story = {
  render: () => (
    <ComputedData>
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg">Team Performance Summary</h3>
          <p className="text-sm text-base-content/70">Based on last 10 matches</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium">Overall Win Rate:</span>
            <ComputedText>68.5%</ComputedText>
          </div>
          <div>
            <span className="text-sm font-medium">Avg Match Duration:</span>
            <ComputedText>24:32</ComputedText>
          </div>
          <div>
            <span className="text-sm font-medium">Total Eliminations:</span>
            <ComputedText>1,247</ComputedText>
          </div>
          <div>
            <span className="text-sm font-medium">Best Streak:</span>
            <ComputedText>7 wins</ComputedText>
          </div>
        </div>
        
        <div className="pt-2 border-t border-info/20">
          <p className="text-xs text-base-content/60">
            Data computed automatically after each match
          </p>
        </div>
      </div>
    </ComputedData>
  ),
};

export const MultipleContainers: Story = {
  render: () => (
    <div className="space-y-4">
      <ComputedData>
        <h4 className="font-medium">Individual Stats</h4>
        <div className="flex gap-2 mt-2">
          <ComputedText>Kills: 42</ComputedText>
          <ComputedText>Deaths: 18</ComputedText>
          <ComputedText>Assists: 31</ComputedText>
        </div>
      </ComputedData>
      
      <ComputedData>
        <h4 className="font-medium">Team Stats</h4>
        <div className="flex gap-2 mt-2">
          <ComputedText>Rounds Won: 13</ComputedText>
          <ComputedText>Rounds Lost: 3</ComputedText>
          <ComputedText>OT Rounds: 2</ComputedText>
        </div>
      </ComputedData>
    </div>
  ),
};

export const WithNestedContent: Story = {
  render: () => (
    <ComputedData>
      <div className="space-y-4">
        <h3 className="font-semibold">Weapon Performance Analysis</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>AK-47</span>
            <div className="flex gap-2">
              <ComputedText>Kills: 23</ComputedText>
              <ComputedText>Accuracy: 68%</ComputedText>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span>AWP</span>
            <div className="flex gap-2">
              <ComputedText>Kills: 15</ComputedText>
              <ComputedText>Accuracy: 89%</ComputedText>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span>M4A4</span>
            <div className="flex gap-2">
              <ComputedText>Kills: 19</ComputedText>
              <ComputedText>Accuracy: 72%</ComputedText>
            </div>
          </div>
        </div>
      </div>
    </ComputedData>
  ),
};