import React, {useEffect, useMemo, useState} from 'react';
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
import useQuery from '../../hooks/useQuery';
import alasql from 'alasql';
import './PlayerPage.scss';

const PlayerPage = () => {
  const [totals, running, refresh] = useQuery(
    `
    select player, \`target\`,
    sum(CASE WHEN type = "damage" THEN amount ELSE 0 END) as damage,
    sum(CASE WHEN type = "healing" THEN amount ELSE 0 END) as healing,
    sum(CASE WHEN type = "elimination" THEN 1 ELSE 0 END) as eliminations,
    sum(CASE WHEN type = "final blow" THEN 1 ELSE 0 END) as final_blows 
    from player_interaction
    group by player_interaction.player,  player_interaction.\`target\` order by damage desc
    `,
  );

  const [timeData, running2, refresh2] = useQuery(
    `
    select player, mapId, timestamp, sum(CASE WHEN type = "damage" THEN amount ELSE 0 END) as damage,
    sum(CASE WHEN type = "healing" THEN amount ELSE 0 END) as healing
    from player_interaction
    group by player_interaction.player,  player_interaction.mapId, player_interaction.timestamp order by damage desc
    `,
  );

  const [playerInfo, setPlayerInfo] = useState<
    {
      [key: string]: string | number;
    }[]
  >([]);

  const [playerInfo2, setPlayerInfo2] = useState<
    {
      [key: string]: string | number;
    }[]
  >([]);

  const [joined, setJoined] = useState<
    {
      [key: string]: string | number;
    }[]
  >([]);

  useEffect(() => {
    alasql
      .promise(
        `
    select
     a.player,
      sum(a.damage) as damage,
      sum(a.healing) as healing,
      sum(a.eliminations) as eliminations,
      sum(a.final_blows) as final_blows,
      sum(b.damage) as damage_taken,
      sum(b.healing) as healing_taken,
      sum(b.final_blows) as deaths,
      sum(a.final_blows) / sum(b.final_blows) as kdr
     from ? as a join ? as b on a.player = b.\`target\` group by a.player order by a.player
    `,
        [totals, totals],
      )
      .then((res) => {
        setPlayerInfo(res);
      });
  }, [totals]);

  useEffect(() => {
    alasql
      .promise(
        `
    select
      a.player,
      avg(a.damage)*600 as damage_per_10m,
      avg(a.healing)*600 as healing_per_10m
      from ? as a group by a.player order by a.player
    `,
        [timeData],
      )
      .then((res) => {
        setPlayerInfo2(res);
      });
  }, [timeData]);

  useEffect(() => {
    alasql
      .promise(
        `
    select * from ? as a join ? as b on a.player = b.player
    `,
        [playerInfo, playerInfo2],
      )
      .then((res) => {
        setJoined(res);
      });
  }, [playerInfo, playerInfo2]);

  const columnDef =
    joined.length == 0
      ? []
      : Object.keys(joined[0]).map((k) => ({
          name: k,
          selector: (row) =>
            typeof row[k] == 'number' && row[k] % 1 != 0
              ? row[k].toFixed(2)
              : row[k],
          sortable: true,
        }));

  return (
    <div className="Playerpage-container">
      <Header
        refreshCallback={refresh}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      <div className="Home-container">
        <DataTable
          columns={columnDef}
          data={joined}
          pointerOnHover
          highlightOnHover
          progressPending={running}
        />
      </div>
    </div>
  );
};

export default PlayerPage;
