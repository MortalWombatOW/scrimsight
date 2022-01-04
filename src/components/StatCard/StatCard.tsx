import React from 'react';
import {Dataset} from '../../lib/data/types';

type StatCardProps = {
  dataset: Dataset;
  type: 'team' | 'player';
  teamName?: string;
  playerName?: string;
};

const hero = 'zenyatta';
const imageSrc = `/public/assets/heroes/${hero}.png`;

const StatCard = (props: StatCardProps) => {
  return (
    <div className="StatCard">
      <div className="StatCard-avatar">
        {/* hero image for player */}
        {props.type === 'player' && (
          <img src={imageSrc} alt="avatar" className="StatCard-image" />
        )}
        {/* hero image for team */}
        {props.type === 'team' && (
          <img
            src="https://i.imgur.com/qJHWQQl.png"
            alt="avatar"
            className="StatCard-image"
          />
        )}
        <span className="StatCard-name">
          {props.type === 'player' && props.playerName}
          {props.type === 'team' && props.teamName}
        </span>
      </div>
      <div className="StatCard-content">
        <div className="StatCard-highlighthalfrow">
          <div className="StatCard-highlight">
            {props.type === 'player' && (
              <span className="StatCard-playername">{props.playerName}</span>
            )}
            {props.type === 'team' && (
              <span className="StatCard-teamname">{props.teamName}</span>
            )}
          </div>
          <div className="StatCard-highlight"></div>
        </div>
        <div className="StatCard-halfrow">
          <div className="StatCard-stat">
            <span className="StatCard-statname">Kills</span>
            <span className="StatCard-statvalue">{0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
