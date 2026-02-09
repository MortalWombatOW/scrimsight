import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  TableState,
} from "@tanstack/react-table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  onRowHover?: (row: TData | null) => void;
  hoveredRowId?: string | null;
  getRowId?: (row: TData) => string;
  getRowClassName?: (row: TData) => string;
  initialState?: Partial<TableState>;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  onRowHover,
  hoveredRowId,
  getRowId,
  getRowClassName,
  initialState,
  className = "",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(
    initialState?.sorting || []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState,
  });

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="table table-zebra table-pin-rows table-sm w-full">
        <thead className="bg-base-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className={`sticky top-0 bg-base-200 z-10 cursor-pointer select-none ${
                      header.column.getCanSort() ? "hover:bg-base-300" : ""
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      {{
                        asc: " ↑",
                        desc: " ↓",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="bg-base-100 divide-y divide-base-content/10">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const isHovered =
                hoveredRowId && getRowId
                  ? getRowId(row.original) === hoveredRowId
                  : false;

              return (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)}
                  onMouseEnter={() => onRowHover?.(row.original)}
                  onMouseLeave={() => onRowHover?.(null)}
                  className={`
                  ${
                onRowClick
                  ? "cursor-pointer hover:bg-base-200"
                  : ""
                }
                  ${isHovered ? "!bg-primary/20 hover:!bg-primary/30" : ""}
                  ${getRowClassName ? getRowClassName(row.original) : ""}
                `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
