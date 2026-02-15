/**
 * Horizontal gauge showing where a user's value falls in the community
 * percentile distribution (p10/p25/p50/p75/p90).
 *
 * Renders as a segmented bar with color-coded zones and a marker for
 * the user's position. Designed to be embedded within analysis sections.
 */

import React from 'react';
import { PercentilePosition, PercentileDistribution } from '../../data/benchmarks';

interface BenchmarkComparisonProps {
  position: PercentilePosition;
  distribution: PercentileDistribution;
  label: string;
  /** If true, lower raw values are better (the gauge inverts display) */
  lowerIsBetter?: boolean;
  /** Format function for axis labels */
  formatValue?: (v: number) => string;
}

const ZONE_COLORS = [
  { bg: 'bg-error/20', border: 'border-error/40' },        // p10 zone (worst)
  { bg: 'bg-orange-500/20', border: 'border-orange-500/40' },
  { bg: 'bg-amber-500/20', border: 'border-amber-500/40' },
  { bg: 'bg-green-500/20', border: 'border-green-500/40' },
  { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' }, // p90 zone (best)
];

export const BenchmarkComparison: React.FC<BenchmarkComparisonProps> = ({
  position,
  distribution,
  label,
  lowerIsBetter = false,
  formatValue = (v) => v.toFixed(1),
}) => {
  const breakpoints = [distribution.p10, distribution.p25, distribution.p50, distribution.p75, distribution.p90];
  const min = Math.min(...breakpoints, position.value) * 0.9;
  const max = Math.max(...breakpoints, position.value) * 1.1;
  const range = max - min || 1;

  const toPercent = (v: number) => ((v - min) / range) * 100;

  // For "lower is better", reverse the zone colors so left (low) = green
  const zones = lowerIsBetter ? [...ZONE_COLORS].reverse() : ZONE_COLORS;

  const markerPos = Math.max(0, Math.min(100, toPercent(position.value)));

  return (
    <div className="rounded-lg border border-base-content/10 bg-base-200/30 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-base-content/70">{label}</span>
        <span
          className="text-sm font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: position.color + '20', color: position.color }}
        >
          {position.rating} — p{position.percentile.toFixed(0)}
        </span>
      </div>

      {/* Gauge bar */}
      <div className="relative h-6 flex rounded overflow-hidden border border-base-content/10">
        {breakpoints.map((_, i) => {
          if (i === breakpoints.length - 1) return null;
          const left = toPercent(breakpoints[i]);
          const right = toPercent(breakpoints[i + 1]);
          return (
            <div
              key={i}
              className={`${zones[i].bg} border-r ${zones[i].border}`}
              style={{
                position: 'absolute',
                left: `${left}%`,
                width: `${right - left}%`,
                height: '100%',
              }}
            />
          );
        })}

        {/* User marker */}
        <div
          className="absolute top-0 h-full w-0.5 z-10"
          style={{
            left: `${markerPos}%`,
            backgroundColor: position.color,
            boxShadow: `0 0 6px ${position.color}`,
          }}
        >
          <div
            className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap"
            style={{ color: position.color }}
          >
            {formatValue(position.value)}
          </div>
        </div>
      </div>

      {/* Breakpoint labels */}
      <div className="relative h-4 mt-1">
        {breakpoints.map((bp, i) => (
          <div
            key={i}
            className="absolute text-[10px] text-base-content/40 -translate-x-1/2"
            style={{ left: `${toPercent(bp)}%` }}
          >
            {formatValue(bp)}
          </div>
        ))}
      </div>

      <div className="flex justify-between text-[10px] text-base-content/30 mt-0.5">
        <span>p10</span>
        <span>p25</span>
        <span>p50</span>
        <span>p75</span>
        <span>p90</span>
      </div>

      <p className="text-xs text-base-content/40 mt-1">
        Based on {distribution.n.toLocaleString()} observations from community data
      </p>
    </div>
  );
};
