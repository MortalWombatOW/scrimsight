import { useMemo } from "react";
import ChartWrapper, { ChartConfig } from "./ChartWrapper";
import ValueDelta from "./ValueDelta";
import { prettyFormat } from "../lib/format";
import { computeDeciles, smoothDistribution } from "../lib/distribution";

interface StatDistributionRow {
  category: string;
  value: number;
}

interface StatDistributionAndTopProps {
  statName: string;
  statValue: number;
  statDescription: string;
  rows: StatDistributionRow[];
  higherIsBetter?: boolean;
  precision?: number;
}

const StatDistributionAndTop = ({
  statName,
  statValue,
  statDescription,
  rows,
  higherIsBetter = true,
  precision = 1,
}: StatDistributionAndTopProps) => {
  const chartConfig: ChartConfig = useMemo(() => {
    const values = rows.map((row) => row.value);
    const deciles = computeDeciles(values);
    const smoothedData = smoothDistribution(deciles, 2);

    return {
      type: "area",
      data: smoothedData.map((point) => ({
        value: point.value,
        frequency: point.frequency,
      })),
      series: [
        {
          dataKey: "frequency",
          name: "Distribution",
          fill: "#ff8f0044",
          stroke: "#ff8f00",
          type: "monotone",
        },
      ],
      xAxis: {
        dataKey: "value",
        tickFormatter: (value) => prettyFormat(Number(value), precision),
      },
      yAxis: {
        tickFormatter: (value) => `${(Number(value) * 100).toFixed(0)}%`,
      },
      height: 200,
      showLegend: false,
      showGrid: false,
      margin: { top: 10, right: 10, left: 10, bottom: 20 },
    };
  }, [rows, precision]);

  const topThreeRows = useMemo(() => {
    return [...rows].sort((a, b) => b.value - a.value).slice(0, 3);
  }, [rows]);

  return (
    <div className="bg-base-100 rounded-lg p-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-base-content">{statName}</h3>
        <p className="text-sm text-base-content/70">{statDescription}</p>

        <div className="mt-4 text-center mt-6 mb-6">
          <div className="text-3xl font-bold text-base-content">
            {prettyFormat(statValue, precision)}
          </div>
        </div>
      </div>

      <ChartWrapper config={chartConfig} className="mr-12" />

      <div>
        <div className="space-y-3">
          {topThreeRows.map((row, index) => (
            <div
              key={row.category}
              className="flex items-center justify-between bg-base-200 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-semibold leading-none">
                  {index + 1}
                </div>
                <span className="font-medium text-base-content">
                  {row.category}
                </span>
              </div>
              <ValueDelta
                value={row.value}
                baseline={statValue}
                higherIsBetter={higherIsBetter}
                precision={precision}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatDistributionAndTop;
