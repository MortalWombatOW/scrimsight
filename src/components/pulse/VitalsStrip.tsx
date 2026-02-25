import { MetricCell } from '../metrics/MetricCell';
import { MetricFormat } from '../../lib/metricConfig';

export interface VitalMetric {
  label: string;
  value: number;
  ci?: [number, number];
  trend?: { direction: 'up' | 'down' | 'stable'; delta?: number };
  percentile?: number;
  format: MetricFormat;
  lowerIsBetter?: boolean;
}

interface VitalsStripProps {
  metrics: VitalMetric[];
}

export function VitalsStrip({ metrics }: VitalsStripProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="card-surface rounded-xl px-4 py-3"
        >
          <MetricCell
            label={m.label}
            value={m.value}
            ci={m.ci}
            trend={m.trend}
            percentile={m.percentile}
            format={m.format}
            lowerIsBetter={m.lowerIsBetter}
            size="lg"
          />
        </div>
      ))}
    </div>
  );
}
