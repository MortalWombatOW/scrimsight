import React, {useMemo, useState} from 'react';
import {ResponsiveContainer, PieChart, Pie} from 'recharts';
import PieChartComponent from '../../components/Component/PieChartComponent';
import useQueries from '../../hooks/useQueries';
import {heroToRoleTable} from '../../lib/data/data';

const PlayerDetails = () => {
  const [open, setOpen] = useState(false);
  const [player, setPlayer] = useState('Electric');
  const [playerInfo, setPlayerInfo] = useState<
    {
      [key: string]: string | number;
    }[]
  >([]);

  const [results, refresh] = useQueries([
    {
      name: 'top_heroes',
      query: `select hero, count(*) as hero_time from player_status where player = '${player}' group by hero order by hero_time desc limit 5`,
    },
    {
      name: 'roles',
      query: `select hero_roles.role, sum(top_heroes.hero_time)/60 as role_time from ? as top_heroes join ? as hero_roles on top_heroes.hero = hero_roles.hero group by hero_roles.role order by role_time desc`,
      deps: ['top_heroes', heroToRoleTable],
    },
    {
      name: 'damage_dealt',
      query: `select mapId, timestamp, \`target\`, sum(amount) as damage from player_interaction where player = '${player}' and type = 'damage' group by mapId, timestamp, \`target\` order by damage_dealt`,
    },
    {
      name: 'player_heroes_per_timestamp_per_map',
      query: `select mapId, timestamp, player, hero, hero_roles.role from player_status join ? as hero_roles on player_status.hero = hero_roles.hero`,
      deps: [heroToRoleTable],
    },
    {
      name: 'hero_damage_total',
      query: `select player_heroes_per_timestamp_per_map.role, sum(damage_dealt.damage) as damage from ? as damage_dealt join ? as player_heroes_per_timestamp_per_map on damage_dealt.mapId = player_heroes_per_timestamp_per_map.mapId and damage_dealt.timestamp = player_heroes_per_timestamp_per_map.timestamp and damage_dealt.\`target\` = player_heroes_per_timestamp_per_map.player group by player_heroes_per_timestamp_per_map.role order by damage desc`,
      deps: ['damage_dealt', 'player_heroes_per_timestamp_per_map'],
    },
  ]);

  const playerRole = useMemo(() => {
    if (results.roles) {
      if (results.roles.length > 1) {
        return 'flex';
      }
      return results.roles[0].role;
    }
    return 'unknown';
  }, [results.roles]);

  console.log('results', results);

  // const [interactionOut, running, refresh] = useQuery(
  //   `
  //   select mapId, \`target\` as player,
  //   sum(CASE WHEN type = "damage" THEN amount ELSE 0 END) as damage,
  //   sum(CASE WHEN type = "healing" THEN amount ELSE 0 END) as healing,
  //   sum(CASE WHEN type = "elimination" THEN 1 ELSE 0 END) as eliminations,
  //   sum(CASE WHEN type = "final blow" THEN 1 ELSE 0 END) as final_blows
  //   from player_interaction
  //   where player = '${player}'
  //   group by \`target\` order by damage desc
  //   `,
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

  return (
    <div>
      Role: {playerRole}
      <PieChartComponent
        data={results['roles']}
        height={400}
        width={400}
        title={'Role Breakdown'}
        dataKey={'role_time'}
        formatFn={(d) => `
        ${d.role}`}
      />
      <PieChartComponent
        data={results['hero_damage_total']}
        height={400}
        width={400}
        title="Role Damage"
        dataKey="damage"
        formatFn={(d) => `
        ${d.role} ${d.damage.toLocaleString()}`}
      />
    </div>
  );
};

export default PlayerDetails;
