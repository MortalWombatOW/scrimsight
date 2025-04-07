import { atom } from 'jotai';
import { teamfightsAtom } from '../teamfightsAtom';
import { ultimateEventsAtom, UltimateEvent } from '../derived_events/ultimateEventsAtom';
import { killExtractorAtom } from '../event_extractors/killExtractorAtom';
import { uniquePlayerNamesAtom } from '../uniquePlayerNamesAtom';

// Interface for stats per hero for a specific player
export interface HeroUltimateImpactStats {
  heroName: string;
  ultsUsedInFights: number;
  totalKillsDuringUltWindow: number; // Sum of kills by the player during all ult windows for this hero
  fightWinsWithUlt: number;
  avgKillsPerUlt: number; // totalKillsDuringUltWindow / ultsUsedInFights
  fightWinRateWithUlt: number; // fightWinsWithUlt / ultsUsedInFights
}

// Interface for the overall atom output (Player Name -> Hero Name -> Stats)
export type UltimateImpactStats = Record<string, Record<string, HeroUltimateImpactStats>>;

// Helper type for intermediate calculations
type MutableHeroUltimateImpactStats = Omit<HeroUltimateImpactStats, 'avgKillsPerUlt' | 'fightWinRateWithUlt'>;

export const ultimateImpactAtom = atom(async (get): Promise<UltimateImpactStats> => {
  const teamfights = await get(teamfightsAtom);
  const ultimateEvents = await get(ultimateEventsAtom);
  const killEvents = await get(killExtractorAtom);
  const playerNames = await get(uniquePlayerNamesAtom);

  const playerHeroStatsMap: Record<string, Record<string, MutableHeroUltimateImpactStats>> = {};

  // Initialize structure for all players
  playerNames.forEach(playerName => {
    playerHeroStatsMap[playerName] = {};
  });

  // Iterate through each ultimate usage
  ultimateEvents.forEach((ultEvent: UltimateEvent) => {
    const {
      matchId,
      playerName,
      playerTeam,
      playerHero,
      ultimateStartTime,
      ultimateEndTime,
    } = ultEvent;

    // Ensure player exists in the map
    if (!playerHeroStatsMap[playerName]) {
      playerHeroStatsMap[playerName] = {};
    }
    // Ensure hero exists for the player
    if (!playerHeroStatsMap[playerName][playerHero]) {
      playerHeroStatsMap[playerName][playerHero] = {
        heroName: playerHero,
        ultsUsedInFights: 0,
        totalKillsDuringUltWindow: 0,
        fightWinsWithUlt: 0,
      };
    }

    const stats = playerHeroStatsMap[playerName][playerHero];

    // Find the teamfight(s) this ultimate occurred within
    const relevantFights = teamfights.filter(fight =>
      fight.matchId === matchId &&
      ultimateStartTime >= fight.startTime && // Ult starts within the fight window
      ultimateStartTime <= fight.endTime     // (or slightly overlaps start)
    );

    if (relevantFights.length > 0) {
      stats.ultsUsedInFights++;

      // Check if the fight was won (using the first relevant fight found)
      // Assumption: An ult belongs primarily to the fight it starts in.
      const fight = relevantFights[0];
      const playerWonFight = (fight.winner === 'team1' && playerTeam === fight.team1Name) ||
                             (fight.winner === 'team2' && playerTeam === fight.team2Name);

      if (playerWonFight) {
        stats.fightWinsWithUlt++;
      }

      // Find kills by this player during the ultimate window (startTime to endTime)
      const killsDuringUlt = killEvents.filter(kill =>
        kill.matchId === matchId &&
        kill.attackerName === playerName && // Kill by the player who used the ult
        kill.matchTime >= ultimateStartTime &&
        kill.matchTime <= ultimateEndTime
      ).length;

      stats.totalKillsDuringUltWindow += killsDuringUlt;
    }
  });

  // Calculate final rates and build the final output structure
  const finalStats: UltimateImpactStats = {};
  Object.keys(playerHeroStatsMap).forEach(playerName => {
    finalStats[playerName] = {};
    Object.keys(playerHeroStatsMap[playerName]).forEach(heroName => {
      const mutableStats = playerHeroStatsMap[playerName][heroName];
      finalStats[playerName][heroName] = {
        ...mutableStats,
        avgKillsPerUlt: mutableStats.ultsUsedInFights > 0
          ? mutableStats.totalKillsDuringUltWindow / mutableStats.ultsUsedInFights
          : 0,
        fightWinRateWithUlt: mutableStats.ultsUsedInFights > 0
          ? mutableStats.fightWinsWithUlt / mutableStats.ultsUsedInFights
          : 0,
      };
    });
  });

  return finalStats;
});
