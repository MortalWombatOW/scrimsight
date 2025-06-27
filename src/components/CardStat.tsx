import { ReactNode } from "react";
import ValueDelta from "./ValueDelta";
import {
  PLAYER_STAT_RANKING_DIRECTIONS,
  PlayerStatsNumericalKeys,
} from "../lib/ScrimsightDataModel";

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
  size?: "large" | "small";
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
  size = "large",
}: CardStatProps) => {
  const getHigherIsBetter = (metricKey: PlayerStatsNumericalKeys): boolean => {
    return PLAYER_STAT_RANKING_DIRECTIONS[metricKey] === "higher";
  };

  const getSeverityBorderClass = (severity: "neutral" | "good" | "bad") => {
    const borderWidth = size === "large" ? "border-l-4" : "border-l-1";
    switch (severity) {
      case "good":
        return `${borderWidth} border-l-success`;
      case "bad":
        return `${borderWidth} border-l-error`;
      default:
        return `${borderWidth} border-l-info-content`;
    }
  };

  const getSizeClasses = () => {
    if (size === "small") {
      return {
        container: "p-3",
        label: "text-xs",
        value: "text-lg font-semibold",
        rank: "text-xs",
      };
    }
    return {
      container: "p-4",
      label: "text-sm",
      value: "text-2xl font-semibold",
      rank: "text-xs",
    };
  };

  const sizeClasses = getSizeClasses();

  return (
    <div
      className={`bg-base-200 rounded-lg ${
        sizeClasses.container
      } ${getSeverityBorderClass(severity)} w-fit`}
      title={tooltip}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`${sizeClasses.label} text-base-content/70 mb-1`}>
            {label}
          </p>
          <div className={`${sizeClasses.value} text-base-content`}>
            {numericValue !== undefined &&
            averageValue !== undefined &&
            metricKey &&
            rank &&
            totalCount ? (
                <ValueDelta
                  value={numericValue}
                  baseline={averageValue}
                  higherIsBetter={getHigherIsBetter(metricKey)}
                  precision={2}
                  rank={rank}
                  totalCount={totalCount}
                  size={size}
                />
              ) : (
                value
              )}
          </div>
          {rank &&
            !(
              numericValue !== undefined &&
              averageValue !== undefined &&
              metricKey &&
              rank &&
              totalCount
            ) && (
            <div className={`${sizeClasses.rank} text-base-content/60 mt-1`}>
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
