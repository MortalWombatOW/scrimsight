
import { useState, useMemo } from 'react';
import { useTrendData, TrendDataPoint } from '../../hooks/useTrendData';
import { TrendsChart, BenchmarkLine } from './TrendsChart';

interface MetricConfig {
  key: keyof TrendDataPoint;
  color: string;
  label: string;
  benchmarkLine?: BenchmarkLine;
}

const ALL_METRICS: MetricConfig[] = [
  {
    key: 'winRate',
    color: '#10b981',
    label: 'Win Rate (%)',
  },
  {
    key: 'tfwr',
    color: '#3b82f6',
    label: 'TFWR (%)',
    benchmarkLine: { value: 55, label: '55% TFWR', color: '#3b82f6' },
  },
  {
    key: 'matchKd',
    color: '#f59e0b',
    label: 'K/D',
  },
  {
    key: 'deathsPer10',
    color: '#ef4444',
    label: 'D/10',
    benchmarkLine: { value: 6.0, label: '6.0 D/10', color: '#ef4444' },
  },
  {
    key: 'firstPickRate',
    color: '#8b5cf6',
    label: 'First Pick %',
    benchmarkLine: { value: 75, label: '75% FP', color: '#8b5cf6' },
  },
  {
    key: 'firstDeathRate',
    color: '#ec4899',
    label: 'First Death %',
  },
];

const DEFAULT_SELECTED = new Set(['winRate', 'tfwr']);

export const TrendSection = () => {
  const { data, teamName } = useTrendData();
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(DEFAULT_SELECTED);

  const toggleMetric = (key: string) => {
    setSelectedMetrics(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key); // Keep at least one
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const activeMetrics = useMemo(
    () => ALL_METRICS.filter(m => selectedMetrics.has(m.key)),
    [selectedMetrics],
  );

  const benchmarkLines = useMemo(
    () => activeMetrics
      .map(m => m.benchmarkLine)
      .filter((bl): bl is BenchmarkLine => bl != null),
    [activeMetrics],
  );

  if (!data || data.length < 2) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Trend Analysis</h2>
          <p className="text-sm text-base-content/60">Performance over time for {teamName}</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-content/10">
        <div className="card-body p-6">
          {/* Metric selector chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ALL_METRICS.map(m => {
              const isActive = selectedMetrics.has(m.key);
              return (
                <button
                  key={m.key}
                  onClick={() => toggleMetric(m.key)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer
                    border
                    ${isActive
                      ? 'border-transparent text-white'
                      : 'border-base-content/20 text-base-content/50 hover:text-base-content/80 bg-transparent'
                    }
                  `}
                  style={isActive ? { backgroundColor: m.color } : undefined}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          <TrendsChart
            data={data}
            metrics={activeMetrics.map(m => ({ key: m.key, color: m.color, label: m.label }))}
            benchmarkLines={benchmarkLines}
          />
        </div>
      </div>
    </div>
  );
};
