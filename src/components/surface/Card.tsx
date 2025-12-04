import React from "react";

export type CardVariant = "default" | "glass" | "flat";

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
  const baseClasses = "rounded-lg";
  
  const variantClasses = {
    default: "bg-base-200 border border-gray-700 shadow-md",
    glass: "glass-card",
    flat: "bg-base-200 border border-gray-700",
  };

  const selectedVariant = variantClasses[variant];
  const paddingClass = noPadding ? "" : "p-6";

  return (
    <div
      className={`${baseClasses} ${selectedVariant} ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
