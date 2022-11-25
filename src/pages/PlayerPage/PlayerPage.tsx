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
import useQuery from '../../hooks/useQueries';
import alasql from 'alasql';
import './PlayerPage.scss';
import PlayerDetails from './PlayerDetails';
import {Collapse} from '@mui/material';
import useQueries from '../../hooks/useQueries';

const PlayerPage = () => {
  // const [totals, running, refresh] = useQuery(
  //   `
  //   select player, \`target\`,
  //   sum(CASE WHEN type = "damage" THEN amount ELSE 0 END) as damage,
  //   sum(CASE WHEN type = "healing" THEN amount ELSE 0 END) as healing,
  //   sum(CASE WHEN type = "elimination" THEN 1 ELSE 0 END) as eliminations,
  //   sum(CASE WHEN type = "final blow" THEN 1 ELSE 0 END) as final_blows
  //   from player_interaction
  //   group by player_interaction.player,  player_interaction.\`target\` order by damage desc
  //   `,
  // );

  // const [timeData, running2, refresh2] = useQuery(
  //   `
  //   select player, mapId, timestamp, sum(CASE WHEN type = "damage" THEN amount ELSE 0 END) as damage,
  //   sum(CASE WHEN type = "healing" THEN amount ELSE 0 END) as healing
  //   from player_interaction
  //   group by player_interaction.player,  player_interaction.mapId, player_interaction.timestamp order by damage desc
  //   `,
  // );

  // const [heroData, running3, refresh3] = useQuery(
  //   `
  //   select player, hero, count(*) as hero_time, rownum() as hero_rank
  //   from player_status
  //   group by player_status.player, player_status.hero
  //   having hero_rank <= 3
  //   `,
  // );

  // console.log('heroData', heroData);

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const [results, refresh] = useQueries([
    {
      query: `
    select player, \`target\`,
    sum(CASE WHEN type = "damage" THEN amount ELSE 0 END) as damage,
    sum(CASE WHEN type = "healing" THEN amount ELSE 0 END) as healing,
    sum(CASE WHEN type = "elimination" THEN 1 ELSE 0 END) as eliminations,
    sum(CASE WHEN type = "final blow" THEN 1 ELSE 0 END) as final_blows
    from player_interaction
    group by player_interaction.player,  player_interaction.\`target\` order by damage desc
    `,
      name: 'interactions',
    },
    {
      name: 'totals',
      query: `select
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
      deps: ['interactions', 'interactions'],
    },
  ]);

  // useEffect(() => {
  //   alasql
  //     .promise(
  //       `
  //   select
  //     a.player,
  //     avg(a.damage)*600 as damage_per_10m,
  //     avg(a.healing)*600 as healing_per_10m
  //     from ? as a group by a.player order by a.player
  //   `,
  //       [timeData],
  //     )
  //     .then((res) => {
  //       setPlayerInfo2(res);
  //     });
  // }, [timeData]);

  // useEffect(() => {
  //   alasql
  //     .promise(
  //       `
  //   select * from ? as a join ? as b on a.player = b.player order by a.player
  //   `,
  //       [playerInfo, playerInfo2],
  //     )
  //     .then((res) => {
  //       setJoined(res);
  //     });
  // }, [playerInfo, playerInfo2]);
  const [expanded, setExpanded] = useState(false);
  const columnDef =
    (results['totals'] || []).length === 0
      ? []
      : Object.keys(results['totals'][0]).map((k) => ({
          name: k,
          selector: (row) =>
            typeof row[k] == 'number' && row[k] % 1 != 0
              ? row[k].toLocaleString()
              : row[k],
          sortable: true,
        }));

  return (
    <div>
      <Header
        refreshCallback={refresh}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      <div className="Playerpage-container">
        <div className="Playerpage-left">
          <DataTable
            columns={columnDef}
            data={results['totals'] || []}
            pointerOnHover
            highlightOnHover
            progressPending={results['totals'] == undefined}
            onRowClicked={(row) => {
              setExpanded(!expanded);
              setSelectedPlayer(row.player);
            }}
          />
        </div>
        <div className={`Playerpage-right {expanded ? 'expanded' : ''}`}>
          <PlayerDetails player={selectedPlayer} />
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
