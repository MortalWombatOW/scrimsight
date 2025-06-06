import HeatmapGrid from "./HeatmapGrid";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof HeatmapGrid> = {
  component: HeatmapGrid,
  argTypes: {
    cellHeight: {
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof HeatmapGrid>;

// Sample data for stories
const sampleData = [
  [10, 20, 30],
  [40, 50, 60],
  [70, 80, 90],
];

const killMatrixData = [
  [0, 3, 1, 0],
  [2, 0, 4, 1],
  [1, 2, 0, 3],
  [0, 1, 2, 0],
];

export const Default: Story = {
  args: {
    data: sampleData,
  },
};

export const WithLabels: Story = {
  args: {
    data: sampleData,
    xLabels: ["Player A", "Player B", "Player C"],
    yLabels: ["Team 1", "Team 2", "Team 3"],
  },
};

export const KillMatrix: Story = {
  args: {
    data: killMatrixData,
    xLabels: ["Victim1", "Victim2", "Victim3", "Victim4"],
    yLabels: ["Killer1", "Killer2", "Killer3", "Killer4"],
    cellHeight: "30px",
    hoverText: (xLabel, yLabel, value) =>
      `${yLabel} killed ${xLabel} ${value} times`,
    cellRender: (_x: number, _y: number, value: number) => (
      <span className="text-sm">{value}</span>
    ),
  },
};

export const CustomStyling: Story = {
  args: {
    data: sampleData,
    xLabels: ["A", "B", "C"],
    yLabels: ["X", "Y", "Z"],
    cellHeight: "40px",
    cellStyle: (_x: number, _y: number, ratio: number) => ({
      background: `rgb(255, 0, 0, ${ratio})`,
      border: "1px solid #ccc",
      borderRadius: "4px",
    }),
    xLabelsStyle: () => ({
      fontSize: "14px",
      fontWeight: "bold",
      color: "#333",
    }),
    yLabelsStyle: () => ({
      fontSize: "14px",
      fontWeight: "bold", 
      color: "#666",
    }),
  },
};

export const LargeDataset: Story = {
  args: {
    data: Array(8).fill(0).map(() => 
      Array(8).fill(0).map(() => Math.floor(Math.random() * 100))
    ),
    xLabels: Array(8).fill(0).map((_, i) => `Col${i + 1}`),
    yLabels: Array(8).fill(0).map((_, i) => `Row${i + 1}`),
    cellHeight: "25px",
  },
};

export const Interactive: Story = {
  args: {
    data: sampleData,
    xLabels: ["Click", "Me", "Please"],
    yLabels: ["Row 1", "Row 2", "Row 3"],
    onClick: (x: number, y: number) => {
      alert(`Clicked cell at position (${x}, ${y})`);
    },
    hoverText: (xLabel, yLabel, value) =>
      `Position: ${xLabel}, ${yLabel} - Value: ${value}`,
  },
};