import { atom } from 'jotai';
import { teamfightsAtom, Teamfight } from '@atoms/teamfightsAtom'; // Corrected path and import kind

export interface FirstKillImpactStats {
  totalFights: number;
  overallWinRate: number; // Fights won / total fights (excluding draws)
  firstKillWinRate: number; // Fights won when getting first kill / fights with first kill
  firstDeathLossRate: number; // Fights lost when suffering first death / fights with first death
  teamStats: Record<string, TeamFirstKillImpactStats>;
}

export interface TeamFirstKillImpactStats {
  teamName: string;
  totalFights: number;
  fightsWon: number;
  winRate: number;
  fightsWithFirstKill: number;
  fightsWonWithFirstKill: number;
  firstKillWinRate: number; // fightsWonWithFirstKill / fightsWithFirstKill
  fightsWithFirstDeath: number;
  fightsLostWithFirstDeath: number;
  firstDeathLossRate: number; // fightsLostWithFirstDeath / fightsWithFirstDeath
}

export const firstKillImpactAtom = atom(async (get): Promise<FirstKillImpactStats> => {
  const teamfights = await get(teamfightsAtom);

  let totalFights = 0;
  let totalWins = 0;
  let fightsWithFirstKill = 0;
  let winsWithFirstKill = 0;
  let fightsWithFirstDeath = 0;
  let lossesWithFirstDeath = 0;

  const teamStatsMap: Record<string, TeamFirstKillImpactStats> = {};

  const initializeTeamStats = (teamName: string): TeamFirstKillImpactStats => ({
    teamName,
    totalFights: 0,
    fightsWon: 0,
    winRate: 0,
    fightsWithFirstKill: 0,
    fightsWonWithFirstKill: 0,
    firstKillWinRate: 0,
    fightsWithFirstDeath: 0,
    fightsLostWithFirstDeath: 0,
    firstDeathLossRate: 0,
  });

  teamfights.forEach((fight: Teamfight) => {
    if (fight.winner === 'draw') return; // Exclude draws from win rate calculations

    totalFights++;
    const team1Won = fight.winner === 'team1';
    const team2Won = fight.winner === 'team2';

    if (team1Won) totalWins++;

    // Initialize team stats if not present
    if (!teamStatsMap[fight.team1Name]) {
      teamStatsMap[fight.team1Name] = initializeTeamStats(fight.team1Name);
    }
    if (!teamStatsMap[fight.team2Name]) {
      teamStatsMap[fight.team2Name] = initializeTeamStats(fight.team2Name);
    }

    const team1Stats = teamStatsMap[fight.team1Name];
    const team2Stats = teamStatsMap[fight.team2Name];

    team1Stats.totalFights++;
    team2Stats.totalFights++;
    if (team1Won) team1Stats.fightsWon++;
    if (team2Won) team2Stats.fightsWon++;

    // First Kill Analysis
    if (fight.firstKillTeam) {
      fightsWithFirstKill++;
      if (fight.firstKillTeam === fight.team1Name) {
        team1Stats.fightsWithFirstKill++;
        if (team1Won) {
          winsWithFirstKill++;
          team1Stats.fightsWonWithFirstKill++;
        }
      } else if (fight.firstKillTeam === fight.team2Name) {
        team2Stats.fightsWithFirstKill++;
        if (team2Won) {
          winsWithFirstKill++; // Overall count needs winner check
          team2Stats.fightsWonWithFirstKill++;
        }
      }
    }

    // First Death Analysis
    if (fight.firstDeathTeam) {
      fightsWithFirstDeath++;
      if (fight.firstDeathTeam === fight.team1Name) {
        team1Stats.fightsWithFirstDeath++;
        if (team2Won) { // Lost if the other team won
          lossesWithFirstDeath++;
          team1Stats.fightsLostWithFirstDeath++;
        }
      } else if (fight.firstDeathTeam === fight.team2Name) {
        team2Stats.fightsWithFirstDeath++;
        if (team1Won) { // Lost if the other team won
          lossesWithFirstDeath++;
          team2Stats.fightsLostWithFirstDeath++;
        }
      }
    }
  });

  // Calculate rates
  const overallWinRate = totalFights > 0 ? totalWins / totalFights : 0;
  const firstKillWinRate = fightsWithFirstKill > 0 ? winsWithFirstKill / fightsWithFirstKill : 0;
  const firstDeathLossRate = fightsWithFirstDeath > 0 ? lossesWithFirstDeath / fightsWithFirstDeath : 0;

  // Calculate team rates
  Object.values(teamStatsMap).forEach(stats => {
    stats.winRate = stats.totalFights > 0 ? stats.fightsWon / stats.totalFights : 0;
    stats.firstKillWinRate = stats.fightsWithFirstKill > 0 ? stats.fightsWonWithFirstKill / stats.fightsWithFirstKill : 0;
    stats.firstDeathLossRate = stats.fightsWithFirstDeath > 0 ? stats.fightsLostWithFirstDeath / stats.fightsWithFirstDeath : 0;
  });

  return {
    totalFights,
    overallWinRate,
    firstKillWinRate,
    firstDeathLossRate,
    teamStats: teamStatsMap,
  };
});
