
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { format } from 'date-fns';
import { TrendDataPoint } from '../../hooks/useTrendData';

interface TrendsChartProps {
  data: TrendDataPoint[];
  metrics: {
    key: keyof TrendDataPoint;
    color: string;
    label: string;
  }[];
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as TrendDataPoint;
    return (
      <div className="bg-base-100 p-3 border border-base-300 rounded shadow-lg text-sm">
        <p className="font-bold mb-1">{format(new Date(dataPoint.date), 'MMM d, yyyy')}</p>
        <p className="mb-1 text-xs text-base-content/70">vs {dataPoint.opponent}</p>
        <p className={`text-xs font-semibold ${dataPoint.result === 'WIN' ? 'text-success' : 'text-error'}`}>
          Result: {dataPoint.result}
        </p>
        <div className="divider my-1"></div>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            {entry.name?.toString().includes('Rate') ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const TrendsChart: React.FC<TrendsChartProps> = ({ data, metrics }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={(unixTime) => format(new Date(unixTime), 'MMM d')}
            strokeOpacity={0.5}
            style={{ fontSize: 12 }}
          />
          <YAxis 
            strokeOpacity={0.5}
            style={{ fontSize: 12 }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {metrics.map((metric) => (
            <Line
              key={metric.key}
              type="monotone"
              dataKey={metric.key}
              name={metric.label}
              stroke={metric.color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
