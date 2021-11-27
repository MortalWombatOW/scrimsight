import React from 'react';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export const TankIcon = () => <ShieldIcon className="role-icon" />;

export const DamageIcon = () => (
  <FormatListBulletedIcon
    className="role-icon"
    style={{
      transform: 'rotate(270deg)',
    }}
  />
);

export const SupportIcon = () => <LocalHospitalIcon className="role-icon" />;
