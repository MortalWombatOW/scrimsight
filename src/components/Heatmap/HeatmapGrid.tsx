import React, { useMemo, type ReactNode } from "react";

export interface HeatmapGridProps {
  /**
   * 2D array of numbers for the heatmap
   */
  data: number[][];

  /**
   * Labels for the X-axis
   */
  xLabels?: string[];

  /**
   * Labels for the Y-axis
   */
  yLabels?: string[];

  /**
   * Height of each cell
   */
  cellHeight?: string;

  /**
   * Handler for cell clicks
   */
  onClick?: (x: number, y: number) => void;

  /**
   * Custom cell renderer
   */
  cellRender?: (x: number, y: number, value: number) => React.ReactNode;

  /**
   * Custom cell styling
   */
  cellStyle?: (x: number, y: number, ratio: number) => React.CSSProperties;

  /**
   * Custom X-label styling
   */
  xLabelsStyle?: (index: number) => React.CSSProperties;

  /**
   * Custom Y-label styling
   */
  yLabelsStyle?: (index: number) => React.CSSProperties;

  /**
   * Function to generate tooltip text when hovering over a cell
   */
  hoverText?: (xLabel: string, yLabel: string, value: number) => string;
}

export const HeatmapGrid = ({
  data,
  xLabels = [],
  yLabels = [],
  cellHeight = "2rem",
  onClick,
  cellRender,
  cellStyle,
  xLabelsStyle,
  yLabelsStyle,
  hoverText,
}: HeatmapGridProps): ReactNode => {
  // Find the maximum value in the data to calculate ratios
  const maxValue = useMemo(() => {
    let max = 0;
    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < data[y].length; x++) {
        if (data[y][x] > max) {
          max = data[y][x];
        }
      }
    }
    return max;
  }, [data]);

  return (
    <div className="w-full relative">
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns:
            yLabels.length > 0 ? `auto ${cellHeight}px` : `${cellHeight}px`,
          gridTemplateRows:
            xLabels.length > 0 ? `auto ${cellHeight}px` : `${cellHeight}px`,
        }}
      >
        {/* Empty cell in top-left corner when both x and y labels exist */}
        {xLabels.length > 0 && yLabels.length > 0 && (
          <div style={{ gridColumn: "1", gridRow: "1" }}></div>
        )}

        {/* X-axis labels */}
        {xLabels.length > 0 && (
          <div
            className="grid grid-flow-col auto-cols-fr self-end"
            style={{
              gridColumn: "2",
              gridRow: "1",
              gridTemplateColumns: `repeat(${xLabels.length}, ${cellHeight})`,
            }}
          >
            {xLabels.map((label, index) => (
              <div
                key={`x-label-${index}`}
                className="px-1 text-center overflow-hidden text-ellipsis whitespace-nowrap"
                style={xLabelsStyle ? xLabelsStyle(index) : {}}
              >
                {label}
              </div>
            ))}
          </div>
        )}

        {/* Y-axis labels */}
        {yLabels.length > 0 && (
          <div
            className="flex flex-col justify-center mt-0.5"
            style={{
              gridColumn: "1",
              gridRow: "2",
            }}
          >
            {yLabels.map((label, index) => (
              <div
                key={`y-label-${index}`}
                className="py-1 pr-2 text-right overflow-hidden text-ellipsis whitespace-nowrap"
                style={{
                  height: cellHeight,
                  ...(yLabelsStyle ? yLabelsStyle(index) : {}),
                }}
              >
                {label}
              </div>
            ))}
          </div>
        )}

        {/* Main grid */}
        <div
          className="grid"
          style={{
            gridColumn: "2",
            gridRow: "2",
            gridTemplateColumns: `repeat(${
              data[0]?.length || 0
            }, ${cellHeight})`,
            gridTemplateRows: `repeat(${data.length}, ${cellHeight})`,
          }}
        >
          {data.map((row, y) =>
            row.map((value, x) => {
              const ratio = maxValue > 0 ? value / maxValue : 0;
              const xLabel = x < xLabels.length ? xLabels[x] : `${x}`;
              const yLabel = y < yLabels.length ? yLabels[y] : `${y}`;

              return (
                <div
                  key={`cell-${y}-${x}`}
                  className="flex items-center justify-center border border-base-200 relative group w-full h-full"
                  style={{
                    background: `rgba(120, 120, 120, ${ratio})`,
                    cursor: onClick ? "pointer" : "default",
                    ...(cellStyle ? cellStyle(x, y, ratio) : {}),
                  }}
                  onClick={() => onClick?.(x, y)}
                  role={onClick ? "button" : undefined}
                  tabIndex={onClick ? 0 : undefined}
                >
                  <div className="flex items-center justify-center w-full h-full">
                    {cellRender ? cellRender(x, y, value) : value}
                  </div>
                  {hoverText && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out pointer-events-none bg-base-800 text-white text-sm rounded px-2 py-1 mt-1 shadow-lg max-w-xs text-center whitespace-normal">
                      {hoverText(xLabel, yLabel, value)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HeatmapGrid;
