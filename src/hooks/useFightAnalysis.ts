import { Teamfight, TeamfightEvent } from '../types/domain';
import { UltimateStartLogEvent } from '../types/logs';

function isUltStartEvent(e: TeamfightEvent): e is UltimateStartLogEvent {
  return 'playerName' in e && e.type === 'ult_start';
}

export interface WinConditionMetrics {
  winRateWithFirstPick: number;
  winRateAgainstFirstPick: number;
  dryFightWinRate: number;
  totalFightsWithFirstPick: number;
  totalFightsAgainstFirstPick: number;
  totalDryFights: number;
}

export interface PlayerImpactMetrics {
  entryPickRate: number;
  firstDeathRate: number;
  ultWinRate: number;
  totalFights: number;
  totalFirstPicks: number;
  totalFirstDeaths: number;
  totalUltsUsed: number;
  totalUltsWon: number;
}

export const useFightAnalysis = (teamfights: Teamfight[]) => {
  
  const getTeamWinConditions = (teamName: string): WinConditionMetrics => {
    if (!teamfights.length) {
      return {
        winRateWithFirstPick: 0,
        winRateAgainstFirstPick: 0,
        dryFightWinRate: 0,
        totalFightsWithFirstPick: 0,
        totalFightsAgainstFirstPick: 0,
        totalDryFights: 0,
      };
    }

    let fightsWithFP = 0;
    let winsWithFP = 0;
    let fightsAgainstFP = 0;
    let winsAgainstFP = 0;
    let dryFights = 0;
    let dryWins = 0;

    teamfights.forEach(fight => {
      const isWinner = fight.winner === teamName;

      // First Pick Analysis
      if (fight.firstPick) {
        if (fight.firstPick.team === teamName) {
          fightsWithFP++;
          if (isWinner) winsWithFP++;
        } else {
          fightsAgainstFP++;
          if (isWinner) winsAgainstFP++;
        }
      }

      // Dry Fight Analysis
      if (fight.type === 'dry') {
        dryFights++;
        if (isWinner) dryWins++;
      }
    });

    return {
      winRateWithFirstPick: fightsWithFP > 0 ? (winsWithFP / fightsWithFP) * 100 : 0,
      winRateAgainstFirstPick: fightsAgainstFP > 0 ? (winsAgainstFP / fightsAgainstFP) * 100 : 0,
      dryFightWinRate: dryFights > 0 ? (dryWins / dryFights) * 100 : 0,
      totalFightsWithFirstPick: fightsWithFP,
      totalFightsAgainstFirstPick: fightsAgainstFP,
      totalDryFights: dryFights,
    };
  };

  const getPlayerImpact = (playerName: string): PlayerImpactMetrics => {
    if (!teamfights.length) {
      return {
        entryPickRate: 0,
        firstDeathRate: 0,
        ultWinRate: 0,
        totalFights: 0,
        totalFirstPicks: 0,
        totalFirstDeaths: 0,
        totalUltsUsed: 0,
        totalUltsWon: 0,
      };
    }

    let firstPicks = 0;
    let firstDeaths = 0;
    let ultsUsed = 0;
    let ultsWon = 0;

    teamfights.forEach(fight => {
      // Entry / Death
      if (fight.firstPick) {
        if (fight.firstPick.player === playerName) {
          firstPicks++;
        }
        if (fight.firstPick.victim === playerName) {
          firstDeaths++;
        }
      }

      // Ult Usage
      // Check if player used ult in this fight
      // We need to check both team arrays because we don't know which team the player is on easily here without more context,
      // but usually player names are unique enough or we can check both.
      // Actually, Teamfight has team1UltsUsed and team2UltsUsed as string arrays of HERO names (proxies for ults).
      // Wait, the previous implementation used hero names in team1UltsUsed.
      // We need to match the player's hero to the ult usage.
      // The current Teamfight interface stores `team1UltsUsed: string[]` which are HERO names.
      // This is a limitation. We can't know for sure if THIS player used ult if there are duplicate heroes (No Limits),
      // but for standard role lock it's fine.
      // However, `getPlayerImpact` takes `playerName`. We need to know the player's hero in that fight.
      // We can find the player in the `events` array of the fight to see what hero they were playing?
      // Or we can look at `ultCycles` if we had access to them, but we only have `teamfights`.
      
      // Let's look at the `events` in the fight.
      // We can look for `ult_start` events in the fight where `playerName` matches.
      const ultUsageEvent = fight.events.find((e): e is UltimateStartLogEvent =>
        isUltStartEvent(e) && e.playerName === playerName
      );

      if (ultUsageEvent) {
        ultsUsed++;
        // Determine if their team won.
        // We need to know which team the player is on.
        // We can infer it from the event or pass it in.
        // The event usually has `playerTeam`.
        if (fight.winner === ultUsageEvent.playerTeam) {
          ultsWon++;
        }
      }
    });

    return {
      entryPickRate: (firstPicks / teamfights.length) * 100,
      firstDeathRate: (firstDeaths / teamfights.length) * 100,
      ultWinRate: ultsUsed > 0 ? (ultsWon / ultsUsed) * 100 : 0,
      totalFights: teamfights.length,
      totalFirstPicks: firstPicks,
      totalFirstDeaths: firstDeaths,
      totalUltsUsed: ultsUsed,
      totalUltsWon: ultsWon,
    };
  };

  return {
    getTeamWinConditions,
    getPlayerImpact,
  };
};
