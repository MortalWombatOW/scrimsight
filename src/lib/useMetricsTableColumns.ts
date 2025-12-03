import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  PlayerStatsCategoryKeys,
  PlayerStats,
  PlayerStatKey,
  getStatLabel,
  formatStat,
} from "@library";

// Define table columns dynamically based on state
export const useMetricsTableColumns = ( // Renamed to useMetricsTableColumns for clarity
  groupBy: PlayerStatsCategoryKeys[],
  metrics: PlayerStatKey[]
): ColumnDef<PlayerStats>[] => {
  return useMemo(() => {
    const groupCols: ColumnDef<PlayerStats>[] = groupBy.map((key) => ({
      accessorKey: key,
      header: key, // Use string directly for header
      cell: (info) => info.getValue(),
    }));

    const metricCols: ColumnDef<PlayerStats>[] = metrics.map((key) => ({
      accessorKey: key,
      header: getStatLabel(key), // Use string directly for header
      cell: (info) => {
        const value = info.getValue() as number;
        return formatStat(key, value);
      },
    }));

    return [...groupCols, ...metricCols];
  }, [groupBy, metrics]);
};
