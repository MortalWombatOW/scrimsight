import { renderHook } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { useStatsGrouped } from './useStatsGrouped';
import { matchesRepositoryAtom } from '../data/repository';
import { ProcessedMatch, PlayerStatsBase } from '../types';
import { describe, it, expect } from 'vitest';

// Mock data helper (simplified version of the one in useStats.test.tsx)
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

const mockStats1: PlayerStatsBase = {
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

const mockStats2: PlayerStatsBase = {
  ...mockStats1,
  matchId: 'match2',
  eliminations: 5, // Different stats for aggregation test
  allDamageDealt: 2000,
};

const mockRepository = {
  match1: createMockMatch('match1', [mockStats1]),
  match2: createMockMatch('match2', [mockStats2]),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

describe('useStatsGrouped', () => {
  it('should aggregate stats correctly by player', () => {
    const { result } = renderHook(() => useStatsGrouped(['playerName']), {
      wrapper: TestProvider,
    });

    expect(result.current.rows).toHaveLength(1); // Both matches have Player1
    const playerStats = result.current.rows[0];
    
    expect(playerStats.playerName).toBe('Player1');
    expect(playerStats.eliminations).toBe(15); // 10 + 5
    expect(playerStats.allDamageDealt).toBe(7000); // 5000 + 2000
    expect(playerStats.playtime).toBe(1200); // 600 + 600
  });

  it('should calculate derived metrics on aggregated data', () => {
    const { result } = renderHook(() => useStatsGrouped(['playerName']), {
      wrapper: TestProvider,
    });

    const playerStats = result.current.rows[0];
    
    // 15 elims in 1200s (20 mins) -> 7.5 per 10 mins
    expect(playerStats.eliminationsPer10Minutes).toBe(7.5);
  });
});
