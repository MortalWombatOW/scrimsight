import { describe, it, expect, vi } from 'vitest';
import * as ScrimsightDataModel from "../../ScrimsightDataModel";
import { getRoleFromHero } from "../../hero";
import {
  calculatePlaytime,
  calculateUltsUsed,
  calculateTotalAssists,
  calculateRoleBasedKills,
  calculateUltKills,
  calculateTeamfightsParticipated,
  calculateTeamfightsWon,
  calculateTeamfightsWonWithUlt,
  calculateTeamfightsWithFirstKill,
  calculateTeamfightsWithFirstDeath,
  calculateTeamfightsWonWithFirstKill,
  calculateTeamfightsWonWithFirstDeath,
  calculateDeathsWithUltAvailable,
} from "./baseStatCollection";

// Mock the hero module
vi.mock("../../hero", () => ({
  getRoleFromHero: vi.fn(),
}));

const mockGetRoleFromHero = vi.mocked(getRoleFromHero);

describe('baseStatCollection - calculatePlaytime', () => {
  it('should calculate total playtime from player lives', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      playerLives: [
        { matchId: 'match1', roundIndex: 1, player: 'player1', duration: 120 } as ScrimsightDataModel.PlayerLife,
        { matchId: 'match1', roundIndex: 1, player: 'player1', duration: 80 } as ScrimsightDataModel.PlayerLife,
        { matchId: 'match1', roundIndex: 1, player: 'player2', duration: 100 } as ScrimsightDataModel.PlayerLife,
        { matchId: 'match2', roundIndex: 1, player: 'player1', duration: 90 } as ScrimsightDataModel.PlayerLife,
      ],
    };

    const result = calculatePlaytime(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, 'match1', '1', 'player1');
    expect(result).toBe(200);
  });

  it('should return 0 when no player lives found', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      playerLives: [],
    };

    const result = calculatePlaytime(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, 'match1', '1', 'player1');
    expect(result).toBe(0);
  });

  it('should filter by match ID, round number, and player name', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      playerLives: [
        { matchId: 'match1', roundIndex: 1, player: 'player1', duration: 120 } as ScrimsightDataModel.PlayerLife,
        { matchId: 'match1', roundIndex: 2, player: 'player1', duration: 80 } as ScrimsightDataModel.PlayerLife,
        { matchId: 'match2', roundIndex: 1, player: 'player1', duration: 90 } as ScrimsightDataModel.PlayerLife,
        { matchId: 'match1', roundIndex: 1, player: 'player2', duration: 100 } as ScrimsightDataModel.PlayerLife,
      ],
    };

    const result = calculatePlaytime(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, 'match1', '1', 'player1');
    expect(result).toBe(120);
  });

  it('should handle string round numbers correctly', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      playerLives: [
        { matchId: 'match1', roundIndex: 2, player: 'player1', duration: 150 } as ScrimsightDataModel.PlayerLife,
      ],
    };

    const result = calculatePlaytime(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, 'match1', '2', 'player1');
    expect(result).toBe(150);
  });
});

describe('baseStatCollection - calculateUltsUsed', () => {
  it('should return ultimatesUsed from stat event', () => {
    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      ultimatesUsed: 3,
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateUltsUsed(statEvent);
    expect(result).toBe(3);
  });

  it('should return 0 when ultimatesUsed is undefined', () => {
    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      ultimatesUsed: undefined,
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateUltsUsed(statEvent);
    expect(result).toBe(0);
  });

  it('should return 0 when ultimatesUsed is null', () => {
    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      ultimatesUsed: null,
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateUltsUsed(statEvent);
    expect(result).toBe(0);
  });
});

describe('baseStatCollection - calculateTotalAssists', () => {
  it('should sum offensive and defensive assists', () => {
    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      offensiveAssists: 5,
      defensiveAssists: 3,
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTotalAssists(statEvent);
    expect(result).toBe(8);
  });

  it('should handle undefined offensive assists', () => {
    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      offensiveAssists: undefined,
      defensiveAssists: 3,
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTotalAssists(statEvent);
    expect(result).toBe(3);
  });

  it('should handle undefined defensive assists', () => {
    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      offensiveAssists: 5,
      defensiveAssists: undefined,
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTotalAssists(statEvent);
    expect(result).toBe(5);
  });

  it('should handle both assists being undefined', () => {
    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      offensiveAssists: undefined,
      defensiveAssists: undefined,
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTotalAssists(statEvent);
    expect(result).toBe(0);
  });

  it('should handle null values', () => {
    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      offensiveAssists: null,
      defensiveAssists: null,
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTotalAssists(statEvent);
    expect(result).toBe(0);
  });
});

