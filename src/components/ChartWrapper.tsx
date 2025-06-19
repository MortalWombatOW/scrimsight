import { ReactElement } from "react";
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  AreaChart,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Bar,
  Area,
  Pie,
  Cell,
  TooltipProps,
} from "recharts";
import { BarChart3 } from "lucide-react";
import EmptyState from "./EmptyState";

// Chart type definitions
export type ChartType = "line" | "bar" | "area" | "pie";

// Data structure for charts
export interface ChartDataPoint {
  [key: string]: string | number | boolean | null | undefined;
}

// Configuration for chart axes
export interface AxisConfig {
  dataKey?: string;
  label?: string;
  domain?: [number | string, number | string];
  tick?: boolean;
  tickFormatter?: (value: string | number | undefined) => string;
}

// Configuration for chart series
export interface SeriesConfig {
  dataKey: string;
  name?: string;
  color?: string;
  type?: "monotone" | "linear" | "step";
  strokeWidth?: number;
  fill?: string;
  stroke?: string;
}

// Main chart configuration
export interface ChartConfig {
  type: ChartType;
  data: ChartDataPoint[];
  series: SeriesConfig[];
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  colors?: string[];
  height?: number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

// Props for the ChartWrapper component
export interface ChartWrapperProps {
  config: ChartConfig;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  error?: string;
  className?: string;
}

// Default color palette based on DaisyUI theme
const DEFAULT_COLORS = [
  "#ff8f00", // primary - bright green
  "#a855f7", // secondary - purple
  "#4ade80", // accent - green accent
  "#3b82f6", // info - blue
  "#10b981", // success - emerald
  "#f59e0b", // warning - amber
  "#ef4444", // error - red
  "#6b7280", // neutral - gray
];

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<string | number, string | number>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-100 p-3 rounded-lg shadow-lg border border-base-300">
        <p className="text-base-content font-medium">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="loading loading-spinner loading-lg text-primary"></div>
  </div>
);

// Error component
const ErrorDisplay = ({ error }: { error: string }) => (
  <div className="flex items-center justify-center h-64">
    <div className="alert alert-error max-w-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{error}</span>
    </div>
  </div>
);

const ChartWrapper = ({
  config,
  title,
  subtitle,
  loading = false,
  error,
  className = "",
}: ChartWrapperProps) => {
  const {
    type,
    data,
    series,
    xAxis,
    yAxis,
    showGrid = true,
    showTooltip = true,
    showLegend = true,
    colors = DEFAULT_COLORS,
    height = 400,
    margin = { top: 20, right: 30, left: 20, bottom: 5 },
  } = config;

  // Handle loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Handle error state
  if (error) {
    return <ErrorDisplay error={error} />;
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No data available"
        description="Please provide data to display the chart"
        size="md"
      />
    );
  }

  // Render chart based on type
  const renderChart = (): ReactElement => {
    const commonProps = {
      data,
      margin,
    };

    switch (type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-base-300"
              />
            )}
            {xAxis && xAxis.dataKey && (
              <XAxis
                dataKey={xAxis.dataKey}
                domain={xAxis.domain}
                tick={xAxis.tick}
                tickFormatter={xAxis.tickFormatter}
                className="text-base-content/70"
              />
            )}
            {yAxis && (
              <YAxis
                domain={yAxis.domain}
                tick={yAxis.tick}
                tickFormatter={yAxis.tickFormatter}
                className="text-base-content/70"
              />
            )}
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend className="text-base-content" />}
            {series.map((s, index) => (
              <Line
                key={s.dataKey}
                type={s.type || "monotone"}
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.stroke || colors[index % colors.length]}
                strokeWidth={s.strokeWidth || 2}
                dot={{ fill: s.stroke || colors[index % colors.length] }}
              />
            ))}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-base-300"
              />
            )}
            {xAxis && xAxis.dataKey && (
              <XAxis
                dataKey={xAxis.dataKey}
                domain={xAxis.domain}
                tick={xAxis.tick}
                tickFormatter={xAxis.tickFormatter}
                className="text-base-content/70"
              />
            )}
            {yAxis && (
              <YAxis
                domain={yAxis.domain}
                tick={yAxis.tick}
                tickFormatter={yAxis.tickFormatter}
                className="text-base-content/70"
              />
            )}
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend className="text-base-content" />}
            {series.map((s, index) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name}
                fill={s.fill || colors[index % colors.length]}
              />
            ))}
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-base-300"
              />
            )}
            {xAxis && xAxis.dataKey && (
              <XAxis
                dataKey={xAxis.dataKey}
                domain={xAxis.domain}
                tick={xAxis.tick}
                tickFormatter={xAxis.tickFormatter}
                className="text-base-content/70"
              />
            )}
            {yAxis && (
              <YAxis
                domain={yAxis.domain}
                tick={yAxis.tick}
                tickFormatter={yAxis.tickFormatter}
                className="text-base-content/70"
              />
            )}
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend className="text-base-content" />}
            {series.map((s, index) => (
              <Area
                key={s.dataKey}
                type={s.type || "monotone"}
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.stroke || colors[index % colors.length]}
                fill={s.fill || colors[index % colors.length]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );

      case "pie":
        return (
          <PieChart {...commonProps}>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend className="text-base-content" />}
            <Pie
              data={data}
              dataKey={series[0]?.dataKey || "value"}
              nameKey={xAxis?.dataKey || "name"}
              cx="50%"
              cy="50%"
              outerRadius={Math.min(height * 0.3, 120)}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        );

      default:
        return (
          <div className="text-error">Unsupported chart type: {type}</div>
        ) as ReactElement;
    }
  };

  return (
    <div className={`bg-base-100 rounded-lg p-6 ${className}`}>
      {/* Chart Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-xl font-semibold text-base-content mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-base-content/70">{subtitle}</p>
          )}
        </div>
      )}

      {/* Chart Container */}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartWrapper;
