import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { PlayerStatsCategoryKeys, PlayerStatKey } from "@library";

const DEFAULT_GROUP_BY: PlayerStatsCategoryKeys[] = ["playerName"];
const DEFAULT_METRICS: PlayerStatKey[] = [
  "eliminations",
  "deaths",
  "heroDamageDealt",
];

export function useMetricsUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- Group By ---
  const groupBy = useMemo<PlayerStatsCategoryKeys[]>(() => {
    const param = searchParams.get("groupBy");
    if (!param) return DEFAULT_GROUP_BY;
    return param.split(",") as PlayerStatsCategoryKeys[];
  }, [searchParams]);

  const setGroupBy = useCallback(
    (newGroupBy: PlayerStatsCategoryKeys[]) => {
      setSearchParams(
        (prev) => {
          if (newGroupBy.length === 0) {
            prev.delete("groupBy");
          } else {
            prev.set("groupBy", newGroupBy.join(","));
          }
          return prev;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // --- Metrics ---
  const metrics = useMemo<PlayerStatKey[]>(() => {
    const param = searchParams.get("metrics");
    if (!param) return DEFAULT_METRICS;
    return param.split(",") as PlayerStatKey[];
  }, [searchParams]);

  const setMetrics = useCallback(
    (newMetrics: PlayerStatKey[]) => {
      setSearchParams(
        (prev) => {
          if (newMetrics.length === 0) {
            prev.delete("metrics");
          } else {
            prev.set("metrics", newMetrics.join(","));
          }
          return prev;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // --- Filters ---
  // Filters are stored as keys prefixed with "f_"
  // e.g. ?f_hero=Ana,Zen&f_role=Support
  const filters = useMemo<Record<PlayerStatsCategoryKeys, string[]> | undefined>(
    () => {
      const newFilters: Record<string, string[]> = {};
      let hasFilters = false;

      searchParams.forEach((value, key) => {
        if (key.startsWith("f_")) {
          const filterKey = key.substring(2) as PlayerStatsCategoryKeys;
          newFilters[filterKey] = value.split(",");
          hasFilters = true;
        }
      });

      return hasFilters
        ? (newFilters as Record<PlayerStatsCategoryKeys, string[]>)
        : undefined;
    },
    [searchParams]
  );

  const handleFilterChange = useCallback(
    (
      key: PlayerStatsCategoryKeys,
      selectedOptions: readonly { value: string; label: string }[] | null
    ) => {
      setSearchParams(
        (prev) => {
          const paramKey = `f_${key}`;
          if (!selectedOptions || selectedOptions.length === 0) {
            prev.delete(paramKey);
          } else {
            const values = selectedOptions.map((o) => o.value).join(",");
            prev.set(paramKey, values);
          }
          return prev;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Helper to clear all filters if needed (optional, but good to have)
  const clearFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const keysToDelete: string[] = [];
        prev.forEach((_, key) => {
          if (key.startsWith("f_")) {
            keysToDelete.push(key);
          }
        });
        keysToDelete.forEach((key) => prev.delete(key));
        return prev;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  return {
    groupBy,
    setGroupBy,
    metrics,
    setMetrics,
    filters,
    handleFilterChange,
    clearFilters,
  };
}
