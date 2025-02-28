import React from "react";

type ColorKey =
  | "inherit"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning"
  | string;

interface RoleIconProps {
  role: string;
  color?: ColorKey;
  className?: string;
}

// Function to map color keys to Tailwind classes
const getColorClass = (color: ColorKey): string => {
  switch (color) {
    case "primary":
      return "text-primary-600 dark:text-primary-400";
    case "secondary":
      return "text-secondary-600 dark:text-secondary-400";
    case "error":
      return "text-red-600 dark:text-red-400";
    case "warning":
      return "text-amber-600 dark:text-amber-400";
    case "info":
      return "text-blue-600 dark:text-blue-400";
    case "success":
      return "text-green-600 dark:text-green-400";
    case "inherit":
    default:
      return "";
  }
};

const TankIcon: React.FC<{ color: ColorKey; className?: string }> = ({
  color,
  className,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`${getColorClass(color)} ${className || ""}`}
    width="1em"
    height="1em"
  >
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
  </svg>
);

const DamageIcon: React.FC<{ color: ColorKey; className?: string }> = ({
  color,
  className,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`${getColorClass(color)} ${className || ""} rotate-270`}
    width="1em"
    height="1em"
    style={{ transform: "rotate(270deg)" }}
  >
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
  </svg>
);

const SupportIcon: React.FC<{ color: ColorKey; className?: string }> = ({
  color,
  className,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`${getColorClass(color)} ${className || ""}`}
    width="1em"
    height="1em"
  >
    <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
  </svg>
);

const RoleIcon: React.FC<RoleIconProps> = ({
  role,
  color = "inherit",
  className = "",
}) => {
  switch (role) {
    case "tank":
      return <TankIcon color={color} className={className} />;
    case "damage":
      return <DamageIcon color={color} className={className} />;
    case "support":
      return <SupportIcon color={color} className={className} />;
    default:
      return null;
  }
};

export default RoleIcon;
