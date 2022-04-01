import React from 'react';
import useData from 'hooks/useData';
import {
  OWMap,
  PlayerAbility,
  PlayerInteraction,
  PlayerStatus,
} from 'lib/data/types';
import './PlayByPlay.scss';
import MapOverlay from '~/components/Chart/MapOverlay/MapOverlay';
import {buildMapEntitiesFromData} from '../../lib/data/data';

const PlayByPlay = ({mapId}: {mapId: number}) => {
  const [mapList] = useData<OWMap>('map', mapId);
  const [interactions] = useData<PlayerInteraction>(
    'player_interaction',
    mapId,
  );
  const [statuses] = useData<PlayerStatus>('player_status', mapId);
  const [abilities] = useData<PlayerAbility>('player_ability', mapId);

  if (!mapList || !statuses || !interactions || !abilities) {
    return <div>Loading...</div>;
  }

  const map = mapList[0].mapName;
  const entities = buildMapEntitiesFromData(statuses, interactions, abilities);
  //     {
  //       id: 'test',
  //       label: 'test',
  //       clazz: 'ana',
  //       image: 'https://d1u1mce87gyfbn.cloudfront.net/hero/ana/icon-portrait.png',
  //       states: [
  //         {
  //           x: 0,
  //           y: 0,
  //         },
  //       ],
  //     },
  //   ];

  return (
    <div className="PlayByPlay">
      <MapOverlay map={map} entities={entities} width={1800} height={600} />
    </div>
  );
};

export default PlayByPlay;
