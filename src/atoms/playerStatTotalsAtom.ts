import { atom } from 'jotai';
import { playerStatExpandedAtom, PlayerStatExpandedEvent } from './playerStatExpandedAtom';

/**
 * Interface for player stat totals
 */
export interface PlayerStatTotals {
  playerName: string;
  eliminations: number;
  finalBlows: number;
  deaths: number;
  allDamageDealt: number;
  heroDamageDealt: number;
  barrierDamageDealt: number;
  healingDealt: number;
  healingReceived: number;
  selfHealing: number;
  damageTaken: number;
  damageBlocked: number;
  defensiveAssists: number;
  offensiveAssists: number;
  ultimatesEarned: number;
  ultimatesUsed: number;
  multikills: number;
  multikillBest: number;
  soloKills: number;
  objectiveKills: number;
  environmentalKills: number;
  environmentalDeaths: number;
  criticalHits: number;
  scopedCriticalHitKills: number;
  shotsFired: number;
  shotsHit: number;
  shotsMissed: number;
  scopedShotsFired: number;
  scopedShotsHit: number;
  weaponAccuracy: number;
}

/**
 * Helper function to sum up numeric stats
 */
function sumStats(stats: PlayerStatExpandedEvent[]): Omit<PlayerStatTotals, 'playerName'> {
  return {
    eliminations: stats.reduce((sum, stat) => sum + stat.eliminations, 0),
    finalBlows: stats.reduce((sum, stat) => sum + stat.finalBlows, 0),
    deaths: stats.reduce((sum, stat) => sum + stat.deaths, 0),
    allDamageDealt: stats.reduce((sum, stat) => sum + stat.allDamageDealt, 0),
    heroDamageDealt: stats.reduce((sum, stat) => sum + stat.heroDamageDealt, 0),
    barrierDamageDealt: stats.reduce((sum, stat) => sum + stat.barrierDamageDealt, 0),
    healingDealt: stats.reduce((sum, stat) => sum + stat.healingDealt, 0),
    healingReceived: stats.reduce((sum, stat) => sum + stat.healingReceived, 0),
    selfHealing: stats.reduce((sum, stat) => sum + stat.selfHealing, 0),
    damageTaken: stats.reduce((sum, stat) => sum + stat.damageTaken, 0),
    damageBlocked: stats.reduce((sum, stat) => sum + stat.damageBlocked, 0),
    defensiveAssists: stats.reduce((sum, stat) => sum + stat.defensiveAssists, 0),
    offensiveAssists: stats.reduce((sum, stat) => sum + stat.offensiveAssists, 0),
    ultimatesEarned: stats.reduce((sum, stat) => sum + stat.ultimatesEarned, 0),
    ultimatesUsed: stats.reduce((sum, stat) => sum + stat.ultimatesUsed, 0),
    multikills: stats.reduce((sum, stat) => sum + stat.multikills, 0),
    multikillBest: Math.max(...stats.map(stat => stat.multikillBest)),
    soloKills: stats.reduce((sum, stat) => sum + stat.soloKills, 0),
    objectiveKills: stats.reduce((sum, stat) => sum + stat.objectiveKills, 0),
    environmentalKills: stats.reduce((sum, stat) => sum + stat.environmentalKills, 0),
    environmentalDeaths: stats.reduce((sum, stat) => sum + stat.environmentalDeaths, 0),
    criticalHits: stats.reduce((sum, stat) => sum + stat.criticalHits, 0),
    scopedCriticalHitKills: stats.reduce((sum, stat) => sum + stat.scopedCriticalHitKills, 0),
    shotsFired: stats.reduce((sum, stat) => sum + stat.shotsFired, 0),
    shotsHit: stats.reduce((sum, stat) => sum + stat.shotsHit, 0),
    shotsMissed: stats.reduce((sum, stat) => sum + stat.shotsMissed, 0),
    scopedShotsFired: stats.reduce((sum, stat) => sum + stat.scopedShotsFired, 0),
    scopedShotsHit: stats.reduce((sum, stat) => sum + stat.scopedShotsHit, 0),
    weaponAccuracy: stats.reduce((sum, stat) => sum + stat.weaponAccuracy, 0) / stats.length,
  };
}

/**
 * Atom that calculates total stats for each player
 */
export const playerStatTotalsAtom = atom(async (get): Promise<PlayerStatTotals[]> => {
  const playerStats = await get(playerStatExpandedAtom);
  
  // Group stats by player name
  const statsByPlayer = playerStats.reduce((acc, stat) => {
    if (!acc[stat.playerName]) {
      acc[stat.playerName] = [];
    }
    acc[stat.playerName].push(stat);
    return acc;
  }, {} as Record<string, PlayerStatExpandedEvent[]>);

  // Calculate totals for each player
  return Object.entries(statsByPlayer).map(([playerName, stats]) => ({
    playerName,
    ...sumStats(stats)
  }));
}); 