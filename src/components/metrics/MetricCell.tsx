import { MetricFormat } from '../../lib/metricConfig';
import { MetricValue } from './MetricValue';
import { TrendBadge } from './TrendBadge';
import { PercentileBadge } from './PercentileBadge';
import { Sparkline } from './Sparkline';

interface MetricCellProps {
  label: string;
  value: number;
  ci?: [number, number];
  trend?: { direction: 'up' | 'down' | 'stable'; delta?: number };
  percentile?: number;
  format: MetricFormat;
  lowerIsBetter?: boolean;
  sparklineData?: number[];
  benchmarkLine?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function MetricCell({
  label,
  value,
  ci,
  trend,
  percentile,
  format,
  lowerIsBetter = false,
  sparklineData,
  benchmarkLine,
  size = 'md',
}: MetricCellProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-base-content/50">
        {label}
      </span>
      <MetricValue value={value} ci={ci} format={format} size={size} />
      <div className="flex items-center gap-1.5">
        {trend && (
          <TrendBadge
            direction={trend.direction}
            delta={trend.delta}
            format={format}
            invertColor={lowerIsBetter}
            size="sm"
          />
        )}
        {percentile !== undefined && (
          <PercentileBadge percentile={percentile} size="sm" />
        )}
      </div>
      {sparklineData && sparklineData.length >= 2 && (
        <Sparkline data={sparklineData} benchmarkLine={benchmarkLine} />
      )}
    </div>
  );
}
