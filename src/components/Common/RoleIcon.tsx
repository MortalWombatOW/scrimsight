import ShieldIcon from '@mui/icons-material/Shield';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

// For rendering in the DOM
const TankIcon = () => <ShieldIcon className="role-icon" fontSize="inherit" />;

const DamageIcon = () => (
  <FormatListBulletedIcon
    className="role-icon"
    style={{
      transform: 'rotate(270deg)',
    }}
    fontSize="inherit"
  />
);

const SupportIcon = () => <LocalHospitalIcon className="role-icon" fontSize="inherit" />;

const RoleIcon = ({role}: {role: string}) => {
  switch (role) {
    case 'tank': return <TankIcon />;
    case 'damage': return <DamageIcon />;
    case 'support': return <SupportIcon />;
  }
}

export default RoleIcon;