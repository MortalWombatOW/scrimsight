import { MetricFormat } from '../../lib/metricConfig';
import { MetricValue } from './MetricValue';
import { TrendBadge } from './TrendBadge';
import { PercentileBadge } from './PercentileBadge';

interface MetricRowMetric {
  value: number;
  ci?: [number, number];
  format: MetricFormat;
  percentile?: number;
  lowerIsBetter?: boolean;
}

interface MetricRowProps {
  label: string;
  sublabel?: string;
  metrics: MetricRowMetric[];
  trend?: { direction: 'up' | 'down' | 'stable'; delta?: number };
  onClick?: () => void;
}

export function MetricRow({
  label,
  sublabel,
  metrics,
  trend,
  onClick,
}: MetricRowProps) {
  return (
    <div
      className={`flex items-center gap-4 px-3 py-2 rounded-lg ${
        onClick ? 'cursor-pointer hover:bg-base-300/50 transition-colors' : ''
      }`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
    >
      {/* Label column */}
      <div className="min-w-[100px] shrink-0">
        <div className="text-sm font-medium">{label}</div>
        {sublabel && (
          <div className="text-[10px] text-base-content/50">{sublabel}</div>
        )}
      </div>

      {/* Metric columns */}
      {metrics.map((m, i) => (
        <div key={i} className="flex items-center gap-1 min-w-[80px]">
          <MetricValue value={m.value} ci={m.ci} format={m.format} size="sm" />
          {m.percentile !== undefined && (
            <PercentileBadge percentile={m.percentile} size="sm" />
          )}
        </div>
      ))}

      {/* Trend column */}
      {trend && (
        <div className="ml-auto">
          <TrendBadge direction={trend.direction} delta={trend.delta} />
        </div>
      )}
    </div>
  );
}
