import React, { useState, useMemo } from "react";
import { Page, Card } from "@components";
import {
  PlayerStatsCategoryKeys,
  getStatLabel,
} from "@library";
import { useMetricsTableColumns } from "@library";
import { MetricsChart, MetricsControls, StatDistributionCard } from "@components";
import { DataTable } from "../components/table/DataTable";
import { useMatches } from "../hooks/useRepository";
import { useStatsGrouped } from "../hooks/useStatsGrouped";
import { StatsFilters } from "../hooks/useStats";
import { useMetricsUrlState } from "../hooks/useMetricsUrlState";

export const MetricsExplorerPage: React.FC = () => {
  const {
    groupBy,
    setGroupBy,
    metrics,
    setMetrics,
    filters,
    handleFilterChange,
  } = useMetricsUrlState();

  const statsFilters = useMemo<StatsFilters | undefined>(() => {
    if (!filters) return undefined;

    const converted: StatsFilters = {};
    if (filters.matchId?.length) converted.matchId = filters.matchId[0];
    if (filters.playerName?.length) converted.playerName = filters.playerName[0];
    if (filters.playerTeam?.length) converted.team = filters.playerTeam[0];
    if (filters.playerRole?.length) converted.role = filters.playerRole[0];
    if (filters.playerHero?.length) converted.hero = filters.playerHero[0];

    return Object.keys(converted).length > 0 ? converted : undefined;
  }, [filters]);

  const statsData = useStatsGrouped(groupBy, statsFilters);

  const matches = useMatches();
  const uniqueValues = useMemo(() => {
    const values: Record<PlayerStatsCategoryKeys, Set<string>> = {
      matchId: new Set(),
      roundNumber: new Set(),
      playerTeam: new Set(),
      playerName: new Set(),
      playerHero: new Set(),
      playerRole: new Set(),
    };

    for (const match of matches) {
      for (const stat of match.playerStats.rows) {
        values.matchId.add(stat.matchId);
        values.roundNumber.add(stat.roundNumber);
        values.playerTeam.add(stat.playerTeam);
        values.playerName.add(stat.playerName);
        values.playerHero.add(stat.playerHero);
        values.playerRole.add(stat.playerRole);
      }
    }

    return {
      matchId: Array.from(values.matchId),
      roundNumber: Array.from(values.roundNumber),
      playerTeam: Array.from(values.playerTeam),
      playerName: Array.from(values.playerName),
      playerHero: Array.from(values.playerHero),
      playerRole: Array.from(values.playerRole),
    };
  }, [matches]);
  const tableColumns = useMetricsTableColumns(groupBy, metrics);

  const [expandedFilters, setExpandedFilters] = useState<
    Set<PlayerStatsCategoryKeys>
  >(new Set());

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
      const values = statsData.rows.map((row) => (row as Record<string, string | number>)[metric] as number || 0);
      return { metric, values };
    });

    return totals;
  }, [statsData.rows, metrics]);

  // State for row hover interaction
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  // Helper to generate a unique ID for a row based on grouping keys
  const getRowId = (row: Record<string, unknown>, groupKeys: PlayerStatsCategoryKeys[]) => {
    return groupKeys.map((key) => row[key]).join("-");
  };

  return (
    <Page>
      <Page.Header
        title="Metrics Explorer"
        subtitle="Analyze and compare player performance across all metrics"
      />

      <Page.Content>
        {/* Summary Cards */}
        {summaryStats && summaryStats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summaryStats.map(({ metric, values }) => (
              <StatDistributionCard
                key={metric}
                title={getStatLabel(metric)}
                data={values}
                metricKey={metric}
                className="min-h-[200px]"
              />
            ))}
          </div>
        )}

        {/* Main Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar Controls */}
          <Card variant="glass" className="w-full lg:w-80 flex-shrink-0 overflow-y-auto p-4 h-full">
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
            />
          </Card>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
            {/* Chart View - Only visible when 1 or 2 metrics are selected */}
            {metrics.length >= 1 && metrics.length <= 2 && (
              <Card variant="glass" className="p-6 flex-shrink-0 h-[400px]">
                <div className="h-full w-full">
                  <MetricsChart
                    data={statsData.rows ?? []}
                    groupBy={groupBy}
                    metrics={metrics}
                    hoveredRowId={hoveredRowId}
                    getRowId={(row) => getRowId(row, groupBy)}
                    onPointHover={setHoveredRowId}
                  />
                </div>
              </Card>
            )}

            {/* Table View */}
            <Card variant="glass" className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-auto p-0">
                <DataTable
                  data={statsData.rows ?? []}
                  columns={tableColumns}
                  onRowHover={(row) =>
                    setHoveredRowId(row ? getRowId(row, groupBy) : null)
                  }
                  getRowId={(row) => getRowId(row, groupBy)}
                  hoveredRowId={hoveredRowId}
                  className="h-full"
                />
              </div>
            </Card>
          </div>
        </div>
      </Page.Content>
    </Page>
  );
};

export default MetricsExplorerPage;
