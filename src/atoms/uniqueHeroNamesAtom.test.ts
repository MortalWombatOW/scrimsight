import { describe, it, expect } from 'vitest';
import { uniqueHeroNamesAtomFn } from '@atoms/uniqueHeroNamesAtom';
import type { PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys } from '@atoms';
import type { Metric } from '@library';

describe('uniqueHeroNamesAtomFn', () => {
  const mockCategoryKeys = ['matchId', 'roundNumber', 'playerTeam', 'playerName', 'playerHero', 'playerRole'] as PlayerStatsCategoryKeys[];
  const mockNumericalKeys = ['playtime'] as PlayerStatsBaseNumericalKeys[]; // Add at least one numerical key

  const createMockPlayerStatsBase = (heroName: string | null | undefined): PlayerStatsBase => ({
    matchId: 'testMatch',
    roundNumber: '1',
    playerTeam: 'Team A',
    playerName: 'Player 1',
    playerHero: heroName as string, // Cast to string, null/undefined handled by function
    playerRole: 'support',
    playtime: 100,
    eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0,
    heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0,
    damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0,
    multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0,
    criticalHits: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0,
  });

  it('should return unique hero names sorted alphabetically', async () => {
    const playerStatsData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys> = {
      categoryKeys: mockCategoryKeys,
      numericalKeys: mockNumericalKeys,
      rows: [
        createMockPlayerStatsBase('Ana'),
        createMockPlayerStatsBase('Mercy'),
        createMockPlayerStatsBase('Genji'),
        createMockPlayerStatsBase('Ana'),
        createMockPlayerStatsBase('Zenyatta'),
        createMockPlayerStatsBase(null),
        createMockPlayerStatsBase(undefined),
      ],
    };
    const result = await uniqueHeroNamesAtomFn(playerStatsData);
    expect(result).toEqual(['Ana', 'Genji', 'Mercy', 'Zenyatta']);
  });

  it('should return an empty array if no hero names are present', async () => {
    const playerStatsData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys> = {
      categoryKeys: mockCategoryKeys,
      numericalKeys: mockNumericalKeys,
      rows: [
        createMockPlayerStatsBase(null),
        createMockPlayerStatsBase(undefined),
      ],
    };
    const result = await uniqueHeroNamesAtomFn(playerStatsData);
    expect(result).toEqual([]);
  });

  it('should handle an empty input array', async () => {
    const playerStatsData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys> = {
      categoryKeys: mockCategoryKeys,
      numericalKeys: mockNumericalKeys,
      rows: [],
    };
    const result = await uniqueHeroNamesAtomFn(playerStatsData);
    expect(result).toEqual([]);
  });

  it('should handle mixed valid and invalid hero names', async () => {
    const playerStatsData: Metric<PlayerStatsBase, PlayerStatsCategoryKeys, PlayerStatsBaseNumericalKeys> = {
      categoryKeys: mockCategoryKeys,
      numericalKeys: mockNumericalKeys,
      rows: [
        createMockPlayerStatsBase('Reinhardt'),
        createMockPlayerStatsBase('D.Va'),
        createMockPlayerStatsBase(null),
        createMockPlayerStatsBase('Reinhardt'),
        createMockPlayerStatsBase('Lucio'),
        createMockPlayerStatsBase(''), // Empty string is a valid hero name if it appears
      ],
    };
    const result = await uniqueHeroNamesAtomFn(playerStatsData);
    // If '' is treated as a valid hero name by the function, it should be in the result.
    // Based on current uniqueHeroNamesAtomFn (if (row.playerHero)), '' would be included.
    expect(result).toEqual(['D.Va', 'Lucio', 'Reinhardt']);
  });
});
