import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams
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
import { ErrorMessage } from "../../../components/Common/ErrorMessage"; // Import ErrorMessage
// import { getRoleFromHero } from "../../../lib/hero";

type PlayerTableRow = Grouped<
  PlayerStats,
  PlayerStatsCategoryKeys,
  PlayerStatsNumericalKeys
>;

const columnHelper = createColumnHelper<PlayerTableRow>();

// Removed TeamPlayersProps interface

export const TeamPlayers = () => {
  const { teamId } = useParams<{ teamId: string }>(); // Get teamId from URL
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  if (!teamId) {
    // Handle case where teamId is not available
    return <ErrorMessage message="Team ID not found in URL." />;
  }

  // Fetch aggregated stats per player for the given team using teamId
  const { rows: playerStatsData = [] } = useStats(["playerName"], {
    playerTeam: [teamId],
  });

  // --- Role Calculation (Placeholder/Simplified) ---
  // TODO: Implement robust dominant role calculation if needed.
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
