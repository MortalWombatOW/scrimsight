import CloseIcon from '@mui/icons-material/Close';
import {Box, CircularProgress, IconButton} from '@mui/material';
import React, {useMemo} from 'react';
import DataTable from 'react-data-table-component';
import QueryCard from '../../components/Card/QueryCard';
import QueryText from '../../components/Card/QueryText';
import SimpleCard from '../../components/Card/SimpleCard';
import IconAndText from '../../components/Common/IconAndText';
import {
  DamageIcon,
  SupportIcon,
  TankIcon,
} from '../../components/Common/RoleIcons';
import useQueries from '../../hooks/useQueries';
import {getHeroImage, heroToRoleTable} from '../../lib/data/data';
import {format, formatTime, safeDivide} from '../../lib/data/metricsv3';
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
      {
        name: 'ult_times_' + player,
        query: `select mapId, timestamp, ultCharge from ? where player = '${player}' and (ultCharge = 100 or ultCharge = 0)`,
        deps: ['player_status'],
      },
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

  console.log('results', results['ult_times_' + player]);

  const averageTimeToUlt: number = useMemo(() => {
    const ult_charge_timestamps = results['ult_times_' + player];
    if (!ult_charge_timestamps) {
      return 0;
    }
    // first, transform the data. we want to remove rows that are preceded by a row with the same ult charge and mapId
    const ult_charge_timestamps_filtered = ult_charge_timestamps.filter(
      (row, index) => {
        if (index === 0) {
          return true;
        }
        const prev = ult_charge_timestamps[index - 1];
        return row.ultCharge !== prev.ultCharge || row.mapId !== prev.mapId;
      },
    );
    console.log(
      'ult_charge_timestamps_filtered',
      ult_charge_timestamps_filtered,
    );

    // we want to find the average time it takes for the player to charge their ult from 0 to 100
    // to do this, we need to find the time between each 0 and 100 ult charge
    // remember that these happen on different maps
    const times: number[] = [];
    let lastTimePerMap: {[mapId: string]: number} = {};
    ult_charge_timestamps_filtered.forEach((row) => {
      if (row.ultCharge === 0) {
        lastTimePerMap[row.mapId] = row.timestamp as number;
      } else {
        const lastTime = lastTimePerMap[row.mapId];
        if (lastTime) {
          times.push((row.timestamp as number) - lastTime);
        }
      }
    });
    return times.reduce((a, b) => a + b, 0) / times.length;
  }, [tick, player, results['ult_times_' + player]?.length]);

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
          title="Final blows / eliminations"
          query={{
            name: 'final_blows_vs_elims_' + player,
            query: `select sum(CASE WHEN type = 'final blow' THEN 1 ELSE 0 END) as final_blows, sum(CASE WHEN type = 'elimination' THEN 1 ELSE 0 END) as eliminations from ? where player = '${player}'`,
            deps: ['player_interaction'],
          }}
          parseResults={(results) =>
            format(safeDivide(results[0].final_blows, results[0].eliminations))
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
        <QueryCard
          title="Self healing / healing done"
          query={{
            name: 'self_healing_vs_healing_done_' + player,
            query: `select sum(CASE WHEN player = '${player}' THEN amount ELSE 0 END) as healing_done,  sum(CASE WHEN player = '${player}' and \`target\` = '${player}' THEN amount ELSE 0 END) as self_healing from ? where type = 'healing'`,
            deps: ['player_interaction'],
          }}
          parseResults={(results) =>
            format(safeDivide(results[0].self_healing, results[0].healing_done))
          }
          deps={[player]}
          emphasisLevel="high"
        />
        <SimpleCard
          title="Average time to ult"
          content={formatTime(averageTimeToUlt)!}
        />
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
