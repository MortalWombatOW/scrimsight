import { describe, it, expect, vi } from 'vitest';
import { uniqueCategoryValuesAtomFn } from '@atoms/uniqueCategoryValuesAtom';

describe('uniqueCategoryValuesAtomFn', () => {
  it('should extract unique category values from player stats', async () => {
    // Mock getter function
    const mockGet = vi.fn().mockResolvedValue({
      rows: [
        {
          matchId: 'match1',
          playerName: 'Player1',
          playerTeam: 'Team A',
          playerHero: 'Tracer',
        }
      ],
      categoryKeys: ['playerName', 'playerTeam', 'playerHero'],
      numericalKeys: []
    });

    const result = await uniqueCategoryValuesAtomFn(mockGet);

    expect(result).toBeDefined();
    expect(result.playerName).toEqual(['Player1']);
    expect(result.playerTeam).toEqual(['Team A']);
    expect(result.playerHero).toEqual(['Tracer']);
  });

  it('should handle empty data', async () => {
    const mockGet = vi.fn().mockResolvedValue({
      rows: [],
      categoryKeys: ['playerName', 'playerTeam', 'playerHero'],
      numericalKeys: []
    });

    const result = await uniqueCategoryValuesAtomFn(mockGet);

    expect(result).toBeDefined();
    expect(result.playerName).toEqual([]);
    expect(result.playerTeam).toEqual([]);
    expect(result.playerHero).toEqual([]);
  });
});