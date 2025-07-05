
import { describe, it, expect } from 'vitest';
import { buildKillCounts } from './killCountBuilder';
import * as ScrimsightDataModel from '../ScrimsightDataModel';

describe('buildKillCounts', () => {
  it('should build kill counts by match and by match and round correctly', () => {
    const dataModel = {
      kill: [
        { matchId: 'match1', attackerName: 'PlayerA', victimName: 'PlayerX', matchTime: 100, type: 'kill', attackerHero: '', attackerTeam: '', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false, victimHero: '', victimTeam: '' },
        { matchId: 'match1', attackerName: 'PlayerA', victimName: 'PlayerY', matchTime: 150, type: 'kill', attackerHero: '', attackerTeam: '', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false, victimHero: '', victimTeam: '' },
        { matchId: 'match1', attackerName: 'PlayerB', victimName: 'PlayerX', matchTime: 160, type: 'kill', attackerHero: '', attackerTeam: '', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false, victimHero: '', victimTeam: '' },
        { matchId: 'match2', attackerName: 'PlayerC', victimName: 'PlayerZ', matchTime: 50, type: 'kill', attackerHero: '', attackerTeam: '', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false, victimHero: '', victimTeam: '' },
      ],
      roundStart: [
        { matchId: 'match1', roundNumber: 1, matchTime: 0, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
        { matchId: 'match1', roundNumber: 2, matchTime: 200, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
        { matchId: 'match2', roundNumber: 1, matchTime: 0, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const killCounts = buildKillCounts(dataModel);

    // Test byMatch
    expect(killCounts.byMatch).toHaveLength(4);
    expect(killCounts.byMatch).toContainEqual({ matchId: 'match1', player: 'PlayerA', victim: 'PlayerX', killCount: 1 });
    expect(killCounts.byMatch).toContainEqual({ matchId: 'match1', player: 'PlayerA', victim: 'PlayerY', killCount: 1 });
    expect(killCounts.byMatch).toContainEqual({ matchId: 'match1', player: 'PlayerB', victim: 'PlayerX', killCount: 1 });
    expect(killCounts.byMatch).toContainEqual({ matchId: 'match2', player: 'PlayerC', victim: 'PlayerZ', killCount: 1 });

    // Test byMatchAndRound
    expect(killCounts.byMatchAndRound).toHaveLength(4);
    expect(killCounts.byMatchAndRound).toContainEqual({ matchId: 'match1', roundNumber: 1, player: 'PlayerA', victim: 'PlayerX', killCount: 1 });
    expect(killCounts.byMatchAndRound).toContainEqual({ matchId: 'match1', roundNumber: 1, player: 'PlayerA', victim: 'PlayerY', killCount: 1 });
    expect(killCounts.byMatchAndRound).toContainEqual({ matchId: 'match1', roundNumber: 1, player: 'PlayerB', victim: 'PlayerX', killCount: 1 });
    expect(killCounts.byMatchAndRound).toContainEqual({ matchId: 'match2', roundNumber: 1, player: 'PlayerC', victim: 'PlayerZ', killCount: 1 });
  });

  it('should handle no kill events', () => {
    const dataModel = {
      kill: [],
      roundStart: [],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const killCounts = buildKillCounts(dataModel);
    expect(killCounts.byMatch).toHaveLength(0);
    expect(killCounts.byMatchAndRound).toHaveLength(0);
  });
});
