import { atom } from 'jotai';
import { Teamfight, TeamfightParticipationType, PlayerFirstKillDeathRateStats, teamfights, teamfightParticipation, uniquePlayerNames } from '@atoms';

/**
 * Pure function that calculates first kill/death rates for all players
 */
export const playerFirstKillDeathRateAtomFn = (
  teamfightData: Teamfight[],
  participation: TeamfightParticipationType,
  playerNames: string[]
): Record<string, PlayerFirstKillDeathRateStats> => {
  const playerStatsMap: Record<string, PlayerFirstKillDeathRateStats> = {};

  // Initialize stats for all known players
  playerNames.forEach(name => {
    playerStatsMap[name] = {
      playerName: name,
      firstKills: 0,
      firstDeaths: 0,
      teamfightsParticipated: 0,
      firstKillRate: 0,
      firstDeathRate: 0,
    };
  });

  // Aggregate first kills and deaths from teamfights
  teamfightData.forEach((fight: Teamfight) => {
    if (fight.firstKillPlayer && playerStatsMap[fight.firstKillPlayer]) {
      playerStatsMap[fight.firstKillPlayer].firstKills++;
    }
    if (fight.firstDeathPlayer && playerStatsMap[fight.firstDeathPlayer]) {
      playerStatsMap[fight.firstDeathPlayer].firstDeaths++;
    }
  });

  // Aggregate participation count
  // The participation atom structure is Map<string, TeamfightParticipation>
  // We need to count how many fights each player participated in.
  const participationCounts: Record<string, number> = {};
  participation.forEach((playersInFight) => {
    [...playersInFight.team1Players, ...playersInFight.team2Players].forEach((playerName: string) => {
      if (playerStatsMap[playerName]) { // Ensure player exists in our map
        participationCounts[playerName] = (participationCounts[playerName] || 0) + 1;
      }
    });
  });

  // Add participation counts and calculate rates
  Object.keys(playerStatsMap).forEach(playerName => {
    const stats = playerStatsMap[playerName];
    stats.teamfightsParticipated = participationCounts[playerName] || 0; // Assign count, default to 0
    stats.firstKillRate = stats.teamfightsParticipated > 0 ? stats.firstKills / stats.teamfightsParticipated : 0;
    stats.firstDeathRate = stats.teamfightsParticipated > 0 ? stats.firstDeaths / stats.teamfightsParticipated : 0;
  });

  return playerStatsMap;
};

/**
 * Atom that calculates first kill/death rates for all players
 */
const playerFirstKillDeathRateAtom = atom(async (get): Promise<Record<string, PlayerFirstKillDeathRateStats>> => {
  const teamfightData = await get(teamfights.atom);
  const participation = await get(teamfightParticipation.atom);
  const playerNames = await get(uniquePlayerNames.atom);

  return playerFirstKillDeathRateAtomFn(teamfightData, participation, playerNames);
});

export default playerFirstKillDeathRateAtom;
