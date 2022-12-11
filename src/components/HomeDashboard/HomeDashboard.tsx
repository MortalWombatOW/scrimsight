import React from 'react';
import CardCarousel from '../Card/CardCarousel';
import PlayerSummaryCard from '../Card/PlayerSummaryCard';

const HomeDashboard = () => {
  const width = window.innerWidth;
  console.log('width: ', width);
  return (
    <div>
      <CardCarousel width={width} childSpacing={10}>
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
        <PlayerSummaryCard playerName="Player Name" />
      </CardCarousel>
    </div>
  );
};

export default HomeDashboard;
