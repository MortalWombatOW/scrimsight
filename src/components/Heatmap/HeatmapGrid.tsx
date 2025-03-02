import React, { useMemo } from "react";

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
   * Whether cells should be square
   */
  square?: boolean;

  /**
   * Position of X-axis labels
   */
  xLabelsPos?: "top" | "bottom";

  /**
   * Position of Y-axis labels
   */
  yLabelsPos?: "left" | "right";

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
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({
  data,
  xLabels = [],
  yLabels = [],
  cellHeight = "2rem",
  onClick,
  square = false,
  xLabelsPos = "top",
  yLabelsPos = "left",
  cellRender,
  cellStyle,
  xLabelsStyle,
  yLabelsStyle,
}) => {
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

  // Calculate the width of each cell if square is true
  const cellWidth = square ? cellHeight : "1fr";

  // Determine the grid template based on label positions
  const gridTemplateAreas = useMemo(() => {
    const hasXLabels = xLabels.length > 0;
    const hasYLabels = yLabels.length > 0;

    const xLabelArea = hasXLabels
      ? xLabelsPos === "top"
        ? '"x-labels"'
        : '"x-labels-bottom"'
      : "";
    const yLabelLeftArea =
      hasYLabels && yLabelsPos === "left" ? "y-labels" : ".";
    const yLabelRightArea =
      hasYLabels && yLabelsPos === "right" ? "y-labels-right" : ".";

    const mainGridArea = `"${yLabelLeftArea} grid ${yLabelRightArea}"`;

    if (hasXLabels) {
      if (xLabelsPos === "top") {
        return `${xLabelArea} ${mainGridArea}`;
      } else {
        return `${mainGridArea} ${xLabelArea}`;
      }
    }

    return mainGridArea;
  }, [xLabels.length, yLabels.length, xLabelsPos, yLabelsPos]);

  return (
    <div className="w-full">
      <div
        className="grid"
        style={{
          gridTemplateAreas,
          gridTemplateColumns:
            yLabelsPos === "left" ? "auto 1fr auto" : "1fr auto",
          gridTemplateRows: xLabelsPos === "top" ? "auto 1fr" : "1fr auto",
        }}
      >
        {/* X-axis labels */}
        {xLabels.length > 0 && (
          <div
            className={`grid grid-flow-col auto-cols-fr ${
              xLabelsPos === "top" ? "self-end" : "self-start"
            }`}
            style={{
              gridArea: xLabelsPos === "top" ? "x-labels" : "x-labels-bottom",
              gridTemplateColumns: `repeat(${xLabels.length}, ${cellWidth})`,
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

        {/* Y-axis labels - left */}
        {yLabels.length > 0 && yLabelsPos === "left" && (
          <div
            className="flex flex-col justify-center"
            style={{ gridArea: "y-labels" }}
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
            gridArea: "grid",
            gridTemplateColumns: `repeat(${
              data[0]?.length || 0
            }, ${cellWidth})`,
            gridTemplateRows: `repeat(${data.length}, ${cellHeight})`,
          }}
        >
          {data.map((row, y) =>
            row.map((value, x) => {
              const ratio = maxValue > 0 ? value / maxValue : 0;

              return (
                <div
                  key={`cell-${y}-${x}`}
                  className="flex items-center justify-center border border-gray-200"
                  style={{
                    height: cellHeight,
                    background: `rgba(12, 160, 44, ${ratio})`,
                    cursor: onClick ? "pointer" : "default",
                    ...(cellStyle ? cellStyle(x, y, ratio) : {}),
                  }}
                  onClick={() => onClick?.(x, y)}
                  role={onClick ? "button" : undefined}
                  tabIndex={onClick ? 0 : undefined}
                >
                  {cellRender ? cellRender(x, y, value) : value}
                </div>
              );
            })
          )}
        </div>

        {/* Y-axis labels - right */}
        {yLabels.length > 0 && yLabelsPos === "right" && (
          <div
            className="flex flex-col justify-center"
            style={{ gridArea: "y-labels-right" }}
          >
            {yLabels.map((label, index) => (
              <div
                key={`y-label-right-${index}`}
                className="py-1 pl-2 text-left overflow-hidden text-ellipsis whitespace-nowrap"
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
      </div>
    </div>
  );
};

export default HeatmapGrid;
