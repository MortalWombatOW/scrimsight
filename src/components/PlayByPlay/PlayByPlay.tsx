import React from 'react';
import {
  OWMap,
  PlayerAbility,
  PlayerInteraction,
  PlayerStatus,
} from 'lib/data/types';
import './PlayByPlay.scss';
import MapOverlay from '~/components/Chart/MapOverlay/MapOverlay';
import {buildMapEntitiesFromData} from '../../lib/data/data';
import {useQuery, useResult} from '../../hooks/useQueries';
import useWindowSize from '../../hooks/useWindowSize';
import MapOverlayV2 from '../Chart/MapOverlay/MapOverlayV2';

const PlayByPlay = ({mapId}: {mapId: number}) => {
  const {width, height} = useWindowSize();
  // const [mapList] = useData<OWMap>('map', mapId);
  // const [interactions] = useData<PlayerInteraction>(
  //   'player_interaction',
  //   mapId,
  // );
  // const [statuses] = useData<PlayerStatus>('player_status', mapId);
  // const [abilities] = useData<PlayerAbility>('player_ability', mapId);

  const [mapList, mapTick] = useQuery<OWMap>(
    {
      name: 'map_' + mapId,
      query: `SELECT * FROM ? as map WHERE mapId = ${mapId} LIMIT 1`,
      deps: ['map'],
    },
    [mapId],
  );
  const [interactions, interactionsTick] = useQuery<PlayerInteraction>(
    {
      name: 'player_interaction_' + mapId,
      query: `select * from ? as player_interaction where mapId = ${mapId}`,
      deps: ['player_interaction'],
    },
    [],
  );
  const [statuses, statusesTick] = useQuery<PlayerStatus>(
    {
      name: 'player_status_' + mapId,
      query: `select * from ? as player_status where mapId = ${mapId}`,
      deps: ['player_status'],
    },
    [],
  );
  const [abilities, abilitiesTick] = useQuery<PlayerAbility>(
    {
      name: 'player_ability_' + mapId,
      query: `select * from ? as player_ability where mapId = ${mapId}`,
      deps: ['player_ability'],
    },
    [],
  );

  console.log('mapList', mapList);
  console.log('interactions', interactions);
  console.log('statuses', statuses);
  console.log('abilities', abilities);

  if (!mapList || !statuses || !interactions || !abilities) {
    return <div>Loading...</div>;
  }

  if (mapList.length === 0) {
    return <div>No maps found</div>;
  }

  const map = mapList[0].mapName;
  const entities = buildMapEntitiesFromData(statuses, interactions, abilities);
  // //     {
  // //       id: 'test',
  // //       label: 'test',
  // //       clazz: 'ana',
  // //       image: 'https://d1u1mce87gyfbn.cloudfront.net/hero/ana/icon-portrait.png',
  // //       states: [
  // //         {
  // //           x: 0,
  // //           y: 0,
  // //         },
  // //       ],
  // //     },
  // //   ];

  return (
    <div className="PlayByPlay">
      {/* <MapOverlay
        map={map}
        entities={entities}
        width={width - 17}
        height={height - 144}
      /> */}
      <MapOverlayV2
        entities={entities}
        width={width - 17}
        height={height - 144}
      />
    </div>
  );
};

export default PlayByPlay;
