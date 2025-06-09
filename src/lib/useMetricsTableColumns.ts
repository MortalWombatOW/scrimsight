import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  PlayerStatsCategoryKeys,
  PlayerStatsNumericalKeys,
  PlayerStats,
} from "@library";

// Define table columns dynamically based on state
export const useMetricsTableColumns = ( // Renamed to useMetricsTableColumns for clarity
  groupBy: PlayerStatsCategoryKeys[],
  metrics: PlayerStatsNumericalKeys[]
): ColumnDef<PlayerStats>[] => {
  return useMemo(() => {
    const groupCols: ColumnDef<PlayerStats>[] = groupBy.map((key) => ({
      accessorKey: key,
      header: key, // Use string directly for header
      cell: (info) => info.getValue(),
    }));

    const metricCols: ColumnDef<PlayerStats>[] = metrics.map((key) => ({
      accessorKey: key,
      header: key, // Use string directly for header
      cell: (info) => {
        const value = info.getValue();
        // Format numbers nicely (e.g., 2 decimal places)
        return typeof value === "number" ? value.toFixed(2) : value;
      },
    }));

    return [...groupCols, ...metricCols];
  }, [groupBy, metrics]);
};
