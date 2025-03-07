# Custom Heatmap Component Implementation

## Overview

This task involves creating a custom heatmap grid component to replace the `react-grid-heatmap` package, which is only compatible with React 18 but not with React 19. We'll implement our own version using Tailwind CSS and following best UI practices.

## Background

The `react-grid-heatmap` package provides a way to visualize data in a grid layout with color intensity representing values. The component supports features like:

- Displaying a grid of cells with color intensity based on data values
- Customizable X and Y axis labels
- Configurable cell styling and rendering
- Click handlers for cells
- Options for label positioning and cell dimensions

## Requirements

1. Create a custom React component that replicates the core functionality of `react-grid-heatmap`
2. Ensure compatibility with React 19
3. Use Tailwind CSS for styling
4. Follow best UI practices from the provided style guides
5. Support all the key features of the original component:
   - Data visualization with color intensity
   - X and Y axis labels
   - Custom cell rendering
   - Click handlers
   - Configurable styling

## Component API

The component should support the following props:

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

## Implementation Plan

### 1. Component Structure

- Create a new component file in the appropriate directory
- Define the component with TypeScript interfaces for props
- Set up the basic structure with grid layout using Tailwind CSS

### 2. Core Functionality

- Implement the grid rendering logic
- Calculate color intensity based on data values
- Render cells with appropriate styling

### 3. Labels and Positioning

- Implement X and Y axis labels
- Support different label positions (top/bottom, left/right)

### 4. Customization Options

- Implement custom cell rendering
- Support custom styling for cells and labels
- Add support for square cells

### 5. Interactivity

- Implement click handlers for cells

### 6. Testing and Refinement

- Test the component with various data sets
- Ensure responsive behavior
- Optimize performance

## UI Considerations

- Use a clean, minimal design that focuses on the data
- Ensure sufficient contrast for readability
- Use consistent spacing and alignment
- Consider accessibility for color choices (avoid relying solely on color)
- Provide visual feedback for interactive elements

## Technical Considerations

- Use React's functional components and hooks
- Optimize rendering performance for large datasets
- Ensure the component is fully typed with TypeScript
- Follow the project's component structure guidelines

## Deliverables

1. A custom HeatmapGrid component
2. Documentation for the component
3. Example usage in the application

## References

- Original package: [react-grid-heatmap](https://github.com/arunghosh/react-grid-heatmap)
- Project style guides: react-style.mdc and user-interface.mdc
