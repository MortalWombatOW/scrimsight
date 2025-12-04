import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { usePlayerHeroStats } from './usePlayerMetrics';
import { useStatsWithDerived } from './useStats';

// Mock useStatsWithDerived
vi.mock('./useStats', () => ({
  useStatsWithDerived: vi.fn(),
}));

describe('usePlayerHeroStats', () => {
  it('should aggregate playtime for the same hero across multiple records', () => {
    const mockStats = [
      {
        playerHero: 'Tracer',
        playtime: 100,
        eliminations: 5,
        deaths: 2,
        // Add other required fields with dummy values
        matchId: '1',
        roundNumber: 1,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerRole: 'damage',
      },
      {
        playerHero: 'Tracer',
        playtime: 200,
        eliminations: 3,
        deaths: 1,
        matchId: '1',
        roundNumber: 2,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerRole: 'damage',
      },
      {
        playerHero: 'Genji',
        playtime: 150,
        eliminations: 4,
        deaths: 3,
        matchId: '1',
        roundNumber: 1,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerRole: 'damage',
      },
    ];

    (useStatsWithDerived as any).mockReturnValue(mockStats);

    const { result } = renderHook(() => usePlayerHeroStats('Player1'));

    // Should have 2 entries (Tracer, Genji) instead of 3
    expect(result.current).toHaveLength(2);

    const tracerStats = result.current.find(s => s.playerHero === 'Tracer');
    expect(tracerStats).toBeDefined();
    expect(tracerStats?.playtime).toBe(300); // 100 + 200
    expect(tracerStats?.eliminations).toBe(8); // 5 + 3
    expect(tracerStats?.deaths).toBe(3); // 2 + 1

    const genjiStats = result.current.find(s => s.playerHero === 'Genji');
    expect(genjiStats).toBeDefined();
    expect(genjiStats?.playtime).toBe(150);
  });
});
