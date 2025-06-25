import { ChevronUp, ChevronDown } from "lucide-react";
import { prettyFormat, formatPercentage } from "../lib/format";

interface ValueDeltaProps {
  value: number;
  baseline: number;
  higherIsBetter: boolean;
  precision?: number;
  rank: number;
  totalCount: number;
  size?: "large" | "small";
}

const ValueDelta = ({
  value,
  baseline,
  higherIsBetter,
  precision = 1,
  rank,
  totalCount,
  size = "large",
}: ValueDeltaProps) => {
  const delta = value - baseline;
  const deltaPercentage = baseline !== 0 ? delta / baseline : 0;
  const isPositive = delta > 0;
  const isNeutral = delta === 0;

  const getColorClass = () => {
    if (isNeutral) return "text-base-content/70";

    if (higherIsBetter) {
      return isPositive ? "text-success" : "text-error";
    } else {
      return isPositive ? "text-error" : "text-success";
    }
  };

  const getDeltaIcon = () => {
    if (isNeutral) return null;
    const iconSize = size === "large" ? 14 : 12;
    return isPositive ? (
      <ChevronUp size={iconSize} />
    ) : (
      <ChevronDown size={iconSize} />
    );
  };

  const getSizeClasses = () => {
    if (size === "small") {
      return {
        mainValue: "text-sm font-medium",
        deltaText: "text-xs font-medium",
        percentage: "text-xs opacity-75",
        comparison: "text-xs",
      };
    }
    return {
      mainValue: "font-medium",
      deltaText: "text-sm font-medium",
      percentage: "text-xs opacity-75",
      comparison: "text-xs",
    };
  };

  const displayValue = prettyFormat(value, precision);
  const displayBaseline = prettyFormat(baseline, precision);
  const displayDeltaFormatted = `${isPositive ? "+" : "-"}${prettyFormat(
    Math.abs(delta),
    precision
  )}`;

  const getRankDisplay = () => {
    return ` • ${rank} of ${totalCount}`;
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <span className={`${sizeClasses.mainValue} text-base-content`}>
          {displayValue}
        </span>
        {!isNeutral && (
          <div className={`flex items-center gap-0.5 ${getColorClass()}`}>
            {getDeltaIcon()}
            <span className={sizeClasses.deltaText}>
              {displayDeltaFormatted}
            </span>
            {baseline !== 0 && (
              <span className={sizeClasses.percentage}>
                ({deltaPercentage >= 0 ? "+" : ""}
                {formatPercentage(deltaPercentage, precision)})
              </span>
            )}
          </div>
        )}
      </div>
      <div className={`${sizeClasses.comparison} text-base-content/60`}>
        vs {displayBaseline}
        {getRankDisplay()}
      </div>
    </div>
  );
};

export default ValueDelta;
