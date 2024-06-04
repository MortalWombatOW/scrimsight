import React from 'react';
import {useDataNodes} from '../../../hooks/useData';
import {AlaSQLNode} from '../../../WombatDataFramework/DataTypes';
import {mapNameToFileName} from '../../../lib/string';
import {useMapContext} from '../context/MapContext';
import DataComponent from '../../../components/DataComponent';
import {
  TemplatedString,
  useTemplatedString,
} from '../../../components/data/common';
import {Card} from '@mui/material';

const MapImageElement = () => {
  const mapName = useTemplatedString('{{mapName}}');
  const src = mapNameToFileName(mapName, false);
  return (
    <img
      src={src}
      alt={`Image of ${mapName}`}
      style={{
        width: '100%',
        borderRadius: '5px',
      }}
    />
  );
};
const MapImage = () => {
  // const {mapId} = useMapContext();
  // const data = useDataNodes([
  //   new AlaSQLNode(
  //     'map_image_' + mapId,
  //     `SELECT
  //       match_start.mapName
  //     FROM ? AS match_start
  //     WHERE
  //       match_start.mapId = ${mapId}
  //     `,
  //     ['match_start_object_store'],
  //   ),
  // ]);

  // const overview = data['map_image_' + mapId];

  // // if (!overview || overview.length === 0) {
  // //   return <div>Loading...</div>;
  // // }

  // console.log('overview', overview);

  return (
    <div>
      <DataComponent
        fields={[
          {
            id: 'mapId',
            displayName: 'Map ID',
            type: 'categorical',
          },
          {
            id: 'mapName',
            displayName: 'Map Name',
            type: 'categorical',
          },
        ]}>
        <MapImageElement />
      </DataComponent>
    </div>
  );
};

export default MapImage;
