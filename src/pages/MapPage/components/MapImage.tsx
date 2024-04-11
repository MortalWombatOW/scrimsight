import React from 'react';
import {useDataNodes} from '../../../hooks/useData';
import {AlaSQLNode} from '../../../WombatDataFramework/DataTypes';
import {mapNameToFileName} from '../../../lib/string';
import {useMapContext} from '../context/MapContext';

const MapImage = () => {
  const {mapId} = useMapContext();
  const data = useDataNodes([
    new AlaSQLNode(
      'map_image_' + mapId,
      `SELECT
        match_start.mapName
      FROM ? AS match_start
      WHERE
        match_start.mapId = ${mapId}
      `,
      ['match_start_object_store'],
    ),
  ]);

  const overview = data['map_image_' + mapId];

  if (!overview || overview.length === 0) {
    return <div>Loading...</div>;
  }

  console.log('overview', overview);

  return (
    <div>
      <img
        src={mapNameToFileName(overview[0].mapName, false)}
        alt={`Map ${mapId}`}
        style={{
          width: '100%',
          borderRadius: '5px',
        }}
      />
    </div>
  );
};

export default MapImage;
