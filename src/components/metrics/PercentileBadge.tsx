import { formatPercentile } from '../../lib/format';

interface PercentileBadgeProps {
  percentile: number;
  rating?: string;
  size?: 'sm' | 'md';
}

function getPercentileColor(percentile: number): string {
  if (percentile >= 75) return 'bg-emerald-500/20 text-emerald-400';
  if (percentile >= 55) return 'bg-green-500/20 text-green-400';
  if (percentile >= 35) return 'bg-amber-500/20 text-amber-400';
  if (percentile >= 15) return 'bg-orange-500/20 text-orange-400';
  return 'bg-red-500/20 text-red-400';
}

export function PercentileBadge({
  percentile,
  size = 'sm',
}: PercentileBadgeProps) {
  const colorClass = getPercentileColor(percentile);
  const sizeClass = size === 'sm' ? 'text-[10px] px-1 py-px' : 'text-xs px-1.5 py-0.5';

  return (
    <span className={`inline-block rounded font-medium ${colorClass} ${sizeClass}`}>
      {formatPercentile(percentile)}
    </span>
  );
}
