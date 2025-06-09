import type { ReactNode } from "react";
import { RoleIcon } from "@icons";
import { OverwatchRole } from "@library";

type RoleCheckboxProps = {
  role: OverwatchRole;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const RoleCheckbox = ({
  role,
  checked,
  onChange,
}: RoleCheckboxProps): ReactNode => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="relative">
        {checked ? (
          <RoleIcon role={role} color="primary" />
        ) : (
          <RoleIcon role={role} />
        )}
      </div>
    </label>
  );
};

export default RoleCheckbox;
