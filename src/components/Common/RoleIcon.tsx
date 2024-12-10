import ShieldIcon from '@mui/icons-material/Shield';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { SvgIconProps } from '@mui/material';

// For rendering in the DOM
const TankIcon = ({ color }: SvgIconProps) => (
  <ShieldIcon className="role-icon" fontSize="inherit" color={color} />
);

const DamageIcon = ({ color }: SvgIconProps) => (
  <ListAltOutlinedIcon
    className="role-icon"
    style={{
      transform: 'rotate(270deg)',
    }}
    fontSize="inherit"
    color={color}
  />
);

const SupportIcon = ({ color }: SvgIconProps) => (
  <LocalHospitalIcon className="role-icon" fontSize="inherit" color={color} />
);

interface RoleIconProps {
  role: string;
  color?: SvgIconProps['color'];
}

const RoleIcon = ({ role, color = 'inherit' }: RoleIconProps) => {
  switch (role) {
    case 'tank': return <TankIcon color={color} />;
    case 'damage': return <DamageIcon color={color} />;
    case 'support': return <SupportIcon color={color} />;
  }
}

export default RoleIcon;