import { Checkbox } from "@mui/material";
import RoleIcon from "../Common/RoleIcon";
import { OverwatchRole } from "../../lib/data/hero";

type RoleCheckboxProps = {
  role: OverwatchRole;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const RoleCheckbox: React.FC<RoleCheckboxProps> = ({role, checked, onChange}) => {
  return <Checkbox icon={<RoleIcon role={role} />} checkedIcon={<RoleIcon role={role} color="primary" />} checked={checked} onChange={(e) => onChange(e.target.checked)} />;
};

export default RoleCheckbox;