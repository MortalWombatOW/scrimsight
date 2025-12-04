import { renderHook } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { useStats, useStatsWithDerived } from './useStats';
import { matchesRepositoryAtom } from '../data/repository';
import { ProcessedMatch, PlayerStatsBase } from '../types';
import { describe, it, expect } from 'vitest';

// Mock data helper
const createMockMatch = (id: string, playerStats: PlayerStatsBase[]): ProcessedMatch => ({
  metadata: {
    matchId: id,
    fileName: `${id}.txt`,
    fileModified: Date.now(),
    dateString: '2023-01-01',
    timeString: '12:00:00',
    map: 'Kings Row',
    mode: 'Hybrid',
    team1Name: 'Team A',
    team2Name: 'Team B',
    team1Score: 3,
    team2Score: 2,
    team1Players: ['Player1'],
    team2Players: ['Player2'],
    duration: 600,
    roundWinners: [],
    winner: 'Team A',
  },
  events: {
    ability1Used: [], ability2Used: [], damage: [], defensiveAssist: [], dvaDemech: [], dvaRemech: [], healing: [], heroSpawn: [], heroSwap: [], kills: [], matchEnd: [], matchStart: [], mercyRez: [], offensiveAssist: [], playerStat: [], roundEnd: [], roundStart: [], setupComplete: [], ultimateCharged: [], ultimateEnd: [], ultimateStart: []
  },
  teamfights: [],
  playerStats: {
    categoryKeys: ['matchId', 'playerName'],
    numericalKeys: ['eliminations'],
    rows: playerStats,
  },
  roundTimes: [],
  mapTimes: { startTime: 0, endTime: 600, matchId: id, duration: 600 },
  playerStatusTimeline: new Map(),
  ultimateEvents: [],
});

const mockStats: PlayerStatsBase = {
  matchId: 'match1',
  roundNumber: '1',
  playerTeam: 'Team A',
  playerName: 'Player1',
  playerHero: 'Tracer',
  playerRole: 'damage',
  playtime: 600,
  eliminations: 10,
  finalBlows: 5,
  deaths: 2,
  allDamageDealt: 5000,
  barrierDamageDealt: 0,
  heroDamageDealt: 5000,
  healingDealt: 0,
  healingReceived: 1000,
  selfHealing: 0,
  damageTaken: 1000,
  damageBlocked: 0,
  defensiveAssists: 0,
  offensiveAssists: 2,
  ultimatesEarned: 2,
  ultimatesUsed: 2,
  multikills: 0,
  soloKills: 1,
  objectiveKills: 2,
  environmentalKills: 0,
  environmentalDeaths: 0,
  criticalHits: 10,
  shotsFired: 100,
  shotsHit: 40,
  shotsMissed: 60,
  scopedShotsFired: 0,
  scopedShotsHit: 0,
};

const mockRepository = {
  match1: createMockMatch('match1', [mockStats]),
  match2: createMockMatch('match2', [{ ...mockStats, matchId: 'match2', playerName: 'Player2', playerTeam: 'Team B', playerHero: 'Ana', playerRole: 'support' }]),
};

const HydrateAtoms = ({ initialValues, children }: { initialValues: any; children: React.ReactNode }) => {
  useHydrateAtoms(initialValues);
  return children;
};

const TestProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider>
    <HydrateAtoms initialValues={[[matchesRepositoryAtom, mockRepository]]}>
      {children}
    </HydrateAtoms>
  </Provider>
);

describe('useStats', () => {
  it('should return all stats when no filters are applied', () => {
    const { result } = renderHook(() => useStats(), {
      wrapper: TestProvider,
    });

    expect(result.current).toHaveLength(2);
  });

  it('should filter by player name', () => {
    const { result } = renderHook(() => useStats({ playerName: 'Player1' }), {
      wrapper: TestProvider,
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].playerName).toBe('Player1');
  });

  it('should filter by team', () => {
    const { result } = renderHook(() => useStats({ team: 'Team B' }), {
      wrapper: TestProvider,
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].playerTeam).toBe('Team B');
  });

  it('should filter by role', () => {
    const { result } = renderHook(() => useStats({ role: 'support' }), {
      wrapper: TestProvider,
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].playerRole).toBe('support');
  });

  it('should filter by hero', () => {
    const { result } = renderHook(() => useStats({ hero: 'Tracer' }), {
      wrapper: TestProvider,
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].playerHero).toBe('Tracer');
  });

  it('should return empty array when no matches match filters', () => {
    const { result } = renderHook(() => useStats({ playerName: 'NonExistent' }), {
      wrapper: TestProvider,
    });

    expect(result.current).toHaveLength(0);
  });
});

describe('useStatsWithDerived', () => {
  it('should calculate derived metrics correctly', () => {
    const { result } = renderHook(() => useStatsWithDerived({ playerName: 'Player1' }), {
      wrapper: TestProvider,
    });

    expect(result.current).toHaveLength(1);
    const stats = result.current[0];

    // Playtime is 600s (10 mins), so per 10 mins should equal the raw value
    expect(stats.eliminationsPer10Minutes).toBe(10);
    expect(stats.allDamageDealtPer10Minutes).toBe(5000);
    
    // Accuracy
    expect(stats.weaponAccuracy).toBe(0.4); // 40/100
  });
});
