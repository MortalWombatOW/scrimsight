import React, {useState} from 'react';

import {useParams} from 'react-router-dom';
import {PlayerStatFormatted} from '../../lib/data/NodeData';
import Header from '../../components/Header/Header';
import LayoutContainer from '../../Layout/LayoutContainer';
import OverviewTimeline from '../../components/OverviewTimeline';
import DebugNodeGraph from '../../components/Debug/DebugNodeGraph';
import {AlaSQLNode} from '../../WombatDataFramework/DataTypes';
import {useDataNodes} from '../../hooks/useData';

const MapPage = () => {
  const {player_stat_formatted} = useDataNodes([
    new AlaSQLNode<PlayerStatFormatted>(
      'player_stat_formatted',
      `SELECT
        player_stat.mapId,
        player_stat.roundNumber,
        player_stat.playerTeam,
        player_stat.playerName,
        player_stat.playerHero,
        player_stat.eliminations,
        player_stat.finalBlows,
        player_stat.deaths,
        player_stat.allDamageDealt,
        player_stat.barrierDamageDealt,
        player_stat.heroDamageDealt,
        player_stat.healingDealt,
        player_stat.healingReceived,
        player_stat.selfHealing,
        player_stat.damageTaken,
        player_stat.damageBlocked,
        player_stat.defensiveAssists,
        player_stat.offensiveAssists,
        player_stat.ultimatesEarned,
        player_stat.ultimatesUsed,
        player_stat.multikillBest,
        player_stat.multikills,
        player_stat.soloKills,
        player_stat.objectiveKills,
        player_stat.environmentalKills,
        player_stat.environmentalDeaths,
        player_stat.criticalHits,
        player_stat.criticalHitAccuracy,
        player_stat.scopedAccuracy,
        player_stat.scopedCriticalHitAccuracy,
        player_stat.scopedCriticalHitKills,
        player_stat.shotsFired,
        player_stat.shotsHit,
        player_stat.shotsMissed,
        player_stat.scopedShotsFired,
        player_stat.scopedShotsHit,
        player_stat.weaponAccuracy,
        player_stat.heroTimePlayed
      FROM ? AS player_stat
      ORDER BY
        player_stat.mapId,
        player_stat.roundNumber,
        player_stat.playerTeam,
        player_stat.playerName,
        player_stat.heroTimePlayed desc,
        player_stat.playerHero`,
      ['player_stat_object_store'],
    ),
  ]);

  const params = useParams<{mapId: string}>();
  const mapId: string = params.mapId!;

  // const stats = useDataNodeOutput<PlayerStatFormatted>(
  //   'player_stat_formatted',
  // ).filter((stat) => stat.mapId === Number.parseInt(mapId, 10));

  console.log('player_stat_formatted', player_stat_formatted);
  if (player_stat_formatted === undefined) {
    return <div>Loading...</div>;
  }

  console.log(mapId, player_stat_formatted);

  const elements = player_stat_formatted.map((stat) => ({
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
      <OverviewTimeline mapId={Number.parseInt(mapId, 10)} />
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
