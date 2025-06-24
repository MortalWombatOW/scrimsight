import { ChevronUp, ChevronDown } from "lucide-react";
import { prettyFormat, formatPercentage } from "../lib/format";

interface ValueDeltaProps {
  value: number;
  baseline: number;
  higherIsBetter: boolean;
  precision?: number;
  rank: number;
  totalCount: number;
}

const ValueDelta = ({
  value,
  baseline,
  higherIsBetter,
  precision = 1,
  rank,
  totalCount,
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
    return isPositive ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
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

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <span className="font-medium text-base-content">{displayValue}</span>
        {!isNeutral && (
          <div className={`flex items-center gap-0.5 ${getColorClass()}`}>
            {getDeltaIcon()}
            <span className="text-sm font-medium">{displayDeltaFormatted}</span>
            {baseline !== 0 && (
              <span className="text-xs opacity-75">
                ({deltaPercentage >= 0 ? "+" : ""}
                {formatPercentage(deltaPercentage, precision)})
              </span>
            )}
          </div>
        )}
      </div>
      <div className="text-xs text-base-content/60">
        vs {displayBaseline}
        {getRankDisplay()}
      </div>
    </div>
  );
};

export default ValueDelta;
