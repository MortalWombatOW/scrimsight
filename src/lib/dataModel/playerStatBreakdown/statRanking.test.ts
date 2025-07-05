
import { describe, it, expect } from 'vitest';
import { buildPlayerStatBreakdownRanks } from './statRanking';
import * as ScrimsightDataModel from '../../ScrimsightDataModel';

describe('buildPlayerStatBreakdownRanks', () => {
  const mockPlayerStatBreakdown: ScrimsightDataModel.PlayerStatBreakdown = {
    total: {} as ScrimsightDataModel.PlayerStatsNumerical,
    byPlayer: [
      { playerName: 'PlayerA', eliminations: 10, deaths: 2, playtime: 100, allDamageDealt: 1000, kdr: 5 },
      { playerName: 'PlayerB', eliminations: 15, deaths: 1, playtime: 120, allDamageDealt: 1500, kdr: 15 },
      { playerName: 'PlayerC', eliminations: 10, deaths: 3, playtime: 90, allDamageDealt: 800, kdr: 3.33 },
    ] as (ScrimsightDataModel.PlayerStatsNumerical & { playerName: string; })[],
    byTeam: [
      { playerTeam: 'TeamA', eliminations: 25, deaths: 3, playtime: 220, allDamageDealt: 2500, kdr: 8.33 },
      { playerTeam: 'TeamB', eliminations: 10, deaths: 3, playtime: 90, allDamageDealt: 800, kdr: 3.33 },
    ] as (ScrimsightDataModel.PlayerStatsNumerical & { playerTeam: string; })[],
    byTeamAndPlayer: [],
    byTeamAndPlayerAndMatch: [],
    byTeamAndPlayerAndScrim: [],
    byPlayerAndHero: [],
    byRole: [],
    byHero: [],
    byTeamAndMatch: [],
    byTeamAndScrim: [],
  };

  it('should assign rank 1 to all total stats', () => {
    const ranks = buildPlayerStatBreakdownRanks(mockPlayerStatBreakdown);
    ScrimsightDataModel.playerStatsNumericalKeys.forEach(key => {
      expect(ranks.total[key]).toBe(1);
    });
  });

  it('should rank players correctly based on eliminations (higher is better)', () => {
    const ranks = buildPlayerStatBreakdownRanks(mockPlayerStatBreakdown);
    const playerARank = ranks.byPlayer.find(p => p.playerName === 'PlayerA');
    const playerBRank = ranks.byPlayer.find(p => p.playerName === 'PlayerB');
    const playerCRank = ranks.byPlayer.find(p => p.playerName === 'PlayerC');

    expect(playerBRank?.eliminations).toBe(1); // 15 elims
    expect(playerARank?.eliminations).toBe(2); // 10 elims (tied with PlayerC)
    expect(playerCRank?.eliminations).toBe(2); // 10 elims (tied with PlayerA)
  });

  it('should rank players correctly based on deaths (lower is better)', () => {
    const ranks = buildPlayerStatBreakdownRanks(mockPlayerStatBreakdown);
    const playerARank = ranks.byPlayer.find(p => p.playerName === 'PlayerA');
    const playerBRank = ranks.byPlayer.find(p => p.playerName === 'PlayerB');
    const playerCRank = ranks.byPlayer.find(p => p.playerName === 'PlayerC');

    expect(playerBRank?.deaths).toBe(1); // 1 death
    expect(playerARank?.deaths).toBe(2); // 2 deaths
    expect(playerCRank?.deaths).toBe(3); // 3 deaths
  });

  it('should handle ties correctly for kdr (higher is better)', () => {
    const customBreakdown: ScrimsightDataModel.PlayerStatBreakdown = {
      total: {} as ScrimsightDataModel.PlayerStatsNumerical,
      byPlayer: [
        { playerName: 'P1', eliminations: 10, deaths: 1, playtime: 100, allDamageDealt: 1000, kdr: 10 },
        { playerName: 'P2', eliminations: 10, deaths: 1, playtime: 100, allDamageDealt: 1000, kdr: 10 },
        { playerName: 'P3', eliminations: 5, deaths: 1, playtime: 50, allDamageDealt: 500, kdr: 5 },
      ] as (ScrimsightDataModel.PlayerStatsNumerical & { playerName: string; })[],
      byTeam: [], byTeamAndPlayer: [], byTeamAndPlayerAndMatch: [], byTeamAndPlayerAndScrim: [], byPlayerAndHero: [], byRole: [], byHero: [], byTeamAndMatch: [], byTeamAndScrim: [],
    };

    const ranks = buildPlayerStatBreakdownRanks(customBreakdown);
    const p1Rank = ranks.byPlayer.find(p => p.playerName === 'P1');
    const p2Rank = ranks.byPlayer.find(p => p.playerName === 'P2');
    const p3Rank = ranks.byPlayer.find(p => p.playerName === 'P3');

    expect(p1Rank?.kdr).toBe(1); // Tied for 1st
    expect(p2Rank?.kdr).toBe(1); // Tied for 1st
    expect(p3Rank?.kdr).toBe(3); // 3rd
  });

  it('should return empty arrays if input arrays are empty', () => {
    const emptyBreakdown: ScrimsightDataModel.PlayerStatBreakdown = {
      total: {} as ScrimsightDataModel.PlayerStatsNumerical,
      byPlayer: [], byTeam: [], byTeamAndPlayer: [], byTeamAndPlayerAndMatch: [], byTeamAndPlayerAndScrim: [], byPlayerAndHero: [], byRole: [], byHero: [], byTeamAndMatch: [], byTeamAndScrim: [],
    };
    const ranks = buildPlayerStatBreakdownRanks(emptyBreakdown);
    expect(ranks.byPlayer).toHaveLength(0);
    expect(ranks.byTeam).toHaveLength(0);
  });
});
