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
  ScatterChart,
  Scatter,
  Label,
  Cell,
} from "recharts";
import {
  PlayerStatsCategoryKeys,
} from "@atoms";
import { getColor, formatStat, PlayerStatKey, getStatLabel } from "@library";

const CustomTooltip = ({ active, payload, groupBy }: any) => {
  if (active && payload && payload.length) {
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

interface MetricsBarChartProps extends MetricsChartProps {
  metricKey: PlayerStatKey;
}

const MetricsBarChart: React.FC<MetricsBarChartProps> = ({
  data,
  groupBy,
  metricKey,
  hoveredRowId,
  getRowId,
  onPointHover,
}) => {
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
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-base-200)",
            border: "1px solid var(--color-base-300)",
            color: "var(--color-base-content)",
          }}
          itemStyle={{ color: "var(--color-base-content)" }}
          cursor={{ fill: "var(--color-primary)", opacity: 0.1 }}
        />
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
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

interface MetricsScatterChartProps extends MetricsChartProps {
  xMetric: PlayerStatKey;
  yMetric: PlayerStatKey;
}

const MetricsScatterChart: React.FC<MetricsScatterChartProps> = ({
  data,
  groupBy,
  xMetric,
  yMetric,
  hoveredRowId,
  getRowId,
  onPointHover,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{ top: 20, right: 20, bottom: 25, left: 25 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-content)" opacity={0.1} />
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
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={<CustomTooltip groupBy={groupBy} />}
        />
        <Legend wrapperStyle={{ color: "var(--color-base-content)", paddingTop: "20px" }} />
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
};

export const MetricsChart: React.FC<MetricsChartProps> = ({
  data,
  groupBy,
  metrics,
  hoveredRowId,
  getRowId,
  onPointHover,
}) => {
  if (!data || data.length === 0 || groupBy.length === 0) {
    return (
      <p className="text-center italic h-full flex items-center justify-center">
        Select at least one 'Group By' dimension and ensure data is available.
      </p>
    );
  }

  if (metrics.length === 1) {
    return (
      <MetricsBarChart
        data={data}
        groupBy={groupBy}
        metrics={metrics}
        metricKey={metrics[0]}
        hoveredRowId={hoveredRowId}
        getRowId={getRowId}
        onPointHover={onPointHover}
      />
    );
  }

  if (metrics.length === 2) {
    return (
      <MetricsScatterChart
        data={data}
        groupBy={groupBy}
        metrics={metrics}
        xMetric={metrics[0]}
        yMetric={metrics[1]}
        hoveredRowId={hoveredRowId}
        getRowId={getRowId}
        onPointHover={onPointHover}
      />
    );
  }

  return (
    <p className="text-center italic h-full flex items-center justify-center">
      Please select exactly 1 or 2 metrics to display a chart.
    </p>
  );
};
