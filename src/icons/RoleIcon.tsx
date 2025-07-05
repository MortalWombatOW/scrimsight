import { type ReactNode } from "react";
import { MdFormatListBulleted } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";
import { FaShield } from "react-icons/fa6";

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
  "data-testid"?: string;
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

const TankIcon = ({
  color,
  className,
  "data-testid": dataTestId,
}: { color: ColorKey; className?: string; "data-testid"?: string }): ReactNode => (
  <FaShield
    className={`${getColorClass(color)} ${className || ""}`}
    size={16}
    data-testid={dataTestId}
  />
);

const DamageIcon = ({
  color,
  className,
  "data-testid": dataTestId,
}: { color: ColorKey; className?: string; "data-testid"?: string }): ReactNode => (
  <MdFormatListBulleted
    className={`${getColorClass(color)} ${className || ""} rotate-270`}
    size={16}
    data-testid={dataTestId}
  />
);

const SupportIcon = ({
  color,
  className,
  "data-testid": dataTestId,
}: { color: ColorKey; className?: string; "data-testid"?: string }): ReactNode => (
  <GiHealthNormal
    className={`${getColorClass(color)} ${className || ""}`}
    size={16}
    data-testid={dataTestId}
  />
);

const RoleIcon = ({
  role,
  color = "inherit",
  className = "",
  "data-testid": dataTestId,
}: RoleIconProps): ReactNode => {
  switch (role) {
    case "tank":
      return <TankIcon color={color} className={className} data-testid={dataTestId} />;
    case "damage":
      return <DamageIcon color={color} className={className} data-testid={dataTestId} />;
    case "support":
      return <SupportIcon color={color} className={className} data-testid={dataTestId} />;
    default:
      return null;
  }
};

export default RoleIcon;