describe('baseStatCollection - calculateRoleBasedKills', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should count kills by victim role', () => {
    mockGetRoleFromHero.mockImplementation((hero: string) => {
      if (hero === 'Reinhardt') return 'tank';
      if (hero === 'Tracer') return 'damage';
      if (hero === 'Mercy') return 'support';
      return 'damage';
    });

    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      kill: [
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', victimHero: 'Reinhardt' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', victimHero: 'Mercy' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', victimHero: 'Tracer' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', victimHero: 'Reinhardt' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', attackerName: 'player2', attackerHero: 'Tracer', victimHero: 'Mercy' } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateRoleBasedKills(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toEqual({
      tankKills: 2,
      damageKills: 1,
      supportKills: 1,
    });
  });

  it('should return zero counts when no kills found', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      kill: [],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateRoleBasedKills(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toEqual({
      tankKills: 0,
      damageKills: 0,
      supportKills: 0,
    });
  });

  it('should filter by match ID, attacker name, and attacker hero', () => {
    mockGetRoleFromHero.mockImplementation((hero: string) => {
      if (hero === 'Reinhardt') return 'tank';
      return 'damage';
    });

    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      kill: [
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', victimHero: 'Reinhardt' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match2', attackerName: 'player1', attackerHero: 'Tracer', victimHero: 'Reinhardt' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', attackerName: 'player2', attackerHero: 'Tracer', victimHero: 'Reinhardt' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Genji', victimHero: 'Reinhardt' } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateRoleBasedKills(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toEqual({
      tankKills: 1,
      damageKills: 0,
      supportKills: 0,
    });
  });
});

describe('baseStatCollection - calculateUltKills', () => {
  it('should count kills within ultimate usage windows', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      ultimateEnd: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 120 } as ScrimsightDataModel.UltimateEndLogEvent,
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 200 } as ScrimsightDataModel.UltimateEndLogEvent,
      ],
      kill: [
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', matchTime: 110 } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', matchTime: 118 } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', matchTime: 120 } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', matchTime: 190 } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', matchTime: 100 } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateUltKills(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(4); // kills at 110, 118, 120, 190 are within 15 seconds before ult end
  });

  it('should return 0 when no ultimate events found', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      ultimateEnd: [],
      kill: [
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', matchTime: 110 } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateUltKills(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should return 0 when no kills found', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      ultimateEnd: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 120 } as ScrimsightDataModel.UltimateEndLogEvent,
      ],
      kill: [],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateUltKills(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should not count kills outside the 15-second window', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      ultimateEnd: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 120 } as ScrimsightDataModel.UltimateEndLogEvent,
      ],
      kill: [
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', matchTime: 104 } as ScrimsightDataModel.KillLogEvent, // 16 seconds before
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', matchTime: 121 } as ScrimsightDataModel.KillLogEvent, // 1 second after
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateUltKills(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should count each kill only once even if multiple ultimates overlap', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      ultimateEnd: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 120 } as ScrimsightDataModel.UltimateEndLogEvent,
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 125 } as ScrimsightDataModel.UltimateEndLogEvent,
      ],
      kill: [
        { matchId: 'match1', attackerName: 'player1', attackerHero: 'Tracer', matchTime: 115 } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateUltKills(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(1); // Kill at 115 matches both ultimates but should only count once
  });
});

