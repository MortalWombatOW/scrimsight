import {Box, CircularProgress, IconButton, Typography} from '@mui/material';
import React, {useEffect, useMemo, useState} from 'react';
import DataTable from 'react-data-table-component';
import {ResponsiveContainer, PieChart, Pie} from 'recharts';
import MetricCard from '../../components/Card/MetricCard';
import PieChartComponent from '../../components/Component/PieChartComponent';
import useQueries from '../../hooks/useQueries';
import {getHeroImage, heroToRoleTable} from '../../lib/data/data';
import ResultCache from '../../lib/data/ResultCache';
import CloseIcon from '@mui/icons-material/Close';
import IconAndText from '../../components/Common/IconAndText';
import {
  DamageIcon,
  getIcon,
  SupportIcon,
  TankIcon,
} from '../../components/Icon/Icon';
import {DataRow} from '../../lib/data/types';
import QueryCard from '../../components/Card/QueryCard';
import {format, formatTime, safeDivide} from '../../lib/data/metricsv3';
import QueryText from '../../components/Card/QueryText';
const sum = (
  agg: string,
  type: string,
  player: string | null,
  column?: string,
) =>
  `sum(case when type = '${type}' and player = '${player}' then ${agg} else 0 end) as ${
    column || type
  }`;

const PlayerDetails = ({
  player,
  setPlayer,
}: {
  player: string | null;
  setPlayer: (player: string | null) => void;
}) => {
  const [results, tick] = useQueries(
    [
      {
        name: 'top_heroes_' + player,
        query: `select hero, count(*) as hero_time from ? where player = '${player}' and hero != '' group by hero order by hero_time desc`,
        deps: ['player_status'],
      },
      {
        name: 'roles_' + player,
        query: `select hero_roles.role, sum(top_heroes.hero_time)/60/60 as role_time, (select sum(hero_time)/60/60 from ? as top_heroes) as total_time from ? as top_heroes join ? as hero_roles on top_heroes.hero = hero_roles.hero group by hero_roles.role order by role_time desc`,
        deps: ['top_heroes_' + player, 'top_heroes_' + player, heroToRoleTable],
      },
      {
        name: 'damage_dealt_' + player,
        query: `select mapId, timestamp, \`target\`, sum(amount) as damage from ? where player = '${player}' and type = 'damage' group by mapId, timestamp, \`target\``,
        deps: ['player_interaction'],
      },
      {
        name: 'map_length',
        query: `select mapId, max(timestamp) - min(timestamp) as map_length from ? group by mapId`,
        deps: ['player_status'],
      },
      // {
      //   name: 'player_heroes_per_timestamp_per_map',
      //   query: `select mapId, timestamp, player, hero, hero_roles.role from ? as player_status join ? as hero_roles on player_status.hero = hero_roles.hero`,
      //   deps: ['player_status', heroToRoleTable],
      // },
      // {
      //   name: 'hero_damage_total_' + player,
      //   query: `select player_heroes_per_timestamp_per_map.role, sum(damage_dealt.damage) as damage, (select sum(damage) from ?) as total_damage from ? as damage_dealt join ? as player_heroes_per_timestamp_per_map on damage_dealt.mapId = player_heroes_per_timestamp_per_map.mapId and damage_dealt.timestamp = player_heroes_per_timestamp_per_map.timestamp and damage_dealt.\`target\` = player_heroes_per_timestamp_per_map.player group by player_heroes_per_timestamp_per_map.role order by damage desc`,
      //   deps: [
      //     'damage_dealt_' + player,
      //     'damage_dealt_' + player,
      //     'player_heroes_per_timestamp_per_map',
      //   ],
      // },
      {
        name: 'per_map_' + player,
        query: `select mapId, ${sum('amount', 'damage', player)}, ${sum(
          'amount',
          'healing',
          player,
        )}, ${sum('1', 'elimination', player, 'eliminations')}, ${sum(
          '1',
          'final blow',
          player,
          'final_blows',
        )} from ? group by mapId`,
        deps: ['player_interaction'],
      },
      {
        name: 'player_stats_' + player,
        query: `select sum(per_map_${player}.damage) as damage ,
        sum(per_map_${player}.healing) as healing,
        sum(per_map_${player}.eliminations) as eliminations,
        sum(per_map_${player}.final_blows) as final_blows
        from ? as per_map_${player}`,
        deps: ['per_map_' + player],
      },
      {
        name: 'playtime_' + player,
        query: `select sum(map_length.map_length) as map_length from ? as map_length`,
        deps: ['map_length'],
      },
      {
        name: 'done_by_' + player,
        query: `select i.\`target\`, sum(case when i.type = 'damage' then i.amount else 0 end) as damage, sum(case when i.type = 'healing' then i.amount else 0 end) as healing, sum(case when i.type = 'elimination' then 1 else 0 end) as eliminations, sum(case when i.type = 'final blow' then 1 else 0 end) as final_blows from ? as i where i.player = '${player}' group by i.\`target\` order by damage desc`,
        deps: ['player_interaction'],
      },
      {
        name: 'taken_by_' + player,
        query: `select i.player,  sum(case when i.type = 'damage' then i.amount else 0 end) as damage, sum(case when i.type = 'healing' then i.amount else 0 end) as healing, sum(case when i.type = 'elimination' then 1 else 0 end) as eliminations, sum(case when i.type = 'final blow' then 1 else 0 end) as final_blows from ? as i where i.\`target\` = '${player}' group by i.player`,
        deps: ['player_interaction'],
      },
    ],
    [player],
  );

  const playerRole = useMemo(() => {
    const roles = results['roles_' + player];
    if (roles) {
      if (roles.length > 1) {
        return roles.map((r) => r.role).join(', ');
      }
      if (roles.length === 0) {
        return 'none';
      }
      return roles[0].role as string;
    }
    return 'unknown';
  }, [
    tick,
    player,
    // TODO this is a hack, why is this not updating?
    results['roles_' + player]?.length,
  ]);

  console.log('results', results);

  const interactions = results['done_by_' + player];

  const playerRoleIcon = useMemo(() => {
    const topRole = playerRole.split(',')[0];
    if (topRole === 'tank') {
      return <TankIcon />;
    }
    if (topRole === 'damage') {
      return <DamageIcon />;
    }
    if (topRole === 'support') {
      return <SupportIcon />;
    }
    return <CircularProgress size={15} />;
  }, [playerRole]);

  return (
    <div className="PlayerDetails">
      <Box display="flex" alignItems="center">
        <Box flexGrow={1}>
          <Box
            display="flex"
            alignItems="center"
            className="PlayerDetailsHeader">
            <span className="player">
              <IconAndText icon={playerRoleIcon} text={player!} />
            </span>
            <div>
              {results['top_heroes_' + player] &&
                results['top_heroes_' + player].map((row) => (
                  <img
                    key={row.hero}
                    src={getHeroImage(row.hero as string)}
                    alt={row.hero as string}
                    style={{
                      borderRadius: '50%',
                      width: `40px`,
                      height: `40px`,
                      pointerEvents: 'none',
                    }}
                    className="PlayerDetailsHeaderImage"
                  />
                ))}
            </div>
            <div
              style={{
                margin: '0 10px',
              }}>
              <QueryText
                query={{
                  name: 'time_played_' + player,
                  query: `select count(*) as time_played from ? where player = '${player}'`,
                  deps: ['player_status'],
                }}
                parseResults={(results) =>
                  formatTime(results[0].time_played) + ' played'
                }
                deps={[player]}
                variant="body1"
              />
            </div>
          </Box>
        </Box>
        <Box
          style={{
            verticalAlign: 'top',
          }}>
          <IconButton onClick={() => setPlayer(null)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <div className="text">
        {/* <Typography variant="h6">
          {per10['damage']} damage per 10 minutes
        </Typography> */}
        {/* <Typography variant="h6">
          {per10['healing']} healing per 10 minutes
        </Typography>
        <Typography variant="h6">
          {per10['eliminations']} eliminations per 10 minutes
        </Typography>
        <Typography variant="h6">
          {per10['final_blows']} final blows per 10 minutes
        </Typography> */}
      </div>
      <Box sx={{display: 'flex'}}>
        <QueryCard
          title="Damage done / taken"
          query={{
            name: 'damage_done_vs_taken_' + player,
            query: `select sum(CASE WHEN player = '${player}' THEN amount ELSE 0 END) as damage_done,  sum(CASE WHEN \`target\` = '${player}' THEN amount ELSE 0 END) as damage_taken from ? where type = 'damage'`,
            deps: ['player_interaction'],
          }}
          parseResults={(results) =>
            format(safeDivide(results[0].damage_done, results[0].damage_taken))
          }
          deps={[player]}
          emphasisLevel="high"
        />
        <QueryCard
          title="Elims / deaths"
          query={{
            name: 'elims_vs_deaths_' + player,
            query: `select sum(CASE WHEN player = '${player}' and type = 'elimination' THEN 1 ELSE 0 END) as eliminations,  sum(CASE WHEN \`target\` = '${player}' and type = 'final blow' THEN 1 ELSE 0 END) as deaths from ?`,
            deps: ['player_interaction'],
          }}
          parseResults={(results) =>
            format(safeDivide(results[0].eliminations, results[0].deaths))
          }
          deps={[player]}
          emphasisLevel="high"
        />
        <QueryCard
          title="Healing done / taken"
          query={{
            name: 'healing_done_vs_taken_' + player,
            query: `select sum(CASE WHEN player = '${player}' THEN amount ELSE 0 END) as healing_done,  sum(CASE WHEN \`target\` = '${player}' THEN amount ELSE 0 END) as healing_taken from ? where type = 'healing'`,
            deps: ['player_interaction'],
          }}
          parseResults={(results) =>
            format(
              safeDivide(results[0].healing_done, results[0].healing_taken),
            )
          }
          deps={[player]}
          emphasisLevel="high"
        />
        {/* <MetricCard
          name="Damage per 10 minutes"
          value={per10('damage')}
          compareValue={1}
          compareText="Average Player"
        />
        <MetricCard
          name="Healing per 10 minutes"
          value={per10('healing')}
          compareValue={1}
          compareText="Average Player"
        />
        <MetricCard
          name="Eliminations per 10 minutes"
          value={per10('eliminations')}
          compareValue={1}
          compareText="Average Player"
        />
        <MetricCard
          name="Final Blows per 10 minutes"
          value={per10('final_blows')}
          compareValue={1}
          compareText="Average Player"
        /> */}
      </Box>
      <Box sx={{display: 'flex'}}>
        {/* <PieChartComponent
          data={results['roles_' + player]}
          height={200}
          width={200}
          title={'Role Breakdown'}
          dataKey={'role_time'}
          colorKey={'role'}
          formatFn={(d) =>
            `${d.role_time.toLocaleString()} hours (${(
              ((d.role_time as number) / (d.total_time as number)) *
              100
            ).toFixed(2)}%)  played on ${d.role}`
          }
          deps={[]}
        />
        <PieChartComponent
          data={results['hero_damage_total_' + player]}
          height={200}
          width={200}
          title="Role Damage"
          dataKey="damage"
          colorKey="role"
          formatFn={(d) =>
            `${d.damage.toLocaleString()} damage (${(
              ((d.damage as number) / (d.total_damage as number)) *
              100
            ).toFixed(2)}%) done to ${d.role} players`
          }
          deps={[]}
        /> */}
      </Box>
      <DataTable
        columns={Object.keys((interactions || [[]])[0]).map((key) => ({
          name: key,
          selector: (row: DataRow) =>
            typeof row[key] === 'string'
              ? row[key]
              : (row[key] as number).toLocaleString(),
        }))}
        data={interactions || []}
        progressPending={interactions == undefined}
      />
    </div>
  );
};

export default PlayerDetails;
