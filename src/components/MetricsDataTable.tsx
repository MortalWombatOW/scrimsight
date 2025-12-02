import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

// Reusable Table component specifically for Metrics Explorer (or could be made more generic)
interface MetricsDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  onRowHover?: (id: string | null) => void;
  getRowId?: (row: TData) => string;
  hoveredRowId?: string | null;
}

export function MetricsDataTable<TData>({
  data,
  columns,
  onRowHover,
  getRowId,
  hoveredRowId,
}: MetricsDataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="table table-zebra table-pin-rows table-pin-cols table-sm w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="sticky top-0 bg-base-200 z-10">
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
          <tr
            key={row.id}
            onMouseEnter={() => {
              if (onRowHover && getRowId) {
                onRowHover(getRowId(row.original));
              }
            }}
            onMouseLeave={() => {
              if (onRowHover) {
                onRowHover(null);
              }
            }}
            className={`transition-colors duration-150 ${
              hoveredRowId && getRowId && getRowId(row.original) === hoveredRowId
                ? "!bg-primary/20 hover:!bg-primary/30"
                : "hover:bg-base-300/50"
            }`}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
