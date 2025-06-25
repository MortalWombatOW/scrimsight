import { ReactNode } from "react";
import { ScrimsightMetricFocus, PlayerStatsNumerical, PlayerStatsNumericalKeys, METRIC_DISPLAY_NAME, PLAYER_STAT_RANKING_DIRECTIONS } from "../lib/ScrimsightDataModel";
import CardStat from "./CardStat";
import { Target, TrendingUp, Activity, Zap } from "lucide-react";

interface MetricFocusSectionProps {
  metricFocus: ScrimsightMetricFocus;
  playerStats: PlayerStatsNumerical;
  playerStatRanks?: PlayerStatsNumerical;
  playerAverageStats?: PlayerStatsNumerical;
  totalCount?: number;
  className?: string;
}

const MetricFocusSection = ({
  metricFocus,
  playerStats,
  playerStatRanks,
  playerAverageStats,
  totalCount,
  className = "",
}: MetricFocusSectionProps) => {
  const getFocusIcon = (focus: string): ReactNode => {
    switch (focus.toLowerCase()) {
      case "offensive impact":
        return <Target className="w-6 h-6" />;
      case "survivability":
        return <Activity className="w-6 h-6" />;
      case "utility":
        return <TrendingUp className="w-6 h-6" />;
      case "efficiency":
        return <Zap className="w-6 h-6" />;
      default:
        return <Target className="w-6 h-6" />;
    }
  };


  const calculateSeverity = (value: number, averageValue: number, metricKey: PlayerStatsNumericalKeys): "neutral" | "good" | "bad" => {
    const higherIsBetter = PLAYER_STAT_RANKING_DIRECTIONS[metricKey] === 'higher';
    
    if (higherIsBetter) {
      return value > averageValue ? "good" : "bad";
    } else {
      return value < averageValue ? "good" : "bad";
    }
  };

  return (
    <div className={`bg-base-100 rounded-lg p-6 w-fit ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-primary">{getFocusIcon(metricFocus.focus)}</div>
        <div>
          <h2 className="text-2xl font-bold text-base-content">
            {metricFocus.focus}
          </h2>
          <p className="text-sm text-base-content/70 mt-1">
            {metricFocus.description}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-base-content mb-3">
            Primary Metrics
          </h3>
          <div className="flex flex-wrap gap-4">
            {metricFocus.primaryMetrics.map((metricKey) => {
              const value = playerStats[metricKey];
              if (value === undefined) return null;
              
              const rank = playerStatRanks?.[metricKey];
              const averageValue = playerAverageStats?.[metricKey];
              const severity = averageValue !== undefined ? calculateSeverity(value, averageValue, metricKey) : "neutral";
              
              return (
                <CardStat
                  key={metricKey}
                  label={METRIC_DISPLAY_NAME[metricKey]}
                  numericValue={value}
                  averageValue={averageValue}
                  metricKey={metricKey}
                  rank={rank}
                  totalCount={totalCount}
                  severity={severity}
                  size="large"
                />
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-base-content mb-3">
            Secondary Metrics
          </h3>
          <div className="flex flex-wrap gap-3">
            {metricFocus.secondaryMetrics.map((metricKey) => {
              const value = playerStats[metricKey];
              if (value === undefined) return null;
              
              const rank = playerStatRanks?.[metricKey];
              const averageValue = playerAverageStats?.[metricKey];
              const severity = averageValue !== undefined ? calculateSeverity(value, averageValue, metricKey) : "neutral";
              
              return (
                <CardStat
                  key={metricKey}
                  label={METRIC_DISPLAY_NAME[metricKey]}
                  numericValue={value}
                  averageValue={averageValue}
                  metricKey={metricKey}
                  rank={rank}
                  totalCount={totalCount}
                  severity={severity}
                  size="small"
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricFocusSection;