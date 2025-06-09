import { atom } from 'jotai';
import { teamfights, ultimateEvents, UltimateEvent, kill, uniquePlayerNames, HeroUltimateImpactStats, UltimateImpactStats, Teamfight, KillType } from '@atoms';

export const ultimateImpactAtomFn = (
  teamfightData: Teamfight[],
  ultimateEventsData: UltimateEvent[],
  killEvents: KillType,
  playerNames: string[]
): UltimateImpactStats => {
  // Helper type for intermediate calculations
  type MutableHeroUltimateImpactStats = Omit<HeroUltimateImpactStats, 'avgKillsPerUlt' | 'fightWinRateWithUlt'>;
  
  const playerHeroStatsMap: Record<string, Record<string, MutableHeroUltimateImpactStats>> = {};

  // Initialize structure for all players
  playerNames.forEach((playerName: string) => {
    playerHeroStatsMap[playerName] = {};
  });

  // Iterate through each ultimate usage
  ultimateEventsData.forEach((ultEvent: UltimateEvent) => {
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
    const relevantFights = teamfightData.filter(fight =>
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
};


export default atom(async (get): Promise<UltimateImpactStats> => {
  const teamfightData = await get(teamfights.atom);
  const ultimateEventsData = await get(ultimateEvents.atom);
  const killEvents = await get(kill.atom);
  const playerNames = await get(uniquePlayerNames.atom);

  return ultimateImpactAtomFn(teamfightData, ultimateEventsData, killEvents, playerNames);
});
