import React from "react";

export interface StatCardProps {
  title: string;
  value: string;
  color: string;
  trend?: "positive" | "negative" | "neutral"; // Make trend optional
  icon?: React.ReactNode;
  description?: string; // Add description prop
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color,
  trend = "neutral", // Default value
  icon,
  description
}) => {
  return (
    <div className={`stats shadow bg-${color} text-${color}-content`}>
      <div className="stat">
        {icon && <div className="stat-figure">{icon}</div>}
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {description && <div className="stat-desc">{description}</div>}
        {trend !== "neutral" && (
          <div className={`stat-desc text-${trend === "positive" ? "success" : "error"}`}>
            {trend === "positive" ? "↗" : "↘"}
          </div>
        )}
      </div>
    </div>
  );
};
