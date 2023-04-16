import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Grid from '@mui/material/Grid';
import 'components/MapInfo/MapInfo.scss';
import {
  getHeroImage,
} from 'lib/data/data';
import {heroNameToNormalized, mapNameToFileName} from 'lib/string';
import React, { useEffect, useMemo } from 'react';
import useQueries, {useQuery} from '../../hooks/useQueries';
import {groupColorClass} from '../../lib/color';
import { QueryBuilder } from '~/lib/data/QueryBuilder';
import { DataRow, logSpec } from '~/lib/data/logging/spec';
import { Typography } from '@mui/material';

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
  const result = useQueries([
    // z
    // {
    //   name: 'map_info_' + mapId,
    //   query: new QueryBuilder()
    //   .select([
    //     {table: 'maps', field: 'id'},
    //     {table: 'maps', field: 'name'},
    //     {table: 'maps', field: 'fileModified'},
    //   ])
    //   .from([
    //     {
    //       table: 'maps',
    //       field: 'id',
    //     },
    //   ])
    //   .addAllFromSpec(logSpec['match_start'], "Map ID")
    //   .where([{
    //     operator: '=',
    //     field: {table: 'maps', field: 'id'},
    //     value: mapId,
    //   }]),
    // },
    {
      name: 'kills_' + mapId,
      query: new QueryBuilder()
      .addAllFromSpec(logSpec['kill'], "Map ID")
      .where([{
        operator: '=',
        field: {table: 'kill', field: 'Map ID'},
        value: mapId,
      }]),
    },
    {
      name: 'objective_captured_' + mapId,
      query: new QueryBuilder()
      .addAllFromSpec(logSpec['objective_captured'], "Map ID")
      .where([{
        operator: '=',
        field: {table: 'objective_captured', field: 'Map ID'},
        value: mapId,
      }]),
    },
    {
      name: 'round_end_' + mapId,
      query: new QueryBuilder()
      .addAllFromSpec(logSpec['round_end'], "Map ID")
      .where([{
        operator: '=',
        field: {table: 'round_end', field: 'Map ID'},
        value: mapId,
      }]),
    },  


  ], [mapId]);

  console.log(result);

   

  // const map = result[0]['map_info_' + mapId][0];


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

 
  const sortedEvents = useMemo (() => {
    if (!result[2]) {
      return [];
    }
    const queryNames = Object.keys(result[0]);
    console.log('queryNames', queryNames);
    const arr: object[] = [];
    const counters = {};
    for (const queryName of queryNames) {
      counters[queryName] = 0;
    }
    while (true) {
      let minTime = Infinity;
      let minQueryName: string | null = null;
      for (const queryName of queryNames) {
        if (counters[queryName] >= result[0][queryName].length) {
          continue;
        }
        const entry = result[0][queryName][counters[queryName]];
        const time = entry['Match Time'];
        if (time < minTime) {
          minTime = time;
          minQueryName = queryName;
        }
      }
      if (minQueryName === null) {
        break;
      }
      const minEntry = result[0][minQueryName][counters[minQueryName]];
      arr.push(minEntry);
      counters[minQueryName]++;
    }
    return arr;
  }, [result[1]]);

  console.log(sortedEvents);

  if (!result[2]) {
    return <div>Loading...</div>;
  }

  return (
    <div className="MapInfo">

    </div>
  );
};

export default MapInfo;
