// import React, {useEffect, useMemo} from 'react';
// // import {groupMapsByDate} from '../../lib/data/data';
// import MapRow from '../MapRow/MapRow';
// import {Button, Typography} from '@mui/material';
// import Uploader from '~/components/Uploader/Uploader';
// import {QueryBuilder} from '~/lib/data/QueryBuilder';
// import MapInfo from '~/components/MapInfo/MapInfo';

// type MapsListProps = {
//   onLoaded: () => void;
//   onMapSelected: (mapId: number | undefined) => void;
// };

// const MapsList = ({onLoaded, onMapSelected}: MapsListProps) => {
//   const [{MapsList_allMaps}, tick, loaded] = useQueries(
//     [
//       {
//         name: 'MapsList_allMaps',
//         query: `select * from maps order by fileModified desc`,
//       },
//     ],
//     [],
//   );

//   const maps = useMemo(() => {
//     if (!MapsList_allMaps) {
//       return [];
//     }
//     return Object.values(MapsList_allMaps).map((map) => Object.values(map)[0]);
//   }, [tick]);

//   console.log('results:', maps, tick, loaded);
//   const [selectedId, setSelectedId] = React.useState<number | null>(null);

//   useEffect(() => {
//     onMapSelected(selectedId === null ? undefined : maps[selectedId]['id']);
//   }, [selectedId]);

//   if (!loaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
//       <Typography variant="h3">Your Maps</Typography>
//       <div style={{display: 'flex', gap: '8px'}}>
//         <Uploader refreshCallback={() => {}} />
//         <Button variant="contained" color="secondary">
//           Search
//         </Button>
//       </div>
//       <divz
//         style={{
//           display: 'inline-block',
//         }}>
//         {maps
//           .filter((map, i) => selectedId === null || i === selectedId)
//           .map((map, i) => (
//             <Button
//               key={map['id']}
//               variant="outlined"
//               style={{
//                 padding: '0px',
//               }}>
//               <MapRow
//                 key={map['id']}
//                 mapId={map['id']}
//                 size={'compact'}
//                 click={() => setSelectedId(i === selectedId ? null : i)}
//               />
//             </Button>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default MapsList;
