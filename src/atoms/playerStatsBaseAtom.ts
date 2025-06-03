import { atom, Getter } from "jotai";
import playerStat from "@atoms/playerStat";
import { PlayerStatLogEvent } from "@atoms";
import { heroPlaytimeAtom, HeroPlaytime, HeroPlaytimeCategoryKeys, HeroPlaytimeNumericalKeys } from '@atoms/heroPlaytimeAtom'; // Added Keys
import { Metric } from "@library"; // Removed MetricAtom as it's unused
import { getRoleFromHero } from '@library'; // Import getRoleFromHero
import { 
  PlayerStatsBase, 
  PlayerStatsCategoryKeys, 
  PlayerStatsBaseNumericalKeys,
  playerStatsCategoryKeys,
  playerStatsBaseNumericalKeys
} from '@atoms';

/**
 * Pure function to calculate the most granular player stats for each round,
 * merging player stat events with hero playtime data.
 * This function can be tested independently.
 */
export const playerStatsBaseAtomFn = async (
  get: Getter
): Promise<Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys>> => {
  const playerStats: PlayerStatLogEvent[] = await get(playerStat); // Get raw PlayerStatLogEvent
  const playtimeData: Metric<HeroPlaytime, HeroPlaytimeCategoryKeys, HeroPlaytimeNumericalKeys> = await get(heroPlaytimeAtom);

  // Create a playtime lookup map
  const playtimeMap = new Map<string, number>();
  for (const pt of playtimeData.rows) {
    const key = `${pt.playerName}-${pt.matchId}-${pt.roundNumber}-${pt.hero}`;
    playtimeMap.set(key, pt.playtime);
  }

  // Merge playtime into player stats and ensure type compatibility with PlayerStatsBase
  const mergedStats: PlayerStatsBase[] = playerStats.map((stat: PlayerStatLogEvent) => { // Use PlayerStatLogEvent
    const playtime = playtimeMap.get(
      `${stat.playerName}-${stat.matchId}-${stat.roundNumber}-${stat.playerHero}`
    ) || 0;

    // Explicitly construct PlayerStatsBase to ensure all properties are present and correctly typed
    const baseStat: PlayerStatsBase = {
      matchId: stat.matchId,
      roundNumber: stat.roundNumber,
      playerTeam: stat.playerTeam,
      playerName: stat.playerName,
      playerHero: stat.playerHero,
      playerRole: getRoleFromHero(stat.playerHero), // Calculate playerRole here
      playtime: playtime,
      eliminations: stat.eliminations,
      finalBlows: stat.finalBlows,
      deaths: stat.deaths,
      allDamageDealt: stat.allDamageDealt,
      barrierDamageDealt: stat.barrierDamageDealt,
      heroDamageDealt: stat.heroDamageDealt,
      healingDealt: stat.healingDealt,
      healingReceived: stat.healingReceived,
      selfHealing: stat.selfHealing,
      damageTaken: stat.damageTaken,
      damageBlocked: stat.damageBlocked,
      defensiveAssists: stat.defensiveAssists,
      offensiveAssists: stat.offensiveAssists,
      ultimatesEarned: stat.ultimatesEarned,
      ultimatesUsed: stat.ultimatesUsed,
      multikills: stat.multikills,
      soloKills: stat.soloKills,
      objectiveKills: stat.objectiveKills,
      environmentalKills: stat.environmentalKills,
      environmentalDeaths: stat.environmentalDeaths,
      criticalHits: stat.criticalHits,
      shotsFired: stat.shotsFired,
      shotsHit: stat.shotsHit,
      shotsMissed: stat.shotsMissed,
      scopedShotsFired: stat.scopedShotsFired,
      scopedShotsHit: stat.scopedShotsHit,
    };
    return baseStat;
  });

  return {
    categoryKeys: playerStatsCategoryKeys,
    numericalKeys: playerStatsBaseNumericalKeys,
    rows: mergedStats
  };
};

/**
 * Atom that provides the most granular player stats for each round,
 * merging player stat events with hero playtime data.
 * This is the default export.
 */
export default atom(async (get) => {
  return playerStatsBaseAtomFn(get);
});
