import {DamageIcon, TankIcon, SupportIcon} from '~/components/Common/RoleIcons';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {mapNameToFileName} from './../../lib/string';
import {DataRow, logSpec} from 'lib/data/logging/spec';
import {Button, Typography} from '@mui/material';
import {QueryBuilder} from '~/lib/data/QueryBuilder';
import useQueries from '~/hooks/useQueries';
interface MapRowProps {
  mapId: number;
  size: 'compact' | 'full';
  click: () => void;
}

const MapRow = (props: MapRowProps) => {
  const navigate = useNavigate();
  const {mapId, size, click} = props;
  console.log('size:', size);

  const [results, tick, allLoaded] = useQueries(
    [
      {
        name: 'map_player_stats_' + mapId,
        query: new QueryBuilder()
          .select([
            {table: 'player_stat', field: 'Map ID'},
            {table: 'player_stat', field: 'Player Name'},
            {table: 'player_stat', field: 'Player Team'},
            {
              aggregation: 'sum',
              value: {table: 'player_stat', field: 'Eliminations'},
              as: 'Eliminations',
            },
            {
              aggregation: 'sum',
              value: {table: 'player_stat', field: 'Deaths'},
              as: 'Deaths',
            },
            {
              aggregation: 'sum',
              value: {table: 'player_stat', field: 'All Damage Dealt'},
              as: 'All Damage Dealt',
            },
            {
              aggregation: 'sum',
              value: {table: 'player_stat', field: 'Barrier Damage Dealt'},
              as: 'Barrier Damage Dealt',
            },
            {
              aggregation: 'sum',
              value: {table: 'player_stat', field: 'Damage Taken'},
              as: 'Damage Taken',
            },
            {
              aggregation: 'sum',
              value: {table: 'player_stat', field: 'Healing Recieved'},
              as: 'Healing Recieved',
            },
          ])
          .from([
            {
              field: 'id',
              table: 'player_stat',
            },
          ])
          .groupBy([
            {table: 'player_stat', field: 'Map ID'},
            {table: 'player_stat', field: 'Player Name'},
            {table: 'player_stat', field: 'Player Team'},
          ])
          .orderBy([
            {
              value: {
                field: 'Map ID',
                table: 'player_stat',
              },
              order: 'asc',
            },
          ])
          .where([
            {
              field: {
                field: 'Map ID',
                table: 'player_stat',
              },
              operator: '=',
              value: mapId,
            },
          ]),
      },
      {
        name: 'map_' + mapId,
        query: new QueryBuilder()

          .select([
            {table: 'maps', field: 'fileModified'},
            {table: 'maps', field: 'name'},
          ])
          .from([
            {
              field: 'id',
              table: 'maps',
            },
          ])
          .addAllFromSpec(logSpec['match_start'], 'Map ID')
          .where([
            {
              field: {
                field: 'id',
                table: 'maps',
              },
              operator: '=',
              value: mapId,
            },
          ]),
      },
    ],
    [mapId],
  );

  console.log('results:', results);
  if (!allLoaded()) {
    return <div>Loading...</div>;
  }

  const playerStats = results['map_player_stats_' + mapId];
  const map = results['map_' + mapId][0];

  const timestampString = new Date(map['fileModified']).toLocaleString();
  // const {top, bottom} = getTeamInfoForMap(map);
  return (
    <div
      onClickCapture={() => click()}
      style={{
        display: 'inline-block',
        borderBottom: '1px solid #ccc',
        padding: '8px',
      }}>
      <div
        style={{
          gap: '8px',

          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <img
          src={mapNameToFileName(map['Map Name'], false)}
          alt={map['Map Name']}
          style={{
            height: size === 'compact' ? '75px' : '150px',
            width: size === 'compact' ? '75px' : '150px',
            transition: 'all 0.3s ease',
            objectFit: 'cover',
            borderRadius: '4px',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '8px',
          }}>
          <Typography variant={size === 'compact' ? 'subtitle1' : 'h3'}>
            {map['name']}
          </Typography>
          <Typography variant="subtitle2">
            {map['Map Name']} ({map['Map Type']})
          </Typography>
          <Typography variant="subtitle2">{timestampString}</Typography>
          {/* <Typography variant="body1">{map['Players'].join(', ')}</Typography> */}
        </div>
        {size === 'full' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/review/${map['id']}`)}>
              View
            </Button>
          </div>
        )}
      </div>
    </div>
  );
  // return (
  //   <button className="MapRow" onClick={() => navigate(`/review/${map.mapId}`)}>
  //     <div className="MapRow-image">
  //       <img src={imageSrc} alt={map.mapName} />
  //     </div>

  //     <div className="MapRow-teams-col">
  //       <div className="MapRow-teams-row">{top.name}</div>
  //       <div className="MapRow-teams-row">{bottom.name}</div>
  //     </div>
  //     <div className="MapRow-teams-col">
  //       <div className="MapRow-teams-row">
  //         <div className="MapRow-player">
  //           <TankIcon />
  //           <span className="MapRow-playername">{top.tanks[0]}</span>
  //         </div>
  //         <div className="MapRow-player">
  //           <TankIcon />
  //           <span className="MapRow-playername">{top.tanks[1]}</span>
  //         </div>
  //       </div>
  //       <div className="MapRow-teams-row">
  //         <div className="MapRow-player MapRow-topmargin">
  //           <TankIcon />
  //           <span className="MapRow-playername">{bottom.tanks[0]}</span>
  //         </div>
  //         <div className="MapRow-player">
  //           <TankIcon />
  //           <span className="MapRow-playername">{bottom.tanks[1]}</span>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="MapRow-teams-col">
  //       <div className="MapRow-teams-row">
  //         <div className="MapRow-player">
  //           <DamageIcon />
  //           <span className="MapRow-playername">{top.dps[0]}</span>
  //         </div>
  //         <div className="MapRow-player">
  //           <DamageIcon />
  //           <span className="MapRow-playername">{top.dps[1]}</span>
  //         </div>
  //       </div>
  //       <div className="MapRow-teams-row">
  //         <div className="MapRow-player MapRow-topmargin">
  //           <DamageIcon />
  //           <span className="MapRow-playername">{bottom.dps[0]}</span>
  //         </div>
  //         <div className="MapRow-player">
  //           <DamageIcon />
  //           <span className="MapRow-playername">{bottom.dps[1]}</span>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="MapRow-teams-col">
  //       <div className="MapRow-teams-row">
  //         <div className="MapRow-player">
  //           <SupportIcon />
  //           <span className="MapRow-playername">{top.supports[0]}</span>
  //         </div>
  //         <div className="MapRow-player">
  //           <SupportIcon />
  //           <span className="MapRow-playername">{top.supports[1]}</span>
  //         </div>
  //       </div>
  //       <div className="MapRow-teams-row">
  //         <div className="MapRow-player MapRow-topmargin">
  //           <SupportIcon />
  //           <span className="MapRow-playername">{bottom.supports[0]}</span>
  //         </div>
  //         <div className="MapRow-player">
  //           <SupportIcon />
  //           <span className="MapRow-playername">{bottom.supports[1]}</span>
  //         </div>
  //       </div>
  //     </div>
  //   </button>
  // );
};

export default MapRow;
