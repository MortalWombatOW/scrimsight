import { useNavigate } from 'react-router-dom';
import { MetricRow } from '../metrics/MetricRow';
import { MetricFormat } from '../../lib/metricConfig';

export interface PlayerSnapshot {
  name: string;
  role: string;
  metrics: Array<{
    value: number;
    ci?: [number, number];
    format: MetricFormat;
    percentile?: number;
    lowerIsBetter?: boolean;
  }>;
  trend?: { direction: 'up' | 'down' | 'stable'; delta?: number };
}

interface PlayerSnapshotTableProps {
  players: PlayerSnapshot[];
  columnHeaders: string[];
  focusedPlayer?: string;
}

export function PlayerSnapshotTable({ players, columnHeaders, focusedPlayer }: PlayerSnapshotTableProps) {
  const navigate = useNavigate();

  if (players.length === 0) return null;

  return (
    <div className="card-surface rounded-xl overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-4 px-3 py-2 border-b border-base-content/5">
        <div className="min-w-[100px] text-[10px] font-medium uppercase tracking-wider text-base-content/40">
          Player
        </div>
        {columnHeaders.map((h) => (
          <div key={h} className="min-w-[80px] text-[10px] font-medium uppercase tracking-wider text-base-content/40">
            {h}
          </div>
        ))}
        <div className="ml-auto text-[10px] font-medium uppercase tracking-wider text-base-content/40">
          Trend
        </div>
      </div>

      {/* Player rows */}
      {players.map((p) => (
        <div
          key={p.name}
          className={
            focusedPlayer === p.name
              ? 'border-l-2 border-primary bg-primary/5'
              : ''
          }
        >
          <MetricRow
            label={p.name}
            sublabel={p.role}
            metrics={p.metrics}
            trend={p.trend}
            onClick={() => navigate(`/player/${p.name}`)}
          />
        </div>
      ))}
    </div>
  );
}
