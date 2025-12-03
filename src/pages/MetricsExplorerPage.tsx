import React, { useState, useMemo } from "react";
import { useAtomValue } from "jotai";
import { Container, VisualCard } from "@components";
import { useStats } from "@library";
import {
  uniqueCategoryValues,
  PlayerStatsCategoryKeys,
  PlayerStatKey,
  getStatLabel,
} from "@library";
import { useMetricsTableColumns, formatStat } from "@library";
import { MetricsDataTable, MetricsChart, MetricsControls } from "@components";

export const MetricsExplorerPage: React.FC = () => {
  const [groupBy, setGroupBy] = useState<PlayerStatsCategoryKeys[]>([
    "playerName",
  ]);
  const [metrics, setMetrics] = useState<PlayerStatKey[]>([
    "eliminations",
    "deaths",
    "heroDamageDealt",
  ]);
  const [filters, setFilters] = useState<
    Record<PlayerStatsCategoryKeys, string[]> | undefined
  >(undefined);
  const [sortBy, setSortBy] = useState<
    PlayerStatsCategoryKeys | PlayerStatKey | undefined
  >(undefined);
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >(undefined);

  const statsData = useStats(groupBy, filters, sortBy, sortDirection);
  const uniqueValues = useAtomValue(uniqueCategoryValues.atom);
  const tableColumns = useMetricsTableColumns(groupBy, metrics);

  const [expandedFilters, setExpandedFilters] = useState<
    Set<PlayerStatsCategoryKeys>
  >(new Set());

  const handleFilterChange = (
    key: PlayerStatsCategoryKeys,
    selectedOptions: readonly { value: string; label: string }[] | null
  ) => {
    setFilters((prevFilters) => {
      const currentFilters = prevFilters ?? {};
      let updatedFilters: Partial<Record<PlayerStatsCategoryKeys, string[]>> = {
        ...currentFilters,
      };

      if (selectedOptions && selectedOptions.length > 0) {
        updatedFilters[key] = selectedOptions.map((option) => option.value);
      } else {
        if (key in updatedFilters) {
          delete updatedFilters[key];
        }
      }

      if (Object.keys(updatedFilters).length === 0) {
        return undefined;
      } else {
        return updatedFilters as Record<PlayerStatsCategoryKeys, string[]>;
      }
    });
  };

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

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (!statsData.rows || statsData.rows.length === 0) return null;

    const totals = metrics.map((metric) => {
      const values = statsData.rows.map((row) => (row as any)[metric] || 0);
      const total = values.reduce((sum, val) => sum + val, 0);
      const avg = total / values.length;
      const max = Math.max(...values);
      
      return { metric, total, avg, max };
    });

    return totals;
  }, [statsData.rows, metrics]);

  // State for row hover interaction
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  // Helper to generate a unique ID for a row based on grouping keys
  const getRowId = (row: any, groupKeys: PlayerStatsCategoryKeys[]) => {
    return groupKeys.map((key) => row[key]).join("-");
  };

  return (
    <Container>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Metrics Explorer</h1>
            <p className="text-base-content/70 mt-1">
              Analyze and compare player performance across all metrics
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        {summaryStats && summaryStats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summaryStats.map(({ metric, total, avg, max }) => (
              <VisualCard
                key={metric}
                title={getStatLabel(metric)}
                className="min-h-[120px]"
              >
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xs text-base-content/60 mb-1">Total</div>
                    <div className="text-lg font-bold text-white">
                      {formatStat(metric, total)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-base-content/60 mb-1">Avg</div>
                    <div className="text-lg font-bold text-primary">
                      {formatStat(metric, avg)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-base-content/60 mb-1">Max</div>
                    <div className="text-lg font-bold text-secondary">
                      {formatStat(metric, max)}
                    </div>
                  </div>
                </div>
              </VisualCard>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Filters & Options</h2>
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
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />
        </div>

        {/* Data Visualization */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Table View */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Data Table</h2>
            <div className="overflow-auto max-h-[600px]">
              <MetricsDataTable
                data={statsData.rows ?? []}
                columns={tableColumns}
                onRowHover={setHoveredRowId}
                getRowId={(row) => getRowId(row, groupBy)}
                hoveredRowId={hoveredRowId}
              />
            </div>
          </div>

          {/* Chart View */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Visual Comparison</h2>
            <div className="h-[500px]">
              <MetricsChart
                data={statsData.rows ?? []}
                groupBy={groupBy}
                metrics={metrics}
                hoveredRowId={hoveredRowId}
                getRowId={(row) => getRowId(row, groupBy)}
                onPointHover={setHoveredRowId}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MetricsExplorerPage;
