import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart, // Import ScatterChart
  Scatter, // Import Scatter
  Label, // Import Label for axes
  Cell, // Import Cell for individual bar/point styling
  // Added Text component for potential custom tick/label styling if needed
  // Text,
} from "recharts";
import {
  PlayerStatsCategoryKeys,
} from "@atoms";
import { getColor, formatStat, PlayerStatKey, getStatLabel } from "@library"; // Import color function and prettyFormat

const CustomTooltip = ({ active, payload, groupBy }: any) => {
  if (active && payload && payload.length) {
    // For ScatterChart, payload[0].payload contains the full data object
    const data = payload[0].payload;
    
    return (
      <div className="bg-base-200 border border-base-300 p-3 rounded shadow-xl z-50 min-w-[150px]">
        {groupBy.map((key: string) => (
           <div key={key} className="font-bold text-white mb-2 border-b border-base-content/10 pb-1">
             <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
             <span className="text-primary">{data[key]}</span>
           </div>
        ))}
        <div className="space-y-1">
          {payload.map((entry: any) => (
            <div key={entry.name} className="text-sm flex justify-between gap-4">
              <span className="text-base-content/70 capitalize">{getStatLabel(entry.name as PlayerStatKey)}: </span>
              <span className="font-mono font-bold text-base-content">
                {formatStat(entry.name as PlayerStatKey, entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

interface MetricsChartProps {
  data: Record<string, unknown>[];
  groupBy: PlayerStatsCategoryKeys[];
  metrics: PlayerStatKey[];
  hoveredRowId?: string | null;
  getRowId?: (row: any) => string;
  onPointHover?: (id: string | null) => void;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  data,
  groupBy,
  metrics,
  hoveredRowId,
  getRowId,
  onPointHover,
}) => {
  // Initial checks
  if (!data || data.length === 0 || groupBy.length === 0) {
    return (
      <p className="text-center italic h-full flex items-center justify-center">
        Select at least one 'Group By' dimension and ensure data is available.
      </p>
    );
  }

  // Conditional rendering based on number of metrics
  if (metrics.length === 1) {
    // Render Horizontal Bar Chart for 1 metric
    const metricKey = metrics[0];
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-content)" opacity={0.1} />
          <YAxis
            type="category"
            dataKey={groupBy[0]}
            tick={{ fill: "var(--color-base-content)" }}
            stroke="var(--color-base-content)"
            strokeOpacity={0.2}
            width={140}
          />
          <XAxis
            type="number"
            tick={{ fill: "var(--color-base-content)" }}
            stroke="var(--color-base-content)"
            strokeOpacity={0.2}
          >
            <Label
              value={getStatLabel(metricKey)}
              offset={-10}
              position="insideBottom"
              style={{
                textAnchor: "middle",
                fill: "var(--color-base-content)",
              }}
            />
          </XAxis>
          {/* Style tooltip background and text */}
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-base-200)",
              border: "1px solid var(--color-base-300)",
              color: "var(--color-base-content)",
            }}
            itemStyle={{ color: "var(--color-base-content)" }}
            cursor={{ fill: "var(--color-primary)", opacity: 0.1 }}
          />
          {/* Style legend text */}
          {/* Style legend text */}
          <Bar
            dataKey={metricKey}
            onMouseEnter={(data: any) => {
              if (onPointHover && getRowId) {
                const item = data.payload || data;
                onPointHover(getRowId(item));
              }
            }}
            onMouseLeave={() => {
              if (onPointHover) {
                onPointHover(null);
              }
            }}
          >
            {data.map((entry, index) => {
              const rowId = getRowId ? getRowId(entry) : null;
              const isHovered = hoveredRowId && rowId === hoveredRowId;
              const isAnyHovered = !!hoveredRowId;
              
              // If nothing is hovered, show default color (primary)
              // If something is hovered:
              //   - If this is the hovered item: show primary
              //   - If this is NOT the hovered item: show dimmed content color
              
              let fillColor = getColor(0); // Default primary
              
              if (isAnyHovered) {
                if (isHovered) {
                  fillColor = "var(--color-primary)";
                } else {
                  fillColor = "var(--color-base-content)"; // Dimmed
                }
              }
              
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={fillColor} 
                  opacity={isAnyHovered && !isHovered ? 0.3 : 1}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (metrics.length === 2) {
    // Render Scatter Chart for 2 metrics
    const xMetric = metrics[0];
    const yMetric = metrics[1];
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 25, left: 25 }} // Adjusted margins
        >
          {/* Use a lighter stroke for grid on dark background */}
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-content)" opacity={0.1} />
          {/* Style axis ticks and labels */}
          <XAxis
            type="number"
            dataKey={xMetric}
            name={xMetric}
            tick={{ fill: "var(--color-base-content)" }}
            stroke="var(--color-base-content)"
            strokeOpacity={0.2}
          >
            <Label
              value={getStatLabel(xMetric)}
              offset={-15}
              position="insideBottom"
              fill="var(--color-base-content)"
            />
          </XAxis>
          <YAxis
            type="number"
            dataKey={yMetric}
            name={yMetric}
            tick={{ fill: "var(--color-base-content)" }}
            stroke="var(--color-base-content)"
            strokeOpacity={0.2}
          >
            <Label
              value={getStatLabel(yMetric)}
              angle={-90}
              position="insideLeft"
              style={{
                textAnchor: "middle",
                fill: "var(--color-base-content)",
              }}
            />
          </YAxis>
          {/* Style tooltip background and text */}
          {/* Style tooltip background and text */}
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={<CustomTooltip groupBy={groupBy} />}
          />
          {/* Style legend text */}
          <Legend wrapperStyle={{ color: "var(--color-base-content)", paddingTop: "20px" }} />
          {/* Use groupBy[0] for the name of the scatter points */}
          {/* Use groupBy[0] for the name of the scatter points */}
          <Scatter
            name={groupBy[0]}
            data={data}
            onMouseEnter={(data: any) => {
              if (onPointHover && getRowId) {
                const item = data.payload || data;
                onPointHover(getRowId(item));
              }
            }}
            onMouseLeave={() => {
              if (onPointHover) {
                onPointHover(null);
              }
            }}
          >
            {data.map((entry, index) => {
              const rowId = getRowId ? getRowId(entry) : null;
              const isHovered = hoveredRowId && rowId === hoveredRowId;
              const isAnyHovered = !!hoveredRowId;
              
              let fillColor = getColor(0);
              
              if (isAnyHovered) {
                if (isHovered) {
                  fillColor = "var(--color-primary)";
                } else {
                  fillColor = "var(--color-base-content)";
                }
              }
              
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={fillColor}
                  opacity={isAnyHovered && !isHovered ? 0.3 : 1}
                />
              );
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    );
  } else {
    // Render placeholder for 0 or >2 metrics
    return (
      <p className="text-center italic h-full flex items-center justify-center">
        Please select exactly 1 or 2 metrics to display a chart.
      </p>
    );
  }
};
