import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Grid from '@mui/material/Grid';
import 'components/MapInfo/MapInfo.scss';
import {
  getHeroImage,
} from 'lib/data/data';
import {heroNameToNormalized, mapNameToFileName} from 'lib/string';
import React from 'react';
import {useQuery} from '../../hooks/useQueries';
import {groupColorClass} from '../../lib/color';

const PlayerAndHero = ({
  player,
  hero,
  selected,
}: {
  player: string;
  hero: string;
  selected: boolean;
}) => {
  return (
    <div
      className={`player ${heroNameToNormalized(hero)} ${
        selected ? 'selected' : 'unselected'
      }`}>
      <img src={getHeroImage(hero)} alt={hero} />
      <div className="name">{player}</div>
    </div>
  );
};

const MapInfo = ({
  mapId,
  selectedPlayerNames,
  setSelectedPlayerNames,
}: {
  mapId: number;
  selectedPlayerNames: string[];
  setSelectedPlayerNames: (names: string[]) => void;
}) => {
  // const [mapList] = useData<OWMap>('map', mapId);

  // const [statuses] = I<PlayerStatus>('player_status', mapId);

  // const [mapList, mapTick] = useQuery<any>(
  //   {
  //     name: 'map_' + mapId,
  //     query: `SELECT * FROM ? as map WHERE mapId = ${mapId} LIMIT 1`,
  //     deps: ['map_start'],
  //   },
  //   [mapId],
  // );

  // const [statuses, statusTick] = useQuery(
  //   {
  //     name: 'player_status_' + mapId,
  //     query: `SELECT * FROM ? as status WHERE mapId = ${mapId}`,
  //     deps: ['player_stat'],
  //   },
  //   [mapId],
  // );

  // if (!mapList || !statuses) {
    return <div>Loading...</div>;
  // }

  // if (mapList.length === 0) {
  //   return <div>No maps found</div>;
  // }

  // const playerHeroes = getHeroesByPlayer(statuses);
  // const mostCommonHeroes = getMostCommonHeroes(playerHeroes);

  // const map = mapList[0];

  // const {top, bottom} = getTeamInfoForMap(map);

  const selectPlayer = (name: string) => {
    selectedPlayerNames.push(name);
    setSelectedPlayerNames(Array.from(new Set(selectedPlayerNames)));
  };

  const unselectPlayer = (name: string) =>
    setSelectedPlayerNames(selectedPlayerNames.filter((n) => n != name));
  const isSelected = (name: string) => selectedPlayerNames.includes(name);

  // const tileCols = top.tanks.length == 2 ? 6 / 6 : 6 / 5;

  console.log(selectedPlayerNames);

  // return (
  //   <div className="MapInfo">
  //     <div
  //       className="mapname"
  //       style={{
  //         backgroundImage: ` linear-gradient(to right, grey 0%, grey 30%, transparent 35%, transparent 100%), url(${mapNameToFileName(
  //           map.mapName,
  //           false,
  //         )})`,
  //       }}>
  //       <div className="txt">{map.mapName}</div>
  //       <Grid
  //         container
  //         direction="row"
  //         alignItems="center"
  //         className="bottomtext">
  //         <InsertDriveFileIcon /> {map.fileName}
  //         <AccessTimeIcon
  //           style={{
  //             marginLeft: '1rem',
  //           }}
  //         />{' '}
  //         {new Date(map.timestamp).toLocaleString()}
  //       </Grid>
  //     </div>

      {/* <Grid container spacing={0} direction="row">
        <Grid item xs={6}>
          <div className={`team-name ${groupColorClass(top.name)}`}>
            {top.name}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={`team-name ${groupColorClass(bottom.name)}`}>
            {bottom.name}
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={0} direction="row">
        {top.tanks.map((player, index) => (
          <Grid key={index} item xs={tileCols}>
            <div
              className="player-container"
              onClick={() =>
                isSelected(player)
                  ? unselectPlayer(player)
                  : selectPlayer(player)
              }>
              <PlayerAndHero
                player={player}
                hero={mostCommonHeroes[player]}
                selected={isSelected(player)}
              />
            </div>
          </Grid>
        ))}
        {top.dps.map((player, index) => (
          <Grid key={index} item xs={tileCols}>
            <div
              className="player-container"
              onClick={() =>
                isSelected(player)
                  ? unselectPlayer(player)
                  : selectPlayer(player)
              }>
              <PlayerAndHero
                player={player}
                hero={mostCommonHeroes[player]}
                selected={isSelected(player)}
              />
            </div>
          </Grid>
        ))}
        {top.supports.map((player, index) => (
          <Grid key={index} item xs={tileCols}>
            <div
              className="player-container"
              onClick={() =>
                isSelected(player)
                  ? unselectPlayer(player)
                  : selectPlayer(player)
              }>
              <PlayerAndHero
                player={player}
                hero={mostCommonHeroes[player]}
                selected={isSelected(player)}
              />
            </div>
          </Grid>
        ))}

        {bottom.tanks.map((player, index) => (
          <Grid key={index} item xs={tileCols}>
            <div
              className="player-container"
              onClick={() =>
                isSelected(player)
                  ? unselectPlayer(player)
                  : selectPlayer(player)
              }>
              <PlayerAndHero
                player={player}
                hero={mostCommonHeroes[player]}
                selected={isSelected(player)}
              />
            </div>
          </Grid>
        ))}
        {bottom.dps.map((player, index) => (
          <Grid key={index} item xs={tileCols}>
            <div
              className="player-container"
              onClick={() =>
                isSelected(player)
                  ? unselectPlayer(player)
                  : selectPlayer(player)
              }>
              <PlayerAndHero
                player={player}
                hero={mostCommonHeroes[player]}
                selected={isSelected(player)}
              />
            </div>
          </Grid>
        ))}
        {bottom.supports.map((player, index) => (
          <Grid key={index} item xs={tileCols}>
            <div
              className="player-container"
              onClick={() =>
                isSelected(player)
                  ? unselectPlayer(player)
                  : selectPlayer(player)
              }>
              <PlayerAndHero
                player={player}
                hero={mostCommonHeroes[player]}
                selected={isSelected(player)}
              />
            </div>
          </Grid>
        ))}
      </Grid> */}
  //   </div>
  // );
};

export default MapInfo;
