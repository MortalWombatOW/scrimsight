import { MetricCell } from '../metrics/MetricCell';
import { MetricFormat } from '../../lib/metricConfig';

interface InsightMetric {
  label: string;
  value: number;
  format: MetricFormat;
  lowerIsBetter?: boolean;
}

interface InsightGroup {
  title: string;
  metrics: InsightMetric[];
}

interface QuickInsightsProps {
  groups: InsightGroup[];
}

export function QuickInsights({ groups }: QuickInsightsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {groups.map((group) => (
        <div key={group.title} className="card-surface rounded-xl p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
            {group.title}
          </h3>
          <div className="flex flex-wrap gap-4">
            {group.metrics.map((m) => (
              <MetricCell
                key={m.label}
                label={m.label}
                value={m.value}
                format={m.format}
                lowerIsBetter={m.lowerIsBetter}
                size="sm"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
