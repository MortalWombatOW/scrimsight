
import React from 'react';
import DataCard from './DataCard';
import { getColorgoricalWithAlt } from '../lib/color';

type TeamCardProps = {
  teamName: string;
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const TeamCard: React.FC<TeamCardProps> = ({ teamName }) => {
  const [mainColor, altColor] = React.useMemo(() => getColorgoricalWithAlt(teamName), [teamName]);
  const initials = getInitials(teamName);

  return (
    <DataCard
      width={120} // Fixed width for team cards
      height={120}
      backgroundColor={mainColor}
      className="flex flex-col justify-between items-center p-2"
    >
      <div className="flex-grow flex items-center justify-center">
        <span className="font-bold text-4xl" style={{ color: altColor }}>
          {initials}
        </span>
      </div>
      <div className="text-xs text-center" style={{ color: altColor }}>
        {teamName}
      </div>
    </DataCard>
  );
};

export default TeamCard;
