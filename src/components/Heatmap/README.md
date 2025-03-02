# HeatmapGrid Component

A React component for visualizing data in a grid layout with color intensity representing values. This component is a custom implementation to replace the `react-grid-heatmap` package, ensuring compatibility with React 19.

## Features

- Display data in a grid with color intensity based on values
- Customizable X and Y axis labels
- Configurable label positions (top/bottom, left/right)
- Custom cell rendering and styling
- Interactive cells with click handlers
- Support for square cells
- Fully typed with TypeScript
- Styled with Tailwind CSS

## Installation

The component is part of the Scrimsight codebase and doesn't require additional installation.

## Usage

### Basic Usage

```tsx
import { HeatmapGrid } from "src/components/Heatmap";

// Sample data
const xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const yLabels = ["Morning", "Afternoon", "Evening"];
const data = [
  [10, 20, 30, 40, 50],
  [15, 25, 35, 45, 55],
  [5, 15, 25, 35, 45],
];

const MyComponent = () => {
  return <HeatmapGrid data={data} xLabels={xLabels} yLabels={yLabels} />;
};
```

### Advanced Usage

```tsx
import { HeatmapGrid } from "src/components/Heatmap";

const MyComponent = () => {
  return (
    <HeatmapGrid
      data={data}
      xLabels={xLabels}
      yLabels={yLabels}
      cellHeight="2.5rem"
      xLabelsPos="bottom"
      yLabelsPos="right"
      square
      cellRender={(x, y, value) => (
        <div title={`Position (${x}, ${y}) = ${value}`}>{value}</div>
      )}
      cellStyle={(_x, _y, ratio) => ({
        background: `rgba(59, 130, 246, ${ratio})`,
        fontSize: ".8rem",
        color: ratio > 0.5 ? "white" : "black",
      })}
      onClick={(x, y) => {
        console.log(`Clicked cell at position (${x}, ${y})`);
      }}
    />
  );
};
```

## Props

| Name         | Type                                                         | Description                         | Default Value |
| ------------ | ------------------------------------------------------------ | ----------------------------------- | ------------- |
| data         | number[][]                                                   | 2D array of numbers for the heatmap | Required      |
| xLabels      | string[]                                                     | Labels for the X-axis               | []            |
| yLabels      | string[]                                                     | Labels for the Y-axis               | []            |
| cellHeight   | string                                                       | Height of each cell                 | "2rem"        |
| onClick      | (x: number, y: number) => void                               | Handler for cell clicks             | undefined     |
| square       | boolean                                                      | Whether cells should be square      | false         |
| xLabelsPos   | "top" \| "bottom"                                            | Position of X-axis labels           | "top"         |
| yLabelsPos   | "left" \| "right"                                            | Position of Y-axis labels           | "left"        |
| cellRender   | (x: number, y: number, value: number) => React.ReactNode     | Custom cell renderer                | undefined     |
| cellStyle    | (x: number, y: number, ratio: number) => React.CSSProperties | Custom cell styling                 | undefined     |
| xLabelsStyle | (index: number) => React.CSSProperties                       | Custom X-label styling              | undefined     |
| yLabelsStyle | (index: number) => React.CSSProperties                       | Custom Y-label styling              | undefined     |

## Examples

See the `HeatmapExample.tsx` file for complete examples of different ways to use the component.
