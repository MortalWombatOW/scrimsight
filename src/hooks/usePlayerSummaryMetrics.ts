import React from 'react';
import {heroToRoleTable} from '../lib/data/data';
import {safeDivide} from '../lib/data/format';
import useQueries from './useQueries';

interface TankSummaryMetrics {}

interface DPSSummaryMetrics {}

interface SupportSummaryMetrics {
  selfHealingVsHealingDone?: number;
  healingDoneVsTaken?: number;
}

interface PlayerSummaryMetrics {
  role: string;
  mapsPlayed: number;
  playTime?: number;
  damageDoneVsTaken?: number;
  elimsVsDeaths?: number;
  finalBlowsVsElims?: number;
  // avgTimeToUlt?: number;
  tank?: TankSummaryMetrics;
  dps?: DPSSummaryMetrics;
  support?: SupportSummaryMetrics;
}

const usePlayerSummaryMetrics = (
  player: string,
): [PlayerSummaryMetrics | undefined, number] => {
  const [results, computeTick, allLoaded] = useQueries(
    [
      {
        name: 'top_heroes_' + player,
        query: `select hero, count(*) as hero_time from ? where player = '${player}' and hero != '' group by hero order by hero_time desc`,
        deps: ['player_status'],
      },
      {
        name: 'roles_' + player,
        query: `select hero_roles.role, sum(top_heroes.hero_time)/60/60 as role_time, (select sum(hero_time)/60/60 from ? as top_heroes) as total_time from ? as top_heroes join ? as hero_roles on top_heroes.hero = hero_roles.hero group by hero_roles.role order by role_time desc limit 1`,
        deps: ['top_heroes_' + player, 'top_heroes_' + player, heroToRoleTable],
      },
      {
        name: 'maps_played_' + player,
        query: `SELECT COUNT(distinct mapId) as maps_played FROM ? as player_status WHERE player = '${player}'`,
        deps: ['player_status'],
      },
      {
        name: 'play_time_' + player,
        query: `select count(*) as play_time from ? where player = '${player}'`,
        deps: ['player_status'],
      },
      {
        name: 'damage_done_vs_taken_' + player,
        query: `select sum(CASE WHEN player = '${player}' THEN amount ELSE 0 END) as damage_done,  sum(CASE WHEN \`target\` = '${player}' THEN amount ELSE 0 END) as damage_taken from ? where type = 'damage'`,
        deps: ['player_interaction'],
      },
      {
        name: 'elims_vs_deaths_' + player,
        query: `select sum(CASE WHEN player = '${player}' and type = 'elimination' THEN 1 ELSE 0 END) as eliminations,  sum(CASE WHEN \`target\` = '${player}' and type = 'final blow' THEN 1 ELSE 0 END) as deaths from ?`,
        deps: ['player_interaction'],
      },
      {
        name: 'final_blows_vs_elims_' + player,
        query: `select sum(CASE WHEN type = 'final blow' THEN 1 ELSE 0 END) as final_blows, sum(CASE WHEN type = 'elimination' THEN 1 ELSE 0 END) as eliminations from ? where player = '${player}'`,
        deps: ['player_interaction'],
      },
      {
        name: 'healing_done_vs_taken_' + player,
        query: `select sum(CASE WHEN player = '${player}' THEN amount ELSE 0 END) as healing_done,  sum(CASE WHEN \`target\` = '${player}' THEN amount ELSE 0 END) as healing_taken from ? where type = 'healing'`,
        deps: ['player_interaction'],
      },
      {
        name: 'self_healing_vs_healing_done_' + player,
        query: `select sum(CASE WHEN player = '${player}' THEN amount ELSE 0 END) as healing_done,  sum(CASE WHEN player = '${player}' and \`target\` = '${player}' THEN amount ELSE 0 END) as self_healing from ? where type = 'healing'`,
        deps: ['player_interaction'],
      },
    ],
    [player],
  );

  if (!allLoaded) {
    return [undefined, computeTick];
  }

  const summary: PlayerSummaryMetrics = {
    role: results['roles_' + player][0].role as string,
    mapsPlayed: results['maps_played_' + player][0].maps_played as number,
    playTime: results['play_time_' + player][0].play_time as number,
    damageDoneVsTaken: safeDivide(
      results['damage_done_vs_taken_' + player][0].damage_done,
      results['damage_done_vs_taken_' + player][0].damage_taken,
    ),
    elimsVsDeaths: safeDivide(
      results['elims_vs_deaths_' + player][0].eliminations,
      results['elims_vs_deaths_' + player][0].deaths,
    ),
    finalBlowsVsElims: safeDivide(
      results['final_blows_vs_elims_' + player][0].final_blows,
      results['final_blows_vs_elims_' + player][0].eliminations,
    ),
  };

  if (summary.role === 'support') {
    summary.support = {
      selfHealingVsHealingDone: safeDivide(
        results['self_healing_vs_healing_done_' + player][0].self_healing,
        results['self_healing_vs_healing_done_' + player][0].healing_done,
      ),
      healingDoneVsTaken: safeDivide(
        results['healing_done_vs_taken_' + player][0].healing_done,
        results['healing_done_vs_taken_' + player][0].healing_taken,
      ),
    };
  }

  return [summary, computeTick];
};

export default usePlayerSummaryMetrics;
