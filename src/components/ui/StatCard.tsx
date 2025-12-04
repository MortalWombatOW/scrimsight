import React, { type ReactNode } from "react";
import { Card } from "@components";

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
    <Card className="stat" noPadding>
      {icon && <div className="stat-figure text-primary">{icon}</div>}
      <div className={`stat-title`}>{title}</div>
      <div className={`stat-value`}>{value}</div>
      {description && <div className="stat-desc">{description}</div>}
    </Card>
  );
};
