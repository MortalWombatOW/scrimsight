import React, {useMemo, useState} from 'react';
import useData from '../../hooks/useData';
import {computeMetric} from '../../lib/data/metricsv2';
import DataTable from 'react-data-table-component';
import {
  OWMap,
  PlayerInteraction,
  PlayerStatus,
  PlayerAbility,
  BaseData,
  Metric,
  MetricGroup,
  MetricValue,
} from '../../lib/data/types';
import Header from './../../components/Header/Header';
import MapsList from './../../components/MapsList/MapsList';

// On the player page, show a list of players with the following metrics:
// - Name
// - Number of maps played
// - Top played hero
// - Damage per 10 minutes
// - Healing per 10 minutes
// - Deaths per 10 minutes
// - Eliminations per 10 minutes
// - Final blows per 10 minutes
// - Average final blows per life
// - Time played

// When a player is selected, go to the player details view

const PlayerPage = () => {
  const [updateCount, setUpdateCount] = React.useState(0);
  const incrementUpdateCount = () => setUpdateCount((prev) => prev + 1);

  const [maps, mapsUpdates] = useData<OWMap>('map');
  const [interactions, updates] =
    useData<PlayerInteraction>('player_interaction');
  const [statuses, statusUpdates] = useData<PlayerStatus>('player_status');
  const [abilities, abilityUpdates] = useData<PlayerAbility>('player_ability');

  const baseData: BaseData | undefined =
    maps && interactions && statuses && abilities
      ? {
          maps,
          interactions,
          statuses,
          abilities,
        }
      : undefined;

  const playerList: string[] = [];
  const metric: Metric = {
    groups: [MetricGroup.player],
    values: [
      MetricValue.mapCount,
      MetricValue.topHero,
      MetricValue.damagePer10m,
      // MetricValue.healingPer10m,
      // MetricValue.deathsPer10m,
      // MetricValue.eliminationsPer10m,
      // MetricValue.finalBlowsPer10m,
      // MetricValue.finalBlowsPerLife,
      // MetricValue.timePlayed,
    ],
  };

  const results = useMemo(() => {
    if (baseData) {
      return computeMetric(metric, baseData);
    } else {
      return [];
    }
  }, [baseData, metric]);

  console.log(results);

  const columnDef = [
    {
      name: 'Name',
      selector: (row) => row.player,
      sortable: true,
    },
  ];

  metric.values.forEach((value) => {
    columnDef.push({
      name: MetricValue[value],
      selector: (row) => row[MetricValue[value]],
      sortable: true,
    });
  });

  return (
    <div>
      <Header
        refreshCallback={incrementUpdateCount}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      <div className="Home-container">
        <DataTable
          columns={columnDef}
          data={results}
          pointerOnHover
          highlightOnHover
          progressPending={results.length === 0}
        />
      </div>
    </div>
  );
};

export default PlayerPage;
