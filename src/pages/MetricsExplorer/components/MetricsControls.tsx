import React from "react";
import Select, { MultiValue } from "react-select"; // Removed StylesConfig
import {
  PlayerStatsCategoryKeys,
  PlayerStatsNumericalKeys,
  playerStatsCategoryKeys,
  playerStatsNumericalKeys,
} from "~/atoms/metrics/playerMetricsAtoms";
// Import specific style objects
import {
  groupBySelectStyles,
  metricsSelectStyles,
  sortBySelectStyles,
  sortDirectionSelectStyles,
  filterSelectStyles,
} from "../utils/metricExplorerStyles";

// Define option type for react-select
type OptionType = { value: string; label: string };

// Define specific option types for clarity
type GroupByOptionType = { value: PlayerStatsCategoryKeys; label: string };
type MetricsOptionType = { value: PlayerStatsNumericalKeys; label: string };
type SortByOptionType = {
  value: PlayerStatsCategoryKeys | PlayerStatsNumericalKeys;
  label: string;
};
type SortDirectionOptionType = { value: "asc" | "desc"; label: string };

interface MetricsControlsProps {
  groupBy: PlayerStatsCategoryKeys[];
  setGroupBy: (value: PlayerStatsCategoryKeys[]) => void;
  metrics: PlayerStatsNumericalKeys[];
  setMetrics: (value: PlayerStatsNumericalKeys[]) => void;
  filters: Record<PlayerStatsCategoryKeys, string[]> | undefined;
  handleFilterChange: (
    key: PlayerStatsCategoryKeys,
    selectedOptions: readonly OptionType[] | null
  ) => void;
  expandedFilters: Set<PlayerStatsCategoryKeys>;
  toggleFilterExpansion: (key: PlayerStatsCategoryKeys) => void;
  uniqueValues: Record<PlayerStatsCategoryKeys, string[]> | undefined;
  // Removed customSelectStyles prop
  sortBy: PlayerStatsNumericalKeys | PlayerStatsCategoryKeys | undefined;
  setSortBy: (
    value: PlayerStatsNumericalKeys | PlayerStatsCategoryKeys | undefined
  ) => void;
  sortDirection: "asc" | "desc" | undefined;
  setSortDirection: (value: "asc" | "desc" | undefined) => void;
}

export const MetricsControls: React.FC<MetricsControlsProps> = ({
  groupBy,
  setGroupBy,
  metrics,
  setMetrics,
  filters,
  handleFilterChange,
  expandedFilters,
  toggleFilterExpansion,
  uniqueValues,
  // Removed customSelectStyles prop from destructuring
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
}) => {
  // Prepare options for react-select controls
  const groupByOptions: GroupByOptionType[] = playerStatsCategoryKeys.map(
    (key) => ({
      value: key,
      label: key,
    })
  );
  const metricsOptions: MetricsOptionType[] = playerStatsNumericalKeys.map(
    (key) => ({
      value: key,
      label: key,
    })
  );

  // Combine group and metric keys for sorting options
  const sortableColumns: (
    | PlayerStatsCategoryKeys
    | PlayerStatsNumericalKeys
  )[] = [...playerStatsCategoryKeys, ...playerStatsNumericalKeys];
  const sortByOptions: SortByOptionType[] = sortableColumns.map((key) => ({
    value: key,
    label: key,
  }));

  return (
    <div className="p-4 border border-gray-700 rounded bg-base-200 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Group By Select */}
      <div>
        <label
          htmlFor="groupBySelect"
          className="block text-sm font-medium mb-1"
        >
          Group By
        </label>
        <Select<GroupByOptionType, true>
          id="groupBySelect"
          isMulti
          options={groupByOptions}
          value={groupByOptions.filter((option) =>
            groupBy.includes(option.value)
          )}
          onChange={(selectedOptions: MultiValue<GroupByOptionType>) => {
            setGroupBy((selectedOptions || []).map((option) => option.value));
          }}
          styles={groupBySelectStyles} // Apply specific style
          classNamePrefix="react-select"
        />
      </div>
      {/* Metrics Select */}
      <div>
        <label
          htmlFor="metricsSelect"
          className="block text-sm font-medium mb-1"
        >
          Metrics
        </label>
        <Select<MetricsOptionType, true>
          id="metricsSelect"
          isMulti
          options={metricsOptions}
          value={metricsOptions.filter((option) =>
            metrics.includes(option.value)
          )}
          onChange={(selectedOptions: MultiValue<MetricsOptionType>) => {
            setMetrics((selectedOptions || []).map((option) => option.value));
          }}
          styles={metricsSelectStyles} // Apply specific style
          classNamePrefix="react-select"
        />
      </div>
      {/* Sort By Select */}
      <div>
        <label
          htmlFor="sortBySelect"
          className="block text-sm font-medium mb-1"
        >
          Sort By
        </label>
        <Select<SortByOptionType, false>
          id="sortBySelect"
          options={sortByOptions}
          value={sortBy ? { value: sortBy, label: sortBy } : null}
          onChange={(selectedOption) => {
            setSortBy(selectedOption?.value);
            if (selectedOption && selectedOption.value !== sortBy) {
              setSortDirection("desc");
            } else if (!selectedOption) {
              setSortDirection(undefined);
            }
          }}
          styles={sortBySelectStyles} // Apply specific style
          classNamePrefix="react-select"
          isClearable
        />
      </div>
      {/* Sort Direction Select */}
      <div>
        <label
          htmlFor="sortDirectionSelect"
          className="block text-sm font-medium mb-1"
        >
          Direction
        </label>
        <Select<SortDirectionOptionType, false>
          id="sortDirectionSelect"
          options={[
            { value: "asc", label: "Ascending" },
            { value: "desc", label: "Descending" },
          ]}
          value={
            sortDirection
              ? {
                value: sortDirection,
                label: sortDirection === "asc" ? "Ascending" : "Descending",
              }
              : null
          }
          onChange={(selectedOption) => {
            setSortDirection(selectedOption?.value);
          }}
          styles={sortDirectionSelectStyles} // Apply specific style
          classNamePrefix="react-select"
          isDisabled={!sortBy}
          isClearable
        />
      </div>
      {/* Filters Section - Now with Expand/Collapse */}
      {playerStatsCategoryKeys.map((key) => (
        <div key={`filter-${key}`} className="flex flex-col">
          {!expandedFilters.has(key) ? (
            <button
              className="btn btn-sm btn-outline mt-auto"
              onClick={() => toggleFilterExpansion(key)}
            >
              Filter by {key}
            </button>
          ) : (
            <>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor={`filter-${key}`}
                  className="block text-sm font-medium"
                >
                  Filter by {key}
                </label>
                <button
                  className="btn btn-xs btn-ghost"
                  onClick={() => toggleFilterExpansion(key)}
                  aria-label={`Collapse filter for ${key}`}
                >
                  Collapse
                </button>
              </div>
              <Select<OptionType, true>
                id={`filter-${key}`}
                isMulti
                options={
                  uniqueValues?.[key]?.map((val) => ({
                    value: val,
                    label: val,
                  })) ?? []
                }
                value={
                  filters?.[key]?.map((val) => ({ value: val, label: val })) ??
                  []
                }
                onChange={(selectedOptions: MultiValue<OptionType>) => {
                  handleFilterChange(key, selectedOptions || null);
                }}
                styles={filterSelectStyles} // Apply specific style
                classNamePrefix="react-select"
                placeholder={`Select ${key}...`}
                isLoading={!uniqueValues}
                isDisabled={!uniqueValues}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};
