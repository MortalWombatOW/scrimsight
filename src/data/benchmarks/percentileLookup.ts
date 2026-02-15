/**
 * Percentile lookup utilities for benchmark comparisons.
 *
 * Uses linear interpolation between p10/p25/p50/p75/p90 breakpoints
 * to estimate where a user's value falls in the community distribution.
 */

import { PercentileDistribution, ByRoleDistribution, PercentilePosition } from './types';
import { OverwatchRole } from '../../lib/hero';

const BREAKPOINTS = [
  { percentile: 10, key: 'p10' as const },
  { percentile: 25, key: 'p25' as const },
  { percentile: 50, key: 'p50' as const },
  { percentile: 75, key: 'p75' as const },
  { percentile: 90, key: 'p90' as const },
];

/**
 * Compute where a value falls in a percentile distribution via linear interpolation.
 * @param lowerIsBetter - If true, lower values = higher percentile (e.g., deaths/10)
 */
export function computePercentilePosition(
  value: number,
  dist: PercentileDistribution,
  lowerIsBetter = false,
): PercentilePosition {
  const points = BREAKPOINTS.map(bp => ({
    percentile: bp.percentile,
    value: dist[bp.key],
  }));

  // Sort by value ascending for interpolation
  const sorted = [...points].sort((a, b) => a.value - b.value);

  let rawPercentile: number;

  if (value <= sorted[0].value) {
    // Below the lowest breakpoint
    rawPercentile = sorted[0].percentile;
  } else if (value >= sorted[sorted.length - 1].value) {
    // Above the highest breakpoint
    rawPercentile = sorted[sorted.length - 1].percentile;
  } else {
    // Find the two breakpoints we're between and interpolate
    let lo = sorted[0];
    let hi = sorted[sorted.length - 1];
    for (let i = 0; i < sorted.length - 1; i++) {
      if (value >= sorted[i].value && value <= sorted[i + 1].value) {
        lo = sorted[i];
        hi = sorted[i + 1];
        break;
      }
    }
    const t = hi.value === lo.value ? 0 : (value - lo.value) / (hi.value - lo.value);
    rawPercentile = lo.percentile + t * (hi.percentile - lo.percentile);
  }

  // For "lower is better" metrics, invert: being at p10 (low value) = 90th percentile
  const percentile = lowerIsBetter ? 100 - rawPercentile : rawPercentile;

  return {
    value,
    percentile,
    rating: getRating(percentile),
    color: getRatingColor(percentile),
  };
}

function getRating(percentile: number): PercentilePosition['rating'] {
  if (percentile >= 75) return 'Excellent';
  if (percentile >= 55) return 'Good';
  if (percentile >= 35) return 'Average';
  if (percentile >= 15) return 'Below Average';
  return 'Needs Work';
}

function getRatingColor(percentile: number): string {
  if (percentile >= 75) return '#10b981'; // emerald-500
  if (percentile >= 55) return '#22c55e'; // green-500
  if (percentile >= 35) return '#f59e0b'; // amber-500
  if (percentile >= 15) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
}

/**
 * Select the best distribution for a given role.
 * Falls back to overall if no role-specific distribution exists.
 */
export function selectDistribution(
  byRole: ByRoleDistribution | undefined,
  overall: PercentileDistribution,
  role?: OverwatchRole,
): PercentileDistribution {
  if (!role || !byRole) return overall;

  const roleMap: Record<OverwatchRole, keyof ByRoleDistribution> = {
    tank: 'Tank',
    damage: 'DPS',
    support: 'Support',
  };

  return byRole[roleMap[role]] ?? overall;
}
