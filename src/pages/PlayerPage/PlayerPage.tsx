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
import {Box, Collapse, Drawer, SwipeableDrawer} from '@mui/material';
import useQueries from '../../hooks/useQueries';
import DebugQueries from '../../components/Debug/DebugQueries';

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

  const refresh = () => {};

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const [results, tick] = useQueries(
    [
      {
        query: `
    select player, \`target\`,
    sum(CASE WHEN type = "damage" THEN amount ELSE 0 END) as damage,
    sum(CASE WHEN type = "healing" THEN amount ELSE 0 END) as healing,
    sum(CASE WHEN type = "elimination" THEN 1 ELSE 0 END) as eliminations,
    sum(CASE WHEN type = "final blow" THEN 1 ELSE 0 END) as final_blows
    from ? as player_interaction
    group by player_interaction.player,  player_interaction.\`target\` order by damage desc
    `,
        name: 'interactions',
        deps: ['player_interaction'],
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
    ],
    [],
  );

  useEffect(() => {
    console.log('tick', tick);
    console.log('foo', results);
  }, [tick]);

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
  const expanded = selectedPlayer !== null;
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
  const iOS =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div>
      <Header
        refreshCallback={refresh}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      <div className="Playerpage-container">
        {/* <Box sx={{display: 'flex'}}> */}
        <div className={`Playerpage-right ${expanded ? 'expanded' : ''}`}>
          {selectedPlayer && (
            <PlayerDetails
              player={selectedPlayer}
              setPlayer={setSelectedPlayer}
            />
          )}
        </div>
        <div className="Playerpage-left">
          <DataTable
            columns={columnDef}
            data={results['totals'] || []}
            pointerOnHover
            highlightOnHover
            progressPending={results['totals'] == undefined}
            onRowClicked={(row) => {
              setSelectedPlayer(row.player);
            }}
          />
        </div>
        {/* <Drawer
            // disableBackdropTransition={!iOS}
            // disableDiscovery={iOS}
            style={{
              position: 'inherit',
              right: undefined,
              left: undefined,
              top: undefined,
              bottom: undefined,
            }}
            ModalProps={{
              hideBackdrop: true,
            }}
            hideBackdrop
            anchor="right"
            open={expanded}
            onClose={() => setExpanded(false)}></Drawer> */}
        {/* </Box> */}
      </div>
    </div>
  );
};

export default PlayerPage;
