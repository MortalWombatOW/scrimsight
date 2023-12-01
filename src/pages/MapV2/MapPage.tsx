import React, {useState} from 'react';

import {useDataNodeOutput} from '../../hooks/useData';
import {useParams} from 'react-router-dom';
import {PlayerStatFormatted} from '../../lib/data/NodeData';
import Header from '../../components/Header/Header';
import LayoutContainer from '../../Layout/LayoutContainer';
import OverviewTimeline from '../../components/OverviewTimeline';
import DebugNodeGraph from '../../components/Debug/DebugNodeGraph';

const MapPage = () => {
  const params = useParams<{mapId: string}>();
  const mapId: string = params.mapId!;

  const stats = useDataNodeOutput<PlayerStatFormatted>(
    'player_stat_formatted',
  ).filter((stat) => stat.mapId === Number.parseInt(mapId, 10));

  console.log(mapId, stats);

  const elements = stats.map((stat) => ({
    title: stat.playerName,
    content: (
      <div>
        <div>{stat.playerHero}</div>
        <div>{stat.eliminations}</div>
        <div>{stat.deaths}</div>
        <div>{stat.allDamageDealt}</div>
        <div>{stat.healingDealt}</div>
      </div>
    ),
  }));

  return (
    <div style={{margin: '1em'}}>
      <Header filters={{}} setFilters={() => {}} />
      <DebugNodeGraph />
      <LayoutContainer
        elements={[
          {
            title: 'Timeline',
            content: <OverviewTimeline mapId={Number.parseInt(mapId, 10)} />,
          },
          ...elements,
        ]}
      />
    </div>
  );
};

export default MapPage;
