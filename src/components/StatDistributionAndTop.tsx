import { useMemo } from "react";
import ChartWrapper, { ChartConfig } from "./ChartWrapper";
import ValueDelta from "./ValueDelta";
import DataTable from "./DataTable";
import { prettyFormat } from "../lib/format";
import { computeDeciles, smoothDistribution } from "../lib/distribution";
import * as R from "remeda";
import { ColumnDef } from "@tanstack/react-table";

interface StatDistributionRow {
  [category: string]: string | number;
  value: number;
}

interface StatDistributionAndTopProps {
  statName: string;
  statDescription: string;
  categoryKeys: string[];
  rows: StatDistributionRow[];
  higherIsBetter?: boolean;
  precision?: number;
}

const StatDistributionAndTop = ({
  statName,
  statDescription,
  categoryKeys,
  rows,
  higherIsBetter = true,
  precision = 1,
}: StatDistributionAndTopProps) => {
  const chartConfig: ChartConfig = useMemo(() => {
    const values = rows.map((row) => row.value);
    const deciles = computeDeciles(values);
    const smoothedData = smoothDistribution(deciles, 0);
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
      height: 100,
      showLegend: false,
      showGrid: false,
      margin: { top: 10, right: 10, left: 10, bottom: 20 },
    };
  }, [rows, precision]);

  const topThreeRows = useMemo(() => {
    return [...rows].sort((a, b) => b.value - a.value).slice(0, 3);
  }, [rows]);

  const statValue = R.meanBy(rows, (row) => row.value);

  const columns: ColumnDef<StatDistributionRow>[] = useMemo(() => {
    const categoryColumns = categoryKeys.map((key) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
    }));

    return [
      {
        id: "rank",
        header: "#",
        cell: ({ row }) => (
          <span className="font-mono text-lg">{row.index + 1}</span>
        ),
      },
      ...categoryColumns,
      {
        id: "delta",
        header: "vs Average",
        cell: ({ row }) => (
          <ValueDelta
            value={row.original.value}
            baseline={statValue}
            higherIsBetter={higherIsBetter}
            precision={precision}
          />
        ),
      },
    ];
  }, [categoryKeys, precision, statValue, higherIsBetter]);

  return (
    <div className="bg-base-100 rounded-lg p-6 min-w-fit">
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

      <DataTable
        columns={columns}
        data={topThreeRows}
        rowKey={(row) => categoryKeys.map((key) => row[key]).join("-")}
        disableSorting={true}
        hideFooter={true}
      />
    </div>
  );
};

export default StatDistributionAndTop;
