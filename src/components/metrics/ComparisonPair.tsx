import { MetricFormat } from '../../lib/metricConfig';
import { MetricValue } from './MetricValue';
import { TrendBadge } from './TrendBadge';

interface ComparisonPairProps {
  label: string;
  current: number;
  average: number;
  format: MetricFormat;
  lowerIsBetter?: boolean;
  decimals?: number;
}

export function ComparisonPair({
  label,
  current,
  average,
  format,
  lowerIsBetter = false,
  decimals = 1,
}: ComparisonPairProps) {
  const delta = current - average;
  const isImproved = lowerIsBetter ? delta < 0 : delta > 0;
  const direction = Math.abs(delta) < 0.01 ? 'stable' as const
    : isImproved ? 'up' as const : 'down' as const;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-base-content/50 min-w-[60px]">{label}</span>
      <MetricValue value={current} format={format} decimals={decimals} size="sm" />
      <span className="text-[10px] text-base-content/30">vs</span>
      <MetricValue value={average} format={format} decimals={decimals} size="sm" />
      <TrendBadge
        direction={direction}
        delta={delta}
        format={format}
        invertColor={lowerIsBetter}
        size="sm"
      />
    </div>
  );
}
