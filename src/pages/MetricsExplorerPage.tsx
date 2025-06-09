import React, { useState } from "react"; // Removed useMemo
import { useAtomValue } from "jotai";
// Removed unused imports: @tanstack/react-table, recharts, react-select
import { Container } from "@components";
import { useStats } from "@library";
import {
  uniqueCategoryValues,
  PlayerStatsCategoryKeys, // Keep this type
  PlayerStatsNumericalKeys, // Keep this type
  // Removed playerStatsCategoryKeys array import
  // Removed playerStatsNumericalKeys array import
} from "@library";
// Removed customSelectStyles import
import { useMetricsTableColumns } from "@library";
import { MetricsDataTable, MetricsChart, MetricsControls } from "@components"; // Import the new controls component

export const MetricsExplorerPage: React.FC = () => {
  // State for user selections (will be expanded)
  const [groupBy, setGroupBy] = useState<PlayerStatsCategoryKeys[]>([
    "playerName",
  ]);
  const [metrics, setMetrics] = useState<PlayerStatsNumericalKeys[]>([
    "eliminations",
    "deaths",
    "heroDamageDealt",
  ]);
  const [filters, setFilters] = useState<
    Record<PlayerStatsCategoryKeys, string[]> | undefined
  >(undefined);
  // Update sortBy state type to allow category keys as well
  const [sortBy, setSortBy] = useState<
    PlayerStatsCategoryKeys | PlayerStatsNumericalKeys | undefined
  >(undefined);
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >(undefined);

  // Fetch data using the hook
  const statsData = useStats(groupBy, filters, sortBy, sortDirection);

  // Fetch unique values for potential filters
  const uniqueValues = useAtomValue(uniqueCategoryValues.atom);

  // Define table columns using the imported hook
  const tableColumns = useMetricsTableColumns(groupBy, metrics);

  // State to track expanded filters
  const [expandedFilters, setExpandedFilters] = useState<
    Set<PlayerStatsCategoryKeys>
  >(new Set());

  // Removed unused groupByOptions and metricsOptions

  // Handler for updating filters
  const handleFilterChange = (
    key: PlayerStatsCategoryKeys,
    selectedOptions: readonly { value: string; label: string }[] | null
  ) => {
    setFilters((prevFilters) => {
      const currentFilters = prevFilters ?? {};
      let updatedFilters: Partial<Record<PlayerStatsCategoryKeys, string[]>> = {
        ...currentFilters,
      }; // Start with a partial copy

      if (selectedOptions && selectedOptions.length > 0) {
        // Add or update the filter
        updatedFilters[key] = selectedOptions.map((option) => option.value);
      } else {
        // Remove the filter key if it exists
        if (key in updatedFilters) {
          delete updatedFilters[key];
        }
      }

      // Check if the resulting object is empty
      if (Object.keys(updatedFilters).length === 0) {
        return undefined; // Return undefined if empty
      } else {
        // Cast back to the full Record type if not empty
        return updatedFilters as Record<PlayerStatsCategoryKeys, string[]>;
      }
    });
  };

  // Toggle filter expansion
  const toggleFilterExpansion = (key: PlayerStatsCategoryKeys) => {
    setExpandedFilters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // TODO: Implement Controls UI for Sorting, Chart Type

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Metrics Explorer</h1>
      <div className="flex flex-col gap-4">
        {/* Use the extracted Controls Component */}
        <MetricsControls
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          metrics={metrics}
          setMetrics={setMetrics}
          filters={filters}
          handleFilterChange={handleFilterChange}
          expandedFilters={expandedFilters}
          toggleFilterExpansion={toggleFilterExpansion}
          uniqueValues={uniqueValues}
          // Removed customSelectStyles prop
          // Pass sorting state and setters
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />

        {/* Data Display Section */}
        <div className="flex flex-row gap-4">
          {/* Table View */}
          <div className="flex-1 p-4 border border-gray-700 rounded bg-base-100">
            <h2 className="text-lg font-semibold mb-2">Table View</h2>
            <div className="overflow-auto max-h-[600px]">
              {" "}
              {/* Added scroll */}
              {/* Use the imported MetricsDataTable component */}
              <MetricsDataTable
                data={statsData.rows ?? []}
                columns={tableColumns}
              />
            </div>
          </div>

          {/* Chart View */}
          <div className="flex-1 p-4 border border-gray-700 rounded bg-base-100 h-[400px]">
            <h2 className="text-lg font-semibold mb-2">Chart View</h2>
            {/* Use the imported MetricsChart component */}
            <MetricsChart
              data={statsData.rows ?? []}
              groupBy={groupBy}
              metrics={metrics}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MetricsExplorerPage;
