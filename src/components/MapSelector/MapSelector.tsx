import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import React, {useMemo} from 'react';
import {getAllPlayers, groupMapsByDate} from '../../lib/data/data';
import {BaseData} from '../../lib/data/types';
import {mapNameToFileName} from '../../lib/string';
import MapRow from '../MapRow/MapRow';
import PlayerSelector from '../PlayerSelector/PlayerSelector';

const MapSelector = ({
  data,
  current,
  setCurrent,
}: {
  data: BaseData | undefined;
  current: number[];
  setCurrent: (players: number[]) => void;
}) => {
  const groupedByTime = useMemo(() => {
    if (!data) {
      return [];
    }
    return groupMapsByDate(data.maps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  if (!data) {
    return null;
  }
  console.log('MapSelector:', current);
  return (
    <div>
      <FormGroup aria-label="position">
        <List>
          {Object.entries(groupedByTime).map(([date, maps]) => (
            <div key={date}>
              <ListSubheader component="div">{date}</ListSubheader>
              {maps.map((map) => {
                const imageSrc = mapNameToFileName(map.mapName, false);
                const formattedTimestamp = new Date(
                  map.timestamp,
                ).toLocaleString();
                return (
                  <ListItemButton
                    key={map.mapId}
                    onClick={(e) => {
                      console.log(current, map.mapId);
                      setCurrent(
                        current.includes(map.mapId)
                          ? current.filter((id) => id !== map.mapId)
                          : [...current, map.mapId],
                      );
                    }}
                    selected={current.includes(map.mapId)}>
                    {/* list icon with map image then text with team1 vs team2 /> */}
                    <ListItemIcon>
                      <Avatar
                        alt={map.mapName}
                        src={imageSrc}
                        imgProps={{
                          style: {
                            filter: `grayscale(${
                              current.includes(map.mapId) ? 0 : 1
                            })`,
                          },
                        }}
                        sx={{
                          width: current.includes(map.mapId) ? 96 : 48,
                          height: current.includes(map.mapId) ? 64 : 48,
                          borderRadius: current.includes(map.mapId) ? 4 : 32,
                          transition: 'all 0.2s ease-in-out',
                          // paddingRight: current.includes(map.mapId) ? 8 : 0,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${map.team1Name} vs ${map.team2Name}`}
                      secondary={`${map.mapName}, ${formattedTimestamp}`}
                      sx={{
                        paddingLeft: current.includes(map.mapId) ? 8 : 0,
                        fontSize: current.includes(map.mapId)
                          ? '1.2rem'
                          : '1rem',
                      }}
                    />
                  </ListItemButton>
                  // <MapRow key={map.mapId} map={map} />
                );
              })}
            </div>
          ))}
        </List>
      </FormGroup>
    </div>
  );
};

export default MapSelector;
