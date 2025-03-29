import React from "react";

export interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
}) => {
  return (
    <div className="stat">
      {icon && <div className="stat-figure">{icon}</div>}
      <div className={`stat-title`}>{title}</div>
      <div className={`stat-value`}>{value}</div>
      {description && <div className="stat-desc">{description}</div>}
    </div>
  );
};
