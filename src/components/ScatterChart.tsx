import { useMemo } from "react";
import {
  ResponsiveContainer,
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import EmptyState from "./EmptyState";
import LoadingSpinner from "./LoadingSpinner";

export interface ScatterDataPoint {
  x: number;
  y: number;
  playerName: string;
  playerTeam: string;
  [key: string]: any;
}

export interface ScatterChartConfig {
  data: ScatterDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  colorFunction?: (teamName: string) => string;
  height?: number;
  margin?: object;
  loading?: boolean;
  error?: string | null;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: any;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded-lg shadow-lg">
        <p className="font-semibold text-base-content">{data.playerName}</p>
        <p className="text-sm text-base-content/70">{data.playerTeam}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm">
            <span className="text-base-content/70">X:</span>{" "}
            <span className="font-medium">{data.x.toFixed(1)}</span>
          </p>
          <p className="text-sm">
            <span className="text-base-content/70">Y:</span>{" "}
            <span className="font-medium">{data.y.toFixed(1)}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const ScatterChart = ({
  data,
  xAxisLabel = "X Axis",
  yAxisLabel = "Y Axis",
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  colorFunction,
  height = 400,
  margin = { top: 20, right: 30, bottom: 40, left: 40 },
  loading = false,
  error = null,
}: ScatterChartConfig) => {
  // Group data by team for multiple scatter series
  const scatterSeries = useMemo(() => {
    if (!data.length) return [];

    const teamGroups = data.reduce((acc, point) => {
      if (!acc[point.playerTeam]) {
        acc[point.playerTeam] = [];
      }
      acc[point.playerTeam].push(point);
      return acc;
    }, {} as Record<string, ScatterDataPoint[]>);

    return Object.entries(teamGroups).map(([teamName, points]) => ({
      teamName,
      data: points,
      color: colorFunction ? colorFunction(teamName) : "#8884d8",
    }));
  }, [data, colorFunction]);

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ height }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center" style={{ height }}>
        <div className="alert alert-error max-w-md">
          <AlertTriangle className="w-6 h-6" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div style={{ height }}>
        <EmptyState
          icon={AlertTriangle}
          title="No Data"
          description="No data available to display"
          size="sm"
        />
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsScatterChart margin={margin}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-base-300"
            />
          )}
          <XAxis
            type="number"
            dataKey="x"
            name={xAxisLabel}
            label={{
              value: xAxisLabel,
              position: "bottom",
              offset: -10,
              className: "fill-base-content text-sm",
            }}
            className="text-base-content"
            tickFormatter={(value) => value.toFixed(0)}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yAxisLabel}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "outside",
              className: "fill-base-content text-sm",
            }}
            className="text-base-content"
            tickFormatter={(value) => value.toFixed(0)}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                color: "hsl(var(--bc))",
              }}
            />
          )}
          {scatterSeries.map((series) => (
            <Scatter
              key={series.teamName}
              name={series.teamName}
              data={series.data}
              fill={series.color}
              strokeWidth={2}
              stroke={series.color}
              r={6}
            />
          ))}
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterChart;