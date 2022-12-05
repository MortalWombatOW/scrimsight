import {Box, IconButton, Typography} from '@mui/material';
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
      //   name: 'taken_by_map_timestamp_' + player,
      //   query: `select mapId, timestamp, player, sum(case when type = 'damage' then amount else 0 end) as damage, sum(case when type = 'healing' then amount else 0 end) as healing, sum(case when type = 'elimination' then 1 else 0 end) as eliminations, sum(case when type = 'final blow' then 1 else 0 end) as final_blows from player_interaction where \`target\` = '${player}' group by mapId, timestamp, player`,
      // },
      {
        name: 'player_heroes_per_timestamp_per_map',
        query: `select mapId, timestamp, player, hero, hero_roles.role from ? as player_status join ? as hero_roles on player_status.hero = hero_roles.hero`,
        deps: ['player_status', heroToRoleTable],
      },
      {
        name: 'hero_damage_total_' + player,
        query: `select player_heroes_per_timestamp_per_map.role, sum(damage_dealt.damage) as damage, (select sum(damage) from ?) as total_damage from ? as damage_dealt join ? as player_heroes_per_timestamp_per_map on damage_dealt.mapId = player_heroes_per_timestamp_per_map.mapId and damage_dealt.timestamp = player_heroes_per_timestamp_per_map.timestamp and damage_dealt.\`target\` = player_heroes_per_timestamp_per_map.player group by player_heroes_per_timestamp_per_map.role order by damage desc`,
        deps: [
          'damage_dealt_' + player,
          'damage_dealt_' + player,
          'player_heroes_per_timestamp_per_map',
        ],
      },
      // {
      //   name: 'per_10min_' + player,
      //   query: `select sum(case when type = 'damage' and player='${player}' then amount else 0 end)/sum(case when type = 'damage' and player='${player}' then 1 else 0 end)*600 as damage, sum(case when type = 'healing' and player='${player}' then amount else 0 end)/sum(case when type = 'healing' and player='${player}' then 1 else 0 end)*600 as healing, sum(case when type = 'elimination' and player='${player}' then 1 else 0 end)/sum(case when type = 'elimination' and player='${player}' then 1 else 0 end)*600 as eliminations, sum(case when type = 'final blow' and player='${player}' then 1 else 0 end)/sum(case when type = 'final blow' and player='${player}' then 1 else 0 end)*600 as final_blows, sum(case when type = 'damage' then amount else 0 end)/sum(case when type = 'damage' then 1 else 0 end)*600 as total_damage, sum(case when type = 'healing' then amount else 0 end)/sum(case when type = 'healing' then 1 else 0 end)*600 as total_healing, sum(case when type = 'elimination' then 1 else 0 end)/sum(case when type = 'elimination' then 1 else 0 end)*600 as total_eliminations, sum(case when type = 'final blow' then 1 else 0 end)/sum(case when type = 'final blow' then 1 else 0 end)*600 as total_final_blows from player_interaction`,
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

  // sum(per_map_${player}.healing)/sum(map_length.map_length) * 600 as healing,
  // sum(per_map_${player}.eliminations)/sum(map_length.map_length) * 600 as eliminations,
  // sum(per_map_${player}.final_blows)/sum(map_length.map_length) * 600 as final_blows
  // useEffect(() => {
  //   console.log('updating player info');
  //   Object.keys(results).forEach((key) => {
  //     ResultCache.storeKeyValue(key, undefined);
  //   });
  //   refresh();
  // }, [player]);

  const playerRole = useMemo(() => {
    const roles = results['roles_' + player];
    if (roles) {
      if (roles.length > 1) {
        return roles.map((r) => r.role).join(', ');
      }
      if (roles.length === 0) {
        return 'none';
      }
      return roles[0].role;
    }
    return 'unknown';
  }, [tick]);

  // );
  // const [interactionIn, running2, refresh2] = useQuery(
  //   `
  //   select mapId, player,
  //   sum(CASE WHEN type = "damage" THEN amount ELSE 0 END) as damage,
  //   sum(CASE WHEN type = "healing" THEN amount ELSE 0 END) as healing,
  //   sum(CASE WHEN type = "elimination" THEN 1 ELSE 0 END) as eliminations,
  //   sum(CASE WHEN type = "final blow" THEN 1 ELSE 0 END) as final_blows
  //   from player_interaction
  //   where \`target\` = '${player}'
  //   group by player order by damage desc
  //   `,
  // );

  // console.log('interactionOut', interactionOut);
  // console.log('interactionIn', interactionIn);
  console.log('results', results);

  // const per10 = useMemo(() => {
  //   if (
  //     results['per_10min_' + player] &&
  //     results['per_10min_' + player].length > 0
  //   ) {
  //     return results['per_10min_' + player][0];
  //   }
  //   return {} as {[key: string]: string | number}[];
  // }, [tick, player]);
  const per10 = (attr: string) =>
    results['player_stats_' + player] === undefined ||
    results['playtime_' + player] === undefined
      ? undefined
      : ((results['player_stats_' + player][0][attr] as number) /
          (results['playtime_' + player][0].map_length as number)) *
        600;
  const interactions = results['done_by_' + player];
  const playerRoleIcon = useMemo(() => {
    if (playerRole === 'tank') {
      return <TankIcon />;
    }
    if (playerRole === 'damage') {
      return <DamageIcon />;
    }
    if (playerRole === 'support') {
      return <SupportIcon />;
    }
    return <span className="blinkingcursor" />;
  }, [playerRole]);

  return (
    <div className="PlayerDetails">
      <Box display="flex" alignItems="center">
        <Box flexGrow={1}>
          {/* <IconAndText
            icon={}
            text={player || '...'}
          /> */}
          <Box
            display="flex"
            alignItems="center"
            className="PlayerDetailsHeader">
            <span className="player">
              <IconAndText icon={playerRoleIcon} text={player || '...'} />
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
        <MetricCard
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
        />
      </Box>
      <Box sx={{display: 'flex'}}>
        <PieChartComponent
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
        />
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
