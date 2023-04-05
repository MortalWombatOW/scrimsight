import React, {useEffect} from 'react';
import './PlayByPlay.scss';
import MapOverlay from '~/components/Chart/MapOverlay/MapOverlay';
// import {buildMapEntitiesFromData} from '../../lib/data/data';
import {useQuery, useResult} from '../../hooks/useQueries';
import useWindowSize from '../../hooks/useWindowSize';
import MapOverlayV2 from '../Chart/MapOverlay/MapOverlayV2';
import ThreeRenderer from '../ThreeRenderer/ThreeRenderer';
import { DataRow, getField } from '~/lib/data/logging/spec';

const PlayByPlay = ({
  mapId,
  onLoaded,
}: {
  mapId: number;
  onLoaded: () => void;
}) => {
  const {width, height} = useWindowSize();
  // const [mapList] = useData<OWMap>('map', mapId);
  // const [interactions] = useData<PlayerInteraction>(
  //   'player_interaction',
  //   mapId,
  // );
  // const [statuses] = useData<PlayerStatus>('player_status', mapId);
  // const [abilities] = useData<PlayerAbility>('player_ability', mapId);

  const [mapList, mapTick] = useQuery<DataRow>(
    {
      name: 'map_' + mapId,
      query: `SELECT * FROM ? as map WHERE mapId = ${mapId} LIMIT 1`,
      deps: ['map'],
    },
    [mapId],
  );
  const [interactions, interactionsTick] = useQuery<DataRow>(
    {
      name: 'player_interaction_' + mapId,
      query: `select * from ? as player_interaction where mapId = ${mapId}`,
      deps: ['player_interaction'],
    },
    [],
  );
  const [statuses, statusesTick] = useQuery<DataRow>(
    {
      name: 'player_status_' + mapId,
      query: `select * from ? as player_status where mapId = ${mapId}`,
      deps: ['player_status'],
    },
    [],
  );
  const [abilities, abilitiesTick] = useQuery<DataRow>(
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

  const entities = [];
  // const entities = buildMapEntitiesFromData(statuses, interactions, abilities);

  return (
    <div
      className="PlayByPlay"
      style={{
        height: height - 70,
      }}>
      {/* <MapOverlay
        map={map}
        entities={entities}
        width={width - 17}
        height={height - 144}
      /> */}
      {/* <MapOverlayV2
        entities={entities}
        width={width - 17}
        height={height - 144}
      /> */}
      <ThreeRenderer
        entities={entities}
        width={width}
        height={height - 70}
        onLoaded={onLoaded}
      />
    </div>
  );
};

export default PlayByPlay;
