import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Header from '../../components/Header/Header';
import useData from './../../hooks/useData';
import {
  OWMap,
  PlayerStatus,
  PlayerAbility,
  PlayerInteraction,
  Dataset,
} from '../../lib/data/types';
import {useParams} from 'react-router-dom';
import MapOverlay from './../../components/Chart/MapOverlay';
import Histogram from '../../components/Chart/Histogram';
import {getIcon} from './../../components/Icon/Icon';
import CircularProgress from '@mui/material/CircularProgress';
import {getPlayer} from '../../lib/data/data';
import Checkbox from '@mui/material/Checkbox';
import ReportBuilder from './../../components/ReportBuilder/ReportBuilder';
import DataTable from '../../components/Table/DataTable';
import DisplayControl from './../../components/Display/DisplayControl';
import DataPlot from '../../components/Chart/DataPlot';
import {Button} from '@mui/material';
import StatCard from '../../components/StatCard/StatCard';
const Map = () => {
  const {mapId} = useParams();
  const [mapList, mapUpdates] = useData<OWMap>(
    'map',
    Number.parseInt(mapId, 10),
  );
  const [timeBounds, setBounds] = useState<
    [number | undefined, number | undefined]
  >([undefined, undefined]);
  // console.log(timeBounds);

  const timeFilter = (time: number) => {
    if (timeBounds[0] === undefined) {
      return true;
    }
    if (timeBounds[1] === undefined) {
      return time >= timeBounds[0];
    }
    return time >= timeBounds[0] && time <= timeBounds[1];
  };
  const [playerFilters, setPlayerFilters] = useState<string[]>([]);
  const togglePlayerFilter = (player: string) => {
    if (playerFilters.includes(player)) {
      setPlayerFilters(playerFilters.filter((p) => p !== player));
    } else {
      setPlayerFilters([...playerFilters, player]);
    }
  };

  const playerFilter = (player: string) =>
    playerFilters.length === 0 || playerFilters.includes(player);

  const statusFilterCallback = useCallback(
    (status: PlayerStatus) =>
      playerFilter(status.player) && timeFilter(status.timestamp),
    [JSON.stringify(playerFilters), JSON.stringify(timeBounds)],
  );

  const abilityFilterCallback = useCallback(
    (ability: PlayerAbility) =>
      playerFilter(ability.player) && timeFilter(ability.timestamp),
    [JSON.stringify(playerFilters), JSON.stringify(timeBounds)],
  );

  const interactionFilterCallback = useCallback(
    (interaction: PlayerInteraction) =>
      playerFilter(interaction.player) && timeFilter(interaction.timestamp),
    [JSON.stringify(playerFilters), JSON.stringify(timeBounds)],
  );

  const [statuses, filteredStatuses, statusUpdates] = useData<PlayerStatus>(
    'player_status',
    Number.parseInt(mapId),
    statusFilterCallback,
  );

  const [abilities, filteredAbilities, abilityUpdates] = useData<PlayerAbility>(
    'player_ability',
    Number.parseInt(mapId),
    abilityFilterCallback,
  );

  const [interactions, filteredInteractions, interactionUpdates] =
    useData<PlayerInteraction>(
      'player_interaction',
      Number.parseInt(mapId),
      interactionFilterCallback,
    );

  const dataUpdates = Math.floor(
    (statusUpdates + abilityUpdates + interactionUpdates) / 3,
  );

  console.log(statusUpdates, abilityUpdates, interactionUpdates);

  const [dataset, setDataset] = useState<Dataset | undefined>(undefined);

  const [displayMode, setDisplayMode] = useState<string>('table');

  if (!mapList || !statuses || !abilities || !interactions) {
    console.log(
      `Loading - ${!mapList} ${!statuses} ${!abilities} ${!interactions} ${!dataset}`,
    );
    return (
      <div className="Map">
        <Header />
        <div className="Map-container">
          <CircularProgress />
        </div>
      </div>
    );
  }

  const map = mapList[0];

  const rows: [
    ['team1' | 'team2', 'tank' | 'support' | 'damage', 0 | 1],
    ['team1' | 'team2', 'tank' | 'support' | 'damage', 0 | 1],
  ][] = [
    [
      ['team1', 'tank', 0],
      ['team2', 'tank', 0],
    ],
    [
      ['team1', 'tank', 1],
      ['team2', 'tank', 1],
    ],
    [
      ['team1', 'damage', 0],
      ['team2', 'damage', 0],
    ],
    [
      ['team1', 'damage', 1],
      ['team2', 'damage', 1],
    ],
    [
      ['team1', 'support', 0],
      ['team2', 'support', 0],
    ],
    [
      ['team1', 'support', 1],
      ['team2', 'support', 1],
    ],
  ];

  return (
    <div className="Map">
      <Header />
      <div className="Map-container">
        <div className="Map-toprow">
          <div className="Map-info">
            <span className="Map-title">{map.mapName} - </span>
            <span className="Map-description">
              {new Date(map.timestamp).toLocaleString()}
              {' - '}
              {map.mapId}
              {' - '}
              {map.fileName}
            </span>
            <ReportBuilder
              maps={[map]}
              status={filteredStatuses}
              abilities={filteredAbilities}
              interactions={filteredInteractions}
              dataCallback={(data) => setDataset(data)}
              updateInd={dataUpdates}
            />
            <table>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td className="right">
                      {getPlayer(map, row[0][0], row[0][1], row[0][2])}
                    </td>
                    <td>
                      <Checkbox
                        icon={getIcon(row[0][1])}
                        checkedIcon={getIcon(row[0][1])}
                        onChange={() => {
                          togglePlayerFilter(
                            getPlayer(map, row[0][0], row[0][1], row[0][2]),
                          );
                        }}
                      />
                    </td>
                    <td>
                      <Checkbox
                        icon={getIcon(row[1][1])}
                        checkedIcon={getIcon(row[1][1])}
                        onChange={() => {
                          togglePlayerFilter(
                            getPlayer(map, row[1][0], row[1][1], row[1][2]),
                          );
                        }}
                      />
                    </td>
                    <td>{getPlayer(map, row[1][0], row[1][1], row[1][2])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="Map-display">
            <DisplayControl
              dataset={dataset}
              setMode={(str) => setDisplayMode(str)}
              currentMode={displayMode}
            />
            {displayMode === 'table' && <DataTable dataset={dataset} />}
            {displayMode === 'map' && (
              <MapOverlay
                map={map.mapName}
                data={[[0, 0, 0]]}
                width={1000}
                height={800}
              />
            )}
            {displayMode === 'chart' && (
              <DataPlot dataset={dataset} width={1000} height={800} />
            )}
            {displayMode === 'card' && (
              <StatCard
                dataset={dataset}
                type={'player'}
                playerName={statuses[0].player}
              />
            )}
          </div>
        </div>
        <div className="Map-timeline">
          <Histogram
            data={interactions.map((interaction) => interaction.timestamp)}
            width={1200}
            height={100}
            bins={200}
            onSelectionChange={(min, max) => {
              setBounds([min, max]);
            }}
          />
          <Button
            onClick={() => setBounds([undefined, undefined])}
            variant="outlined">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Map;
