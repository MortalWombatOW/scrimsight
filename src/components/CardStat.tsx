import { ReactNode } from "react";
import ValueDelta from "./ValueDelta";
import { PLAYER_STAT_RANKING_DIRECTIONS, PlayerStatsNumericalKeys } from "../lib/ScrimsightDataModel";

interface CardStatProps {
  label: string;
  value?: ReactNode;
  numericValue?: number;
  averageValue?: number;
  metricKey?: PlayerStatsNumericalKeys;
  icon?: ReactNode;
  tooltip?: string;
  severity?: "neutral" | "good" | "bad";
  rank?: number;
  totalCount?: number;
}

const CardStat = ({
  label,
  value,
  numericValue,
  averageValue,
  metricKey,
  icon,
  tooltip,
  severity = "neutral",
  rank,
  totalCount,
}: CardStatProps) => {
  const getHigherIsBetter = (metricKey: PlayerStatsNumericalKeys): boolean => {
    return PLAYER_STAT_RANKING_DIRECTIONS[metricKey] === 'higher';
  };

  const getSeverityBorderClass = (severity: "neutral" | "good" | "bad") => {
    switch (severity) {
      case "good":
        return "border-l-success";
      case "bad":
        return "border-l-error";
      default:
        return "border-l-info-content";
    }
  };

  return (
    <div
      className={`bg-base-200 rounded-lg p-4 border-l-4 max-w-sm min-w-max ${getSeverityBorderClass(
        severity
      )}`}
      title={tooltip}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-base-content/70 mb-1">{label}</p>
          <div className="text-2xl font-semibold text-base-content">
            {numericValue !== undefined && averageValue !== undefined && metricKey && rank && totalCount ? (
              <ValueDelta
                value={numericValue}
                baseline={averageValue}
                higherIsBetter={getHigherIsBetter(metricKey)}
                precision={2}
                rank={rank}
                totalCount={totalCount}
              />
            ) : (
              value
            )}
          </div>
          {rank && !(numericValue !== undefined && averageValue !== undefined && metricKey && rank && totalCount) && (
            <div className="text-xs text-base-content/60 mt-1">
              {totalCount ? `Rank ${rank} of ${totalCount}` : `#${rank}`}
            </div>
          )}
        </div>
        {icon && <div className="ml-3 text-base-content/50">{icon}</div>}
      </div>
    </div>
  );
};

export default CardStat;