describe('baseStatCollection - calculateTeamfightsParticipated', () => {
  it('should count teamfights where player is alive at start', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          start: {
            team1: { alivePlayers: ['player1', 'player2'] },
            team2: { alivePlayers: ['player3', 'player4'] },
          },
        } as ScrimsightDataModel.Teamfight,
        {
          matchId: 'match1',
          start: {
            team1: { alivePlayers: ['player2', 'player5'] },
            team2: { alivePlayers: ['player1', 'player4'] },
          },
        } as ScrimsightDataModel.Teamfight,
        {
          matchId: 'match1',
          start: {
            team1: { alivePlayers: ['player2', 'player5'] },
            team2: { alivePlayers: ['player3', 'player4'] },
          },
        } as ScrimsightDataModel.Teamfight,
        {
          matchId: 'match2',
          start: {
            team1: { alivePlayers: ['player1', 'player2'] },
            team2: { alivePlayers: ['player3', 'player4'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsParticipated(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(2);
  });

  it('should return 0 when no teamfights found', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsParticipated(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should count teamfights where player is in either team', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
        {
          matchId: 'match1',
          start: {
            team1: { alivePlayers: ['player2'] },
            team2: { alivePlayers: ['player1'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsParticipated(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(2);
  });
});

describe('baseStatCollection - calculateTeamfightsWon', () => {
  it('should count teamfights where player participated and their team won', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          winner: 'team1',
          start: {
            team1: { alivePlayers: ['player1', 'player2'] },
            team2: { alivePlayers: ['player3', 'player4'] },
          },
        } as ScrimsightDataModel.Teamfight,
        {
          matchId: 'match1',
          winner: 'team2',
          start: {
            team1: { alivePlayers: ['player1', 'player2'] },
            team2: { alivePlayers: ['player3', 'player4'] },
          },
        } as ScrimsightDataModel.Teamfight,
        {
          matchId: 'match1',
          winner: 'team1',
          start: {
            team1: { alivePlayers: ['player1', 'player5'] },
            team2: { alivePlayers: ['player3', 'player4'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerTeam: 'team1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWon(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(2); // First and third teamfights: player1 participated and team1 won
  });

  it('should return 0 when player team never wins', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          winner: 'team2',
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerTeam: 'team1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWon(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should only count teamfights where player participated', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          winner: 'team1',
          start: {
            team1: { alivePlayers: ['player2'] },
            team2: { alivePlayers: ['player3'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerTeam: 'team1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWon(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });
});

describe('baseStatCollection - calculateTeamfightsWonWithUlt', () => {
  it('should count teamfights won where player used ultimate during the fight', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          winner: 'team1',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
        {
          matchId: 'match1',
          winner: 'team1',
          startTime: 200,
          endTime: 220,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      ultimateEnd: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 110 } as ScrimsightDataModel.UltimateEndLogEvent,
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 250 } as ScrimsightDataModel.UltimateEndLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
      playerTeam: 'team1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWonWithUlt(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(1); // Only first teamfight has ultimate used during fight time
  });

  it('should return 0 when no ultimates used during won teamfights', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          winner: 'team1',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      ultimateEnd: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 90 } as ScrimsightDataModel.UltimateEndLogEvent,
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 130 } as ScrimsightDataModel.UltimateEndLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
      playerTeam: 'team1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWonWithUlt(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should only count won teamfights', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          winner: 'team2',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      ultimateEnd: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 110 } as ScrimsightDataModel.UltimateEndLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
      playerTeam: 'team1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWonWithUlt(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });
});

describe('baseStatCollection - calculateTeamfightsWithFirstKill', () => {
  it('should count teamfights where player made the first kill', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
        {
          matchId: 'match1',
          startTime: 200,
          endTime: 220,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      kill: [
        { matchId: 'match1', matchTime: 110, attackerName: 'player1' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', matchTime: 115, attackerName: 'player2' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', matchTime: 205, attackerName: 'player2' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', matchTime: 210, attackerName: 'player1' } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWithFirstKill(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(1); // Only first teamfight where player1 made first kill
  });

  it('should return 0 when player never makes first kill', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      kill: [
        { matchId: 'match1', matchTime: 110, attackerName: 'player2' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', matchTime: 115, attackerName: 'player1' } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWithFirstKill(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should handle teamfights with no kills', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      kill: [],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWithFirstKill(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should only count kills within teamfight time window', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      kill: [
        { matchId: 'match1', matchTime: 90, attackerName: 'player1' } as ScrimsightDataModel.KillLogEvent, // before teamfight
        { matchId: 'match1', matchTime: 130, attackerName: 'player1' } as ScrimsightDataModel.KillLogEvent, // after teamfight
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWithFirstKill(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });
});

describe('baseStatCollection - calculateTeamfightsWithFirstDeath', () => {
  it('should count teamfights where player had the first death', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
        {
          matchId: 'match1',
          startTime: 200,
          endTime: 220,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      kill: [
        { matchId: 'match1', matchTime: 110, victimName: 'player1' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', matchTime: 115, victimName: 'player2' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', matchTime: 205, victimName: 'player2' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', matchTime: 210, victimName: 'player1' } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWithFirstDeath(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(1); // Only first teamfight where player1 had first death
  });

  it('should return 0 when player never has first death', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      kill: [
        { matchId: 'match1', matchTime: 110, victimName: 'player2' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', matchTime: 115, victimName: 'player1' } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWithFirstDeath(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should handle teamfights with no deaths', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      kill: [],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWithFirstDeath(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });
});

describe('baseStatCollection - calculateTeamfightsWonWithFirstKill', () => {
  it('should count won teamfights where player made the first kill', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          winner: 'team1',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
        {
          matchId: 'match1',
          winner: 'team2',
          startTime: 200,
          endTime: 220,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      kill: [
        { matchId: 'match1', matchTime: 110, attackerName: 'player1' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', matchTime: 205, attackerName: 'player1' } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerTeam: 'team1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWonWithFirstKill(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(1); // Only first teamfight: team1 won and player1 made first kill
  });

  it('should return 0 when player makes first kill but team loses', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          winner: 'team2',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      kill: [
        { matchId: 'match1', matchTime: 110, attackerName: 'player1' } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerTeam: 'team1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWonWithFirstKill(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should return 0 when team wins but player did not make first kill', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          winner: 'team1',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      kill: [
        { matchId: 'match1', matchTime: 110, attackerName: 'player2' } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerTeam: 'team1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWonWithFirstKill(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });
});

describe('baseStatCollection - calculateTeamfightsWonWithFirstDeath', () => {
  it('should count won teamfights where player had the first death', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          winner: 'team1',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
        {
          matchId: 'match1',
          winner: 'team2',
          startTime: 200,
          endTime: 220,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      kill: [
        { matchId: 'match1', matchTime: 110, victimName: 'player1' } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', matchTime: 205, victimName: 'player1' } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerTeam: 'team1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWonWithFirstDeath(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(1); // Only first teamfight: team1 won and player1 had first death
  });

  it('should return 0 when player has first death but team loses', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          winner: 'team2',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      kill: [
        { matchId: 'match1', matchTime: 110, victimName: 'player1' } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerTeam: 'team1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWonWithFirstDeath(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should return 0 when team wins but player did not have first death', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      teamfights: [
        {
          matchId: 'match1',
          winner: 'team1',
          startTime: 100,
          endTime: 120,
          start: {
            team1: { alivePlayers: ['player1'] },
            team2: { alivePlayers: ['player2'] },
          },
        } as ScrimsightDataModel.Teamfight,
      ],
      kill: [
        { matchId: 'match1', matchTime: 110, victimName: 'player2' } as ScrimsightDataModel.KillLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerTeam: 'team1',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateTeamfightsWonWithFirstDeath(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });
});

describe('baseStatCollection - calculateDeathsWithUltAvailable', () => {
  it('should count deaths when player had ultimate available', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      kill: [
        { matchId: 'match1', victimName: 'player1', victimHero: 'Tracer', matchTime: 150 } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', victimName: 'player1', victimHero: 'Tracer', matchTime: 250 } as ScrimsightDataModel.KillLogEvent,
      ],
      ultimateCharged: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 100, ultimateId: 1 } as ScrimsightDataModel.UltimateChargedLogEvent,
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 200, ultimateId: 2 } as ScrimsightDataModel.UltimateChargedLogEvent,
      ],
      ultimateEnd: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 120, ultimateId: 1 } as ScrimsightDataModel.UltimateEndLogEvent,
        // ultimateId: 2 is not used before second death
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateDeathsWithUltAvailable(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(1); // Only second death at 250 has ultimate available (ultimateId: 2)
  });

  it('should return 0 when no ultimates were charged', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      kill: [
        { matchId: 'match1', victimName: 'player1', victimHero: 'Tracer', matchTime: 150 } as ScrimsightDataModel.KillLogEvent,
      ],
      ultimateCharged: [],
      ultimateEnd: [],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateDeathsWithUltAvailable(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should return 0 when no deaths occurred', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      kill: [],
      ultimateCharged: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 100, ultimateId: 1 } as ScrimsightDataModel.UltimateChargedLogEvent,
      ],
      ultimateEnd: [],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateDeathsWithUltAvailable(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should not count deaths when ultimate was used before death', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      kill: [
        { matchId: 'match1', victimName: 'player1', victimHero: 'Tracer', matchTime: 150 } as ScrimsightDataModel.KillLogEvent,
      ],
      ultimateCharged: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 100, ultimateId: 1 } as ScrimsightDataModel.UltimateChargedLogEvent,
      ],
      ultimateEnd: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 130, ultimateId: 1 } as ScrimsightDataModel.UltimateEndLogEvent,
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateDeathsWithUltAvailable(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should not count deaths when ultimate was charged after death', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      kill: [
        { matchId: 'match1', victimName: 'player1', victimHero: 'Tracer', matchTime: 100 } as ScrimsightDataModel.KillLogEvent,
      ],
      ultimateCharged: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 150, ultimateId: 1 } as ScrimsightDataModel.UltimateChargedLogEvent,
      ],
      ultimateEnd: [],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateDeathsWithUltAvailable(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(0);
  });

  it('should handle multiple ultimates with complex timing', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      kill: [
        { matchId: 'match1', victimName: 'player1', victimHero: 'Tracer', matchTime: 110 } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', victimName: 'player1', victimHero: 'Tracer', matchTime: 190 } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', victimName: 'player1', victimHero: 'Tracer', matchTime: 280 } as ScrimsightDataModel.KillLogEvent,
      ],
      ultimateCharged: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 100, ultimateId: 1 } as ScrimsightDataModel.UltimateChargedLogEvent,
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 200, ultimateId: 2 } as ScrimsightDataModel.UltimateChargedLogEvent,
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 250, ultimateId: 3 } as ScrimsightDataModel.UltimateChargedLogEvent,
      ],
      ultimateEnd: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 120, ultimateId: 1 } as ScrimsightDataModel.UltimateEndLogEvent,
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 220, ultimateId: 2 } as ScrimsightDataModel.UltimateEndLogEvent,
        // ultimateId: 3 is not used before third death
      ],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateDeathsWithUltAvailable(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(2); // First death (ultimateId: 1 available) and third death (ultimateId: 3 available)
  });

  it('should filter by match ID, player name, and hero', () => {
    const mockDataModel: Partial<ScrimsightDataModel.ScrimsightDataModel> = {
      kill: [
        { matchId: 'match1', victimName: 'player1', victimHero: 'Tracer', matchTime: 150 } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match2', victimName: 'player1', victimHero: 'Tracer', matchTime: 150 } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', victimName: 'player2', victimHero: 'Tracer', matchTime: 150 } as ScrimsightDataModel.KillLogEvent,
        { matchId: 'match1', victimName: 'player1', victimHero: 'Genji', matchTime: 150 } as ScrimsightDataModel.KillLogEvent,
      ],
      ultimateCharged: [
        { matchId: 'match1', playerName: 'player1', playerHero: 'Tracer', matchTime: 100, ultimateId: 1 } as ScrimsightDataModel.UltimateChargedLogEvent,
        { matchId: 'match2', playerName: 'player1', playerHero: 'Tracer', matchTime: 100, ultimateId: 2 } as ScrimsightDataModel.UltimateChargedLogEvent,
        { matchId: 'match1', playerName: 'player2', playerHero: 'Tracer', matchTime: 100, ultimateId: 3 } as ScrimsightDataModel.UltimateChargedLogEvent,
        { matchId: 'match1', playerName: 'player1', playerHero: 'Genji', matchTime: 100, ultimateId: 4 } as ScrimsightDataModel.UltimateChargedLogEvent,
      ],
      ultimateEnd: [],
    };

    const statEvent: ScrimsightDataModel.PlayerStatLogEvent = {
      matchId: 'match1',
      playerName: 'player1',
      playerHero: 'Tracer',
    } as ScrimsightDataModel.PlayerStatLogEvent;

    const result = calculateDeathsWithUltAvailable(mockDataModel as ScrimsightDataModel.ScrimsightDataModel, statEvent);
    expect(result).toBe(1); // Only first death matches all criteria
  });
});