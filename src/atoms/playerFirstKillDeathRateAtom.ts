import { Getter } from 'jotai'; // atom will be used in index.ts
import {
  teamfights,
  teamfightParticipation,
  uniquePlayerNames,
  type Teamfight,
  type PlayerFirstKillDeathRateStats,
} from '@atoms';

// Default export the core atom logic (async getter function)
// The helper function 'playerFirstKillDeathRateAtomFn' will be inlined.
export default async (get: Getter): Promise<Record<string, PlayerFirstKillDeathRateStats>> => {
  const teamfightData = await get(teamfights.atom);
  const participation = await get(teamfightParticipation.atom);
  const playerNames = await get(uniquePlayerNames.atom);

  // Inlined logic from playerFirstKillDeathRateAtomFn:
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
  const participationCounts: Record<string, number> = {};
  participation.forEach((playersInFight) => {
    [...playersInFight.team1Players, ...playersInFight.team2Players].forEach((playerName: string) => {
      if (playerStatsMap[playerName]) {
        participationCounts[playerName] = (participationCounts[playerName] || 0) + 1;
      }
    });
  });

  // Add participation counts and calculate rates
  Object.keys(playerStatsMap).forEach(playerName => {
    const stats = playerStatsMap[playerName];
    stats.teamfightsParticipated = participationCounts[playerName] || 0;
    stats.firstKillRate = stats.teamfightsParticipated > 0 ? stats.firstKills / stats.teamfightsParticipated : 0;
    stats.firstDeathRate = stats.teamfightsParticipated > 0 ? stats.firstDeaths / stats.teamfightsParticipated : 0;
  });

  return playerStatsMap;
};
