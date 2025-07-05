import React from 'react';
import { formatDuration } from '../lib/format';
import { Hero } from '../lib/ScrimsightDataModel';
import { heroNameToNormalized } from '../lib/hero';
import DataCard from './DataCard';

type HeroCardProps = {
  hero: Hero;
  playtime: number;
};

const HeroCard: React.FC<HeroCardProps> = ({ hero, playtime }) => {
  const width = 60 + Math.sqrt(playtime) * 4;

  return (
    <DataCard
      width={width}
      className="flex flex-col items-center justify-end p-2"
      background={
        <img
          className="w-full h-full object-cover"
          src={`/assets/heroes/${heroNameToNormalized(hero)}.png`}
          alt={hero}
        />
      }
    >
      <div className="font-bold text-sm">{hero}</div>
      <div className="text-xs">{formatDuration(playtime)}</div>
    </DataCard>
  );
};

export default HeroCard;
