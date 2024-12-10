import { OverwatchRole } from "~/lib/data/hero";
import RoleCheckbox from "./RoleCheckbox";
import { FormControlLabel, FormGroup, Typography } from "@mui/material";

interface RoleControlProps {
  selectedRoles: OverwatchRole[];
  onChange: (roles: OverwatchRole[]) => void;
  size?: 'small' | 'large';
}

const RoleControl: React.FC<RoleControlProps> = ({
  selectedRoles, 
  onChange, 
  size = 'large'
}) => {
  return (
    <div>
      <Typography variant="h6">Roles</Typography>
      <FormGroup row={size === 'small'}>
        <FormControlLabel 
          control={
          <RoleCheckbox 
            role="tank" 
            checked={selectedRoles.includes('tank')} 
            onChange={(checked) => onChange(checked ? [...selectedRoles, 'tank'] : selectedRoles.filter(r => r !== 'tank'))} 
          />
        } 
        label={size === 'large' ? "Tank" : ""}
      />
      <FormControlLabel 
        control={
          <RoleCheckbox 
            role="damage" 
            checked={selectedRoles.includes('damage')} 
            onChange={(checked) => onChange(checked ? [...selectedRoles, 'damage'] : selectedRoles.filter(r => r !== 'damage'))} 
          />
        } 
        label={size === 'large' ? "Damage" : ""}
      />
      <FormControlLabel 
        control={
          <RoleCheckbox 
            role="support" 
            checked={selectedRoles.includes('support')} 
            onChange={(checked) => onChange(checked ? [...selectedRoles, 'support'] : selectedRoles.filter(r => r !== 'support'))} 
          />
        } 
          label={size === 'large' ? "Support" : ""}
        />
      </FormGroup>
    </div>
  );
};

export default RoleControl;