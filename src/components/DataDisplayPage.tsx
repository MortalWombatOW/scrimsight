import React from "react";
import { useAtomValue, Atom } from "jotai";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export interface DataDisplayPageProps<TData, TChart> {
  /** Page title displayed above table and chart */
  title: string;
  /** Jotai atom that returns an array of table rows */
  tableAtom: Atom<TData[]>;
  /** Column definitions for tanstack table */
  tableColumns: ColumnDef<TData, any>[];
  /** Optional Jotai atom that returns an array of chart data points */
  chartAtom?: Atom<TChart[]>;
  /** Configuration for the recharts LineChart */
  chartConfig?: {
    /** Key in data for X axis */
    xKey: keyof TChart;
    /** Lines to render, specifying dataKey, optional color and legend name */
    lines: Array<{ dataKey: keyof TChart; color?: string; name?: string }>;
  };
}

/**
 * A generic page component that renders a data table (tanstack) and an optional line chart (recharts).
 * Wrap this in a React.Suspense boundary when used with async atoms.
 */
export function DataDisplayPage<TData, TChart>(
  props: DataDisplayPageProps<TData, TChart>
) {
  const { title, tableAtom, tableColumns, chartAtom, chartConfig } = props;
  // Read table data from Jotai atom
  const tableData = useAtomValue(tableAtom);
  // Read chart data if provided
  const chartData =
    chartAtom && chartConfig ? useAtomValue(chartAtom) : undefined;

  // Set up tanstack table instance
  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-semibold">{title}</h1>

      {/* Data Table */}
      <div className="overflow-x-auto bg-base-100 dark:bg-base-800 shadow rounded">
        <table className="table table-zebra w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-sm font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional Line Chart */}
      {chartConfig && chartData && (
        <div className="bg-base-100 dark:bg-base-800 shadow rounded p-4">
          <h2 className="text-2xl font-semibold mb-4">{title} Trends</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={String(chartConfig.xKey)} stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Legend />
              {chartConfig.lines.map((line, idx) => (
                <Bar
                  key={idx}
                  type="monotone"
                  dataKey={String(line.dataKey)}
                  name={line.name}
                  stroke={line.color || "#8884d8"}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
