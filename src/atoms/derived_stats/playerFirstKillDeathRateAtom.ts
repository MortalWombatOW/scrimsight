import { atom } from 'jotai';
import { Teamfight, teamfightsAtom } from '../teamfightsAtom';
import { teamfightParticipationAtom } from './teamfightParticipationAtom';
import { uniquePlayerNamesAtom } from '../uniquePlayerNamesAtom';

export interface PlayerFirstKillDeathRateStats {
  playerName: string;
  firstKills: number;
  firstDeaths: number;
  teamfightsParticipated: number;
  firstKillRate: number; // firstKills / teamfightsParticipated
  firstDeathRate: number; // firstDeaths / teamfightsParticipated
}

export const playerFirstKillDeathRateAtom = atom(async (get): Promise<Record<string, PlayerFirstKillDeathRateStats>> => {
  const teamfights = await get(teamfightsAtom);
  const participation = await get(teamfightParticipationAtom); // Gets { [fightId]: string[] }
  const playerNames = await get(uniquePlayerNamesAtom); // Get all unique player names across all matches

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
  teamfights.forEach((fight: Teamfight) => {
    if (fight.firstKillPlayer && playerStatsMap[fight.firstKillPlayer]) {
      playerStatsMap[fight.firstKillPlayer].firstKills++;
    }
    if (fight.firstDeathPlayer && playerStatsMap[fight.firstDeathPlayer]) {
      playerStatsMap[fight.firstDeathPlayer].firstDeaths++;
    }
  });

  // Aggregate participation count
  // The participation atom structure is { [fightId]: string[] (player names) }
  // We need to count how many fights each player participated in.
  const participationCounts: Record<string, number> = {};
  Object.values(participation).forEach(playersInFight => {
    playersInFight.forEach((playerName: string) => { // Add explicit type here
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
});
