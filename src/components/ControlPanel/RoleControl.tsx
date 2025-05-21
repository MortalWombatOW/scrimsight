import type { ReactNode } from "react";
import { OverwatchRole } from "~/lib";
import RoleCheckbox from "~/components/ControlPanel/RoleCheckbox";

interface RoleControlProps {
  selectedRoles: OverwatchRole[];
  onChange: (roles: OverwatchRole[]) => void;
  size?: "small" | "large";
}

const RoleControl = ({
  selectedRoles,
  onChange,
  size = "large",
}: RoleControlProps): ReactNode => {
  return (
    <div className="mx-2.5">
      <h3 className="mb-2 text-lg font-medium">Roles</h3>
      <div
        className={`flex ${
          size === "small" ? "flex-row space-x-4" : "flex-col space-y-2"
        }`}
      >
        <label className="flex items-center">
          <RoleCheckbox
            role="tank"
            checked={selectedRoles.includes("tank")}
            onChange={(checked) =>
              onChange(
                checked
                  ? [...selectedRoles, "tank"]
                  : selectedRoles.filter((r) => r !== "tank")
              )
            }
          />
          {size === "large" && <span className="ml-2">Tank</span>}
        </label>
        <label className="flex items-center">
          <RoleCheckbox
            role="damage"
            checked={selectedRoles.includes("damage")}
            onChange={(checked) =>
              onChange(
                checked
                  ? [...selectedRoles, "damage"]
                  : selectedRoles.filter((r) => r !== "damage")
              )
            }
          />
          {size === "large" && <span className="ml-2">Damage</span>}
        </label>
        <label className="flex items-center">
          <RoleCheckbox
            role="support"
            checked={selectedRoles.includes("support")}
            onChange={(checked) =>
              onChange(
                checked
                  ? [...selectedRoles, "support"]
                  : selectedRoles.filter((r) => r !== "support")
              )
            }
          />
          {size === "large" && <span className="ml-2">Support</span>}
        </label>
      </div>
    </div>
  );
};

export default RoleControl;
