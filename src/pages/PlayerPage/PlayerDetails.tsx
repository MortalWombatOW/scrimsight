import {Box} from '@mui/material';
import React, {useEffect, useMemo, useState} from 'react';
import {ResponsiveContainer, PieChart, Pie} from 'recharts';
import MetricCard from '../../components/Card/MetricCard';
import PieChartComponent from '../../components/Component/PieChartComponent';
import useQueries from '../../hooks/useQueries';
import {heroToRoleTable} from '../../lib/data/data';
import ResultCache from '../../lib/data/ResultCache';

const PlayerDetails = ({player}: {player: string | null}) => {
  const [open, setOpen] = useState(false);
  const [playerInfo, setPlayerInfo] = useState<
    {
      [key: string]: string | number;
    }[]
  >([]);
  const [results, tick, refresh] = useQueries([
    {
      name: 'top_heroes_' + player,
      query: `select hero, count(*) as hero_time from player_status where player = '${player}' group by hero order by hero_time desc`,
    },
    {
      name: 'roles',
      query: `select hero_roles.role, sum(top_heroes.hero_time)/60/60 as role_time, (select sum(hero_time)/60/60 from ? as top_heroes) as total_time from ? as top_heroes join ? as hero_roles on top_heroes.hero = hero_roles.hero group by hero_roles.role order by role_time desc`,
      deps: ['top_heroes_' + player, 'top_heroes_' + player, heroToRoleTable],
    },
    {
      name: 'damage_dealt_' + player,
      query: `select mapId, timestamp, \`target\`, sum(amount) as damage from player_interaction where player = '${player}' and type = 'damage' group by mapId, timestamp, \`target\``,
    },
    {
      name: 'taken_by_map_timestamp_player' + player,
      query: `select mapId, timestamp, player, sum(case when type = 'damage' then amount else 0 end) as damage, sum(case when type = 'healing' then amount else 0 end) as healing, sum(case when type = 'elimination' then 1 else 0 end) as eliminations, sum(case when type = 'final blow' then 1 else 0 end) as final_blows from player_interaction where \`target\` = '${player}' group by mapId, timestamp, player`,
    },
    {
      name: 'player_heroes_per_timestamp_per_map',
      query: `select mapId, timestamp, player, hero, hero_roles.role from player_status join ? as hero_roles on player_status.hero = hero_roles.hero`,
      deps: [heroToRoleTable],
    },
    {
      name: 'hero_damage_total',
      query: `select player_heroes_per_timestamp_per_map.role, sum(damage_dealt.damage) as damage, (select sum(damage) from ?) as total_damage from ? as damage_dealt join ? as player_heroes_per_timestamp_per_map on damage_dealt.mapId = player_heroes_per_timestamp_per_map.mapId and damage_dealt.timestamp = player_heroes_per_timestamp_per_map.timestamp and damage_dealt.\`target\` = player_heroes_per_timestamp_per_map.player group by player_heroes_per_timestamp_per_map.role order by damage desc`,
      deps: [
        'damage_dealt_' + player,
        'damage_dealt_' + player,
        'player_heroes_per_timestamp_per_map',
      ],
    },
    {
      name: 'per_10min_' + player,
      query: `select sum(case when type = 'damage' and player='${player}' then amount else 0 end)/sum(case when type = 'damage' and player='${player}' then 1 else 0 end)*600 as damage, sum(case when type = 'healing' and player='${player}' then amount else 0 end)/sum(case when type = 'healing' and player='${player}' then 1 else 0 end)*600 as healing, sum(case when type = 'elimination' and player='${player}' then 1 else 0 end)/sum(case when type = 'elimination' and player='${player}' then 1 else 0 end)*600 as eliminations, sum(case when type = 'final blow' and player='${player}' then 1 else 0 end)/sum(case when type = 'final blow' and player='${player}' then 1 else 0 end)*600 as final_blows, sum(case when type = 'damage' then amount else 0 end)/sum(case when type = 'damage' then 1 else 0 end)*600 as total_damage, sum(case when type = 'healing' then amount else 0 end)/sum(case when type = 'healing' then 1 else 0 end)*600 as total_healing, sum(case when type = 'elimination' then 1 else 0 end)/sum(case when type = 'elimination' then 1 else 0 end)*600 as total_eliminations, sum(case when type = 'final blow' then 1 else 0 end)/sum(case when type = 'final blow' then 1 else 0 end)*600 as total_final_blows from player_interaction`,
    },
  ]);

  // useEffect(() => {
  //   console.log('updating player info');
  //   Object.keys(results).forEach((key) => {
  //     ResultCache.storeKeyValue(key, undefined);
  //   });
  //   refresh();
  // }, [player]);

  const playerRole = useMemo(() => {
    if (results.roles) {
      if (results.roles.length > 1) {
        return 'flex';
      }
      if (results.roles.length === 0) {
        return 'none';
      }
      return results.roles[0].role;
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

  const per10 = useMemo(() => {
    if (
      results['per_10min_' + player] &&
      results['per_10min_' + player].length > 0
    ) {
      return results['per_10min_' + player];
    }
    return {} as {[key: string]: string | number}[];
  }, [tick]);

  return (
    <div>
      Role: {playerRole}
      <PieChartComponent
        data={results['roles']}
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
        data={results['hero_damage_total']}
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
      <Box sx={{display: 'flex'}}>
        <MetricCard
          name="Damage per 10 minutes"
          value={per10.damage as number}
          compareValue={per10.total_damage as number}
          compareText="Average Player"
        />
        <MetricCard
          name="Healing per 10 minutes"
          value={per10.healing as number}
          compareValue={per10.total_healing as number}
          compareText="Average Player"
        />
        <MetricCard
          name="Assists per 10 minutes"
          value={per10.eliminations as number}
          compareValue={per10.total_eliminations as number}
          compareText="Average Player"
        />
        <MetricCard
          name="Final blows per 10 minutes"
          value={per10.final_blows as number}
          compareValue={per10.total_final_blows as number}
          compareText="Average Player"
        />
      </Box>
      {/* <MetricCard
        value={`${results[
          'per_10min'
        ][0].damage.toLocaleString()} damage/10min`}
        trend={{
          slope: 1,
          description: 'Compared to the average player',
          value: `${(
            ((results['per_10min'][0].damage as number) /
              (results['per_10min'][0].total_damage as number)) *
            100
          ).toLocaleString()}%`,
        }}
        title="Damage"
        fetching={results['per_10min'] === undefined}
        error={null}
      /> */}
    </div>
  );
};

export default PlayerDetails;
