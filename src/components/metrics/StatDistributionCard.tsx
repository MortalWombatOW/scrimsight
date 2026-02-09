import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "@components";
import {
  calculateHistogram,
  calculateMean,
  calculateMin,
  calculateMax,
} from "../../lib/statistics";
import { formatStat, PlayerStatKey } from "@library";

interface StatDistributionCardProps {
  title: string;
  data: number[];
  metricKey: PlayerStatKey;
  className?: string;
}

export const StatDistributionCard: React.FC<StatDistributionCardProps> = ({
  title,
  data,
  metricKey,
  className = "",
}) => {
  const stats = useMemo(() => {
    return {
      min: calculateMin(data),
      max: calculateMax(data),
      mean: calculateMean(data),
      histogram: calculateHistogram(data, 15), // 15 bins for better resolution
    };
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-300/90 p-2 rounded border border-base-content/10 text-xs shadow-xl backdrop-blur-sm">
          <p className="font-bold text-base-content">{label}</p>
          <p className="text-primary">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card variant="default" className={`flex flex-col ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-bold text-base-content/70 uppercase tracking-wider">
          {title}
        </h3>
      </div>

      <div className="flex-1 min-h-[100px] w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.histogram}>
            <XAxis
              dataKey="label"
              hide
              interval={0}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {stats.histogram.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="var(--color-primary)"
                  fillOpacity={0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-base-content/5">
        <div className="text-center">
          <div className="text-[10px] uppercase text-base-content/50 font-bold tracking-wider mb-0.5">
            Min
          </div>
          <div className="text-sm font-mono font-medium text-base-content/80">
            {formatStat(metricKey, stats.min)}
          </div>
        </div>
        <div className="text-center border-x border-base-content/5">
          <div className="text-[10px] uppercase text-base-content/50 font-bold tracking-wider mb-0.5">
            Avg
          </div>
          <div className="text-sm font-mono font-bold text-primary">
            {formatStat(metricKey, stats.mean)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] uppercase text-base-content/50 font-bold tracking-wider mb-0.5">
            Max
          </div>
          <div className="text-sm font-mono font-medium text-base-content/80">
            {formatStat(metricKey, stats.max)}
          </div>
        </div>
      </div>
    </Card>
  );
};
