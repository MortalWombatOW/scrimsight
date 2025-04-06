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
} from "recharts";
import {
  PlayerStatsCategoryKeys,
  PlayerStatsNumericalKeys,
} from "~/atoms/metrics/playerMetricsAtoms";
import { getColor } from "../utils/metricExplorerStyles"; // Import color function

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
    // Render Bar Chart for 1 metric
    const metricKey = metrics[0];
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }} // Adjusted margin for label
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={groupBy[0]}>
            <Label value={groupBy[0]} offset={-15} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label
              value={metricKey}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <Tooltip />
          <Legend />
          <Bar dataKey={metricKey} fill={getColor(0)} />
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
          <CartesianGrid />
          <XAxis type="number" dataKey={xMetric} name={xMetric}>
            <Label value={xMetric} offset={-15} position="insideBottom" />
          </XAxis>
          <YAxis type="number" dataKey={yMetric} name={yMetric}>
            <Label
              value={yMetric}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          {/* Use groupBy[0] for the name of the scatter points */}
          <Scatter name={groupBy[0]} data={data} fill={getColor(0)} />
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
