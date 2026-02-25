import { formatMetricValue, formatCI } from '../../lib/format';
import { MetricFormat } from '../../lib/metricConfig';

interface MetricValueProps {
  value: number;
  ci?: [number, number];
  format: MetricFormat;
  decimals?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm tabular-nums',
  md: 'text-lg font-semibold tabular-nums tracking-tight',
  lg: 'text-3xl font-bold tabular-nums tracking-tight',
} as const;

const ciSizeClasses = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
} as const;

export function MetricValue({
  value,
  ci,
  format,
  decimals = 1,
  size = 'md',
  className = '',
}: MetricValueProps) {
  return (
    <span className={`inline-flex items-baseline gap-1 ${className}`}>
      <span className={sizeClasses[size]}>
        {formatMetricValue(value, format, decimals)}
      </span>
      {ci && (
        <span className={`${ciSizeClasses[size]} text-base-content/40`}>
          {formatCI(ci[0], ci[1], format, decimals)}
        </span>
      )}
    </span>
  );
}
