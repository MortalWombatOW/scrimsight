import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  useStats,
  PlayerStats,
  PlayerStatsCategoryKeys,
  PlayerStatsNumericalKeys,
} from "../../../atoms/metrics/playerMetricsAtoms";
import { Grouped } from "../../../atoms/metrics/metricUtils";
import { prettyFormat } from "../../../lib/format";
// import { getRoleFromHero } from "../../../lib/hero"; // Keep for potential future use

// Define the shape of the data row for the table
type PlayerTableRow = Grouped<
  PlayerStats,
  PlayerStatsCategoryKeys,
  PlayerStatsNumericalKeys
>;

const columnHelper = createColumnHelper<PlayerTableRow>();

interface TeamPlayersProps {
  // players prop is no longer needed as useStats fetches the players
  teamName: string;
}

export const TeamPlayers = ({ teamName }: TeamPlayersProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Fetch aggregated stats per player for the given team
  const { rows: playerStatsData = [] } = useStats(["playerName"], {
    playerTeam: [teamName],
  });

  // --- Role Calculation (Placeholder/Simplified) ---
  // TODO: Implement robust dominant role calculation if needed.
  // For now, we'll just add a placeholder column.
  // const getPlayerRole = (playerName: string) => { ... };

  const columns = useMemo(
    () => [
      columnHelper.accessor("playerName", {
        header: "Player",
        cell: (info) => (
          <Link
            to={`/players/${info.getValue()}`}
            className="text-primary hover:text-primary-focus"
          >
            {info.getValue()}
          </Link>
        ),
        enableSorting: true,
      }),
      // Placeholder for Role - requires better data/logic
      columnHelper.display({
        id: "role",
        header: "Primary Role",
        cell: () => "TBD", // Placeholder
        enableColumnFilter: true, // Enable filtering on this column later
      }),
      columnHelper.accessor("eliminationsPer10Minutes", {
        header: "Elims / 10 min",
        cell: (info) => prettyFormat(info.getValue()),
        enableSorting: true,
      }),
      columnHelper.accessor("deathsPer10Minutes", {
        header: "Deaths / 10 min",
        cell: (info) => prettyFormat(info.getValue()),
        enableSorting: true,
      }),
      // Add more columns as needed (e.g., Damage/10, Healing/10)
    ],
    []
  );

  const table = useReactTable({
    data: playerStatsData,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // --- Role Filter Component (Placeholder) ---
  // TODO: Implement dropdown/select for role filtering
  const RoleFilter = () => (
    <div className="mb-4">
      <label className="mr-2">Filter by Role:</label>
      <select
        className="select select-bordered select-sm"
        value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn("role")?.setFilterValue(e.target.value || undefined)
        }
      >
        <option value="">All Roles</option>
        <option value="Tank">Tank</option>
        <option value="Damage">Damage</option>
        <option value="Support">Support</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Team Roster</h2>
      {/* <RoleFilter /> */} {/* Add filter component when implemented */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
