import { TimelineEvent, TeamAdvantageConfig } from '../lib/TeamAdvantageTracker';

export const ultimateAdvantageConfig: TeamAdvantageConfig<string> = {
  getTeamNumber: (event, teams) => {
    if (!event.playerTeam) return null;
    if (event.playerTeam === teams.team1Name) return 1;
    if (event.playerTeam === teams.team2Name) return 2;
    return null;
  },

  getItemKey: (event) => {
    if (!event.playerName || !event.playerHero || !event.ultimateId) return null;
    return `${event.playerName}-${event.playerHero}-${event.ultimateId}`;
  },

  isAddEvent: (event) => event.type === 'charged',
  isRemoveEvent: (event) => event.type === 'end',
  isResetEvent: (event) => event.type === 'round_start' || event.type === 'round_end',
  generatePreResetPoint: true,
  generatePostResetPoint: true,

  fieldNames: {
    team1Count: 'team1ChargedUltimateCount',
    team2Count: 'team2ChargedUltimateCount',
    advantageTeam: 'teamWithUltimateAdvantage',
    advantageDiff: 'ultimateAdvantageDiff'
  }
};

export const playerAliveAdvantageConfig: TeamAdvantageConfig<string> = {
  getTeamNumber: (event, teams) => {
    if (event.type === 'kill') {
      if (event.victimTeam === teams.team1Name) return 1;
      if (event.victimTeam === teams.team2Name) return 2;
      return null;
    }
    if (event.type === 'spawn') {
      if (event.playerTeam === teams.team1Name) return 1;
      if (event.playerTeam === teams.team2Name) return 2;
      return null;
    }
    return null;
  },

  getItemKey: (event) => {
    if (event.type === 'kill') {
      return `${event.victimName}-${event.victimHero}`;
    }
    if (event.type === 'spawn') {
      return `${event.playerName}-${event.playerHero}`;
    }
    return null;
  },

  isAddEvent: (event) => event.type === 'spawn',
  isRemoveEvent: (event) => event.type === 'kill',
  isResetEvent: (event) => event.type === 'round_start' || event.type === 'round_end',
  generatePreResetPoint: true,
  generatePostResetPoint: true,

  fieldNames: {
    team1Count: 'team1AliveCount',
    team2Count: 'team2AliveCount',
    advantageTeam: 'teamWithAliveAdvantage',
    advantageDiff: 'aliveAdvantageDiff'
  }
}; 