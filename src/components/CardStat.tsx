import { ReactNode } from "react";

interface CardStatProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  tooltip?: string;
  severity?: "neutral" | "good" | "bad";
}

const CardStat = ({
  label,
  value,
  icon,
  tooltip,
  severity = "neutral",
}: CardStatProps) => {
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
            {value}
          </div>
        </div>
        {icon && <div className="ml-3 text-base-content/50">{icon}</div>}
      </div>
    </div>
  );
};

export default CardStat;
