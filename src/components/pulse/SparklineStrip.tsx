import { Sparkline } from '../metrics/Sparkline';

export interface SparklineMetric {
  label: string;
  data: number[];
  color?: string;
  benchmarkLine?: number;
}

interface SparklineStripProps {
  metrics: SparklineMetric[];
}

export function SparklineStrip({ metrics }: SparklineStripProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="card-surface rounded-xl px-4 py-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-base-content/40">
            {m.label} — last {m.data.length} scrims
          </span>
          <Sparkline
            data={m.data}
            width={200}
            height={40}
            color={m.color}
            benchmarkLine={m.benchmarkLine}
          />
        </div>
      ))}
    </div>
  );
}
