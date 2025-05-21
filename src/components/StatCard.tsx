import React, { type ReactNode } from "react";

export interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  description,
}: StatCardProps): ReactNode => {
  return (
    <div className="stat">
      {icon && <div className="stat-figure">{icon}</div>}
      <div className={`stat-title`}>{title}</div>
      <div className={`stat-value`}>{value}</div>
      {description && <div className="stat-desc">{description}</div>}
    </div>
  );
};
