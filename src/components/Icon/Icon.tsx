import React from 'react';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export const TankIcon = () => (
  <ShieldIcon className="role-icon" fontSize="inherit" />
);

export const DamageIcon = () => (
  <FormatListBulletedIcon
    className="role-icon"
    style={{
      transform: 'rotate(270deg)',
    }}
    fontSize="inherit"
  />
);

export const SupportIcon = () => (
  <LocalHospitalIcon className="role-icon" fontSize="inherit" />
);

export const getIcon = (role: string) => {
  switch (role) {
    case 'tank':
      return <TankIcon />;
    case 'damage':
      return <DamageIcon />;
    case 'support':
      return <SupportIcon />;
    default:
      return <div />;
  }
};
