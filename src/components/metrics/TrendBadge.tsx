import { formatDelta } from '../../lib/format';
import { MetricFormat } from '../../lib/metricConfig';

interface TrendBadgeProps {
  direction: 'up' | 'down' | 'stable';
  delta?: number;
  format?: MetricFormat;
  invertColor?: boolean;
  size?: 'sm' | 'md';
}

const arrows: Record<string, string> = {
  up: '\u25B2',
  down: '\u25BC',
  stable: '\u25CF',
};

export function TrendBadge({
  direction,
  delta,
  format = 'decimal',
  invertColor = false,
  size = 'sm',
}: TrendBadgeProps) {
  const isPositive = invertColor ? direction === 'down' : direction === 'up';
  const isNegative = invertColor ? direction === 'up' : direction === 'down';

  const colorClass = isPositive
    ? 'text-success'
    : isNegative
      ? 'text-error'
      : 'text-base-content/40';

  const sizeClass = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span className={`inline-flex items-center gap-0.5 ${colorClass} ${sizeClass}`}>
      <span>{arrows[direction]}</span>
      {delta !== undefined && (
        <span>{formatDelta(delta, format)}</span>
      )}
    </span>
  );
}
