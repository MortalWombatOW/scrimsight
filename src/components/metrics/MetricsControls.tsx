import React from "react";
import Select, { MultiValue } from "react-select"; // Removed StylesConfig
import {
  PlayerStatsCategoryKeys,
  playerStatsCategoryKeys,
  PlayerStatKey,
  STAT_CONFIG,
  getStatLabel,
} from "@library";
// Import specific style objects
import {
  groupBySelectStyles,
  metricsSelectStyles,
  filterSelectStyles,
} from "@library";

// Define option type for react-select
type OptionType = { value: string; label: string };
// Define specific option types for clarity
type GroupByOptionType = { value: PlayerStatsCategoryKeys; label: string };
type MetricsOptionType = { value: PlayerStatKey; label: string };

interface MetricsControlsProps {
  groupBy: PlayerStatsCategoryKeys[];
  setGroupBy: (value: PlayerStatsCategoryKeys[]) => void;
  metrics: PlayerStatKey[];
  setMetrics: (value: PlayerStatKey[]) => void;
  filters: Record<PlayerStatsCategoryKeys, string[]> | undefined;
  handleFilterChange: (
    key: PlayerStatsCategoryKeys,
    selectedOptions: readonly OptionType[] | null
  ) => void;
  expandedFilters: Set<PlayerStatsCategoryKeys>;
  toggleFilterExpansion: (key: PlayerStatsCategoryKeys) => void;
  uniqueValues: Record<PlayerStatsCategoryKeys, string[]> | undefined;
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
}) => {
  // Prepare options for react-select controls
  const groupByOptions: GroupByOptionType[] = playerStatsCategoryKeys.map(
    (key) => ({
      value: key,
      label: key,
    })
  );
  const metricsOptions: MetricsOptionType[] = (Object.keys(STAT_CONFIG) as PlayerStatKey[]).map(
    (key) => ({
      value: key,
      label: getStatLabel(key),
    })
  );



  return (
    <div className="flex flex-col gap-6">
      {/* Group By Section */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-base-content/70 uppercase tracking-wider">Grouping</h3>
        <label
          htmlFor="groupBySelect"
          className="sr-only"
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
          menuPortalTarget={document.body}
          menuPosition="fixed"
          placeholder="Select grouping..."
        />
      </div>

      {/* Metrics Section */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-base-content/70 uppercase tracking-wider">Metrics</h3>
        <label
          htmlFor="metricsSelect"
          className="sr-only"
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
          menuPortalTarget={document.body}
          menuPosition="fixed"
          placeholder="Select metrics..."
        />
      </div>
      
      {/* Filters Section */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-base-content/70 uppercase tracking-wider">Filters</h3>
        <div className="flex flex-col gap-3">
          {playerStatsCategoryKeys.map((key) => (
            <div key={`filter-${key}`} className="flex flex-col w-full">
              {!expandedFilters.has(key) ? (
                <button
                  className="btn btn-sm btn-outline w-full justify-start normal-case"
                  onClick={() => toggleFilterExpansion(key)}
                >
                  + Filter by {key}
                </button>
              ) : (
                <div className="p-3 bg-base-200/50 rounded-lg border border-base-300 dark:border-base-700">
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor={`filter-${key}`}
                      className="block text-xs font-bold uppercase text-base-content/60"
                    >
                      {key}
                    </label>
                    <button
                      className="btn btn-xs btn-ghost btn-square"
                      onClick={() => toggleFilterExpansion(key)}
                      aria-label={`Collapse filter for ${key}`}
                    >
                      ✕
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
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
