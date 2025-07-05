
import { describe, it, expect } from 'vitest';
import { buildTeamRelationships } from './teamRelationships';
import * as ScrimsightDataModel from '../ScrimsightDataModel';

describe('buildTeamRelationships', () => {
  it('should build team relationships correctly', () => {
    const dataModel = {
      scrims: [
        { scrim: 'scrim-1', teams: ['A', 'B'], matches: [], date: new Date(), team1MatchesWon: 0, team2MatchesWon: 0 },
        { scrim: 'scrim-2', teams: ['A', 'C'], matches: [], date: new Date(), team1MatchesWon: 0, team2MatchesWon: 0 },
      ],
      playerStat: [
        { playerName: 'Player1', playerTeam: 'A', matchId: '1', roundNumber: '1', playerHero: 'Ana', eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0, matchTime: 0, type: 'player_stat' },
        { playerName: 'Player2', playerTeam: 'A', matchId: '1', roundNumber: '1', playerHero: 'Ana', eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0, matchTime: 0, type: 'player_stat' },
        { playerName: 'Player3', playerTeam: 'B', matchId: '1', roundNumber: '1', playerHero: 'Ana', eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0, matchTime: 0, type: 'player_stat' },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const teams = buildTeamRelationships(dataModel);

    expect(teams).toHaveLength(3);
    expect(teams.find(t => t.team === 'A')?.players).toEqual(['Player1', 'Player2']);
    expect(teams.find(t => t.team === 'A')?.scrims).toEqual(['scrim-1', 'scrim-2']);
  });
});
