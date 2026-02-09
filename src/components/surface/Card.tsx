import React from "react";
import { cn } from "@library/cn";

export type CardVariant = "default" | "elevated" | "flat";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: CardVariant;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  noPadding = false,
  ...props
}) => {
  const variantClasses = {
    default: "bg-base-100 border border-base-content/10 shadow-sm",
    elevated: "bg-base-100 border border-base-content/10 shadow-md",
    flat: "bg-base-100 border border-base-content/8",
  };

  return (
    <div
      className={cn(
        "rounded-xl",
        variantClasses[variant],
        !noPadding && "p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
