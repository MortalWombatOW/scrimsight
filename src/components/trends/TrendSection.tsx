

import { useTrendData } from '../../hooks/useTrendData';
import { TrendsChart } from './TrendsChart';

export const TrendSection = () => {
  const { data, teamName } = useTrendData(); // Auto-detect team

  if (!data || data.length < 2) {
    return null; // Need at least 2 points for a line
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Trend Analysis</h2>
          <p className="text-sm text-base-content/60">Performance over time for {teamName}</p>
        </div>
        {/* Placeholder link for future metrics explorer */}
             {/* <Link to="/analytics" className="link link-primary text-sm">View Details</Link> */}
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200 dark:border-base-700">
        <div className="card-body p-6">
          <TrendsChart 
            data={data} 
            metrics={[
              { key: 'winRate', color: '#10b981', label: 'Win Rate (%)' }, // emerald-500
              { key: 'matchKd', color: '#f59e0b', label: 'Match K/D' },   // amber-500
              // { key: 'cumulativeKd', color: '#3b82f6', label: 'Cumulative K/D' }, // blue-500
            ]} 
          />
        </div>
      </div>
    </div>
  );
};
