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
  // Added Text component for potential custom tick/label styling if needed
  // Text,
} from "recharts";
import {
  PlayerStatsCategoryKeys,
  PlayerStatsNumericalKeys,
} from "@library/playerMetricsAtoms";
import { getColor } from "@lib/metricExplorerStyles"; // Import color function

interface MetricsChartProps {
  data: any[]; // Consider defining a more specific type if possible
  groupBy: PlayerStatsCategoryKeys[];
  metrics: PlayerStatsNumericalKeys[];
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  data,
  groupBy,
  metrics,
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
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--b3) / 0.2)" />
          <YAxis
            type="category"
            dataKey={groupBy[0]}
            tick={{ fill: "hsl(var(--bc))" }}
            stroke="hsl(var(--bc) / 0.5)"
            width={140}
          />
          <XAxis
            type="number"
            tick={{ fill: "hsl(var(--bc))" }}
            stroke="hsl(var(--bc) / 0.5)"
          >
            <Label
              value={metricKey}
              offset={-10}
              position="insideBottom"
              style={{
                textAnchor: "middle",
                fill: "hsl(var(--bc))",
              }}
            />
          </XAxis>
          {/* Style tooltip background and text */}
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--b1))",
              borderColor: "hsl(var(--b3))",
              color: "hsl(var(--bc))",
            }}
            itemStyle={{ color: "hsl(var(--bc))" }}
            cursor={{ fill: "hsl(var(--p) / 0.1)" }}
          />
          {/* Style legend text */}
          <Bar dataKey={metricKey} fill={getColor(0)} />{" "}
          {/* Color will be updated next */}
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
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--b3) / 0.2)" />
          {/* Style axis ticks and labels */}
          <XAxis
            type="number"
            dataKey={xMetric}
            name={xMetric}
            tick={{ fill: "hsl(var(--bc))" }}
            stroke="hsl(var(--bc) / 0.5)"
          >
            <Label
              value={xMetric}
              offset={-15}
              position="insideBottom"
              fill="hsl(var(--bc))"
            />
          </XAxis>
          <YAxis
            type="number"
            dataKey={yMetric}
            name={yMetric}
            tick={{ fill: "var(--color-base-content)" }}
            stroke="var(--color-base-content)"
          >
            <Label
              value={yMetric}
              angle={-90}
              position="insideLeft"
              style={{
                textAnchor: "middle",
                fill: "hsl(var(--bc))",
              }}
            />
          </YAxis>
          {/* Style tooltip background and text */}
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: "hsl(var(--b1))",
              borderColor: "hsl(var(--b3))",
              color: "hsl(var(--bc))",
            }}
            itemStyle={{ color: "hsl(var(--bc))" }}
          />
          {/* Style legend text */}
          <Legend wrapperStyle={{ color: "hsl(var(--bc))" }} />
          {/* Use groupBy[0] for the name of the scatter points */}
          <Scatter name={groupBy[0]} data={data} fill={getColor(0)} />{" "}
          {/* Color will be updated next */}
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
