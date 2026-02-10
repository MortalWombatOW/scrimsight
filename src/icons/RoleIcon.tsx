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
}

// Function to map color keys to Tailwind classes
const getColorClass = (color: ColorKey): string => {
  switch (color) {
    case "primary":
      return "text-primary";
    case "secondary":
      return "text-secondary";
    case "error":
      return "text-error";
    case "warning":
      return "text-warning";
    case "info":
      return "text-info";
    case "success":
      return "text-success";
    case "inherit":
    default:
      return "";
  }
};

const TankIcon = ({
  color,
  className,
}: { color: ColorKey; className?: string }): ReactNode => (
  <FaShield
    className={`${getColorClass(color)} ${className || ""}`}
    size={16}
  />
);

const DamageIcon = ({
  color,
  className,
}: { color: ColorKey; className?: string }): ReactNode => (
  <MdFormatListBulleted
    className={`${getColorClass(color)} ${className || ""} rotate-270`}
    size={16}
  />
);

const SupportIcon = ({
  color,
  className,
}: { color: ColorKey; className?: string }): ReactNode => (
  <GiHealthNormal
    className={`${getColorClass(color)} ${className || ""}`}
    size={16}
  />
);

const RoleIcon = ({
  role,
  color = "inherit",
  className = "",
}: RoleIconProps): ReactNode => {
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
