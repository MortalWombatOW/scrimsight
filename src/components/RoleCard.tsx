
import React from 'react';
import { formatDuration } from '../lib/format';
import { Role } from '../lib/ScrimsightDataModel';
import DataCard from './DataCard';
import RoleIcon from '../icons/RoleIcon';

type RoleCardProps = {
  role: Role;
  playtime: number;
};

const RoleCard: React.FC<RoleCardProps> = ({ role, playtime }) => {
  const width = 60 + Math.sqrt(playtime) * 4;

  return (
    <DataCard
      width={width}
      className="flex flex-col items-center justify-end p-2"
      backgroundColor={getRoleColor(role)}
    >
      <div className="flex items-center gap-1">
        <RoleIcon role={role} className="w-8 h-8" data-testid="role-icon" />
        <div className="font-bold text-sm capitalize">{role}</div>
      </div>
      <div className="text-xs">{formatDuration(playtime)}</div>
    </DataCard>
  );
};

const getRoleColor = (role: Role): string => {
  switch (role) {
    case 'tank':
      return '#FF6347'; // Tomato
    case 'damage':
      return '#FFD700'; // Gold
    case 'support':
      return '#3CB371'; // MediumSeaGreen
    default:
      return '#696969'; // DimGray
  }
};

export default RoleCard;
