import {DamageIcon, TankIcon, SupportIcon} from '~/components/Common/RoleIcons';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {mapNameToFileName} from './../../lib/string';
import {Button, Typography} from '@mui/material';
import useQueries from '~/hooks/useQueries';
interface MapRowProps {
  mapId: number;
  size: 'compact' | 'full';
  click: () => void;
}

const MapRow = (props: MapRowProps) => {
  const navigate = useNavigate();
  const {mapId, size, click} = props;

  const [results, tick, loaded] = useQueries(
    [
      {
        name: 'map_player_stats_' + mapId,
        query: `select \
          player_stat.[Map ID], \
          player_stat.[Player Name], \
          player_stat.[Player Team], \
          sum(player_stat.[Eliminations]) as [Eliminations], \
          sum(player_stat.[Deaths]) as [Deaths], \
          sum(player_stat.[All Damage Dealt]) as [All Damage Dealt], \
          sum(player_stat.[Barrier Damage Dealt]) as [Barrier Damage Dealt], \
          sum(player_stat.[Damage Taken]) as [Damage Taken], \
          sum(player_stat.[Healing Recieved]) as [Healing Recieved] \
        from player_stat \
        where player_stat.[Map ID] = ${mapId} \
        group by player_stat.[Map ID], player_stat.[Player Name], player_stat.[Player Team] \
        order by player_stat.[Map ID] asc`,
      },

      {
        name: 'map_' + mapId,
        query: `select \
          maps.[id] as [Map ID], \
          maps.[name], \
          maps.fileModified, \
          match_start.[Map Name], \
          match_start.[Map Type], \
          match_start.[Team 1 Name], \
          match_start.[Team 2 Name] \
          from maps \
          inner join match_start on match_start.[Map ID] = maps.[id] \
          where maps.[id] = ${mapId}`,
      },
    ],
    [mapId],
  );

  console.log('resultsdfs:', results);
  if (!loaded) {
    return <div>Loading...</div>;
  }

  const map = results['map_' + mapId][0];

  const timestampString = new Date(map['fileModified']).toLocaleString();
  return (
    <div onClickCapture={() => click()}>
      <div
        style={{
          gap: '8px',
          display: 'flex',
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
            marginRight: '8px',
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
              onClick={() => {
                navigate(`/review/${map['id']}`);
              }}>
              View
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapRow;
