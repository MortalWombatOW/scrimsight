import RoleIcon from "../Common/RoleIcon";
import { OverwatchRole } from "../../lib";

type RoleCheckboxProps = {
  role: OverwatchRole;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const RoleCheckbox: React.FC<RoleCheckboxProps> = ({
  role,
  checked,
  onChange,
}) => {
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
