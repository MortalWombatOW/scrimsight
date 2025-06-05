import { describe, it, expect } from 'vitest';
import { matchDataAtomFn } from '@atoms/matchDataAtom';

describe('matchDataAtomFn', () => {
  it('should handle empty input arrays', () => {
    const result = matchDataAtomFn([], [], [], [], [], []);
    expect(result).toEqual([]);
  });

  it('should create match data from input events', () => {
    const result = matchDataAtomFn([{
      matchId: 'test-match',
      name: 'test-match.log',
      fileModified: 1234567890,
      dateString: '2023-01-01',
      timeString: '12:00'
    }], [{
      matchId: 'test-match',
      type: 'matchStart',
      matchTime: 0,
      mapName: 'King\'s Row',
      mapType: 'Escort',
      team1Name: 'Team Alpha',
      team2Name: 'Team Beta'
    }], [{
      matchId: 'test-match',
      type: 'matchEnd',
      matchTime: 1200,
      roundNumber: 3,
      team1Score: 2,
      team2Score: 1
    }], [{
      matchId: 'test-match',
      type: 'playerStat',
      matchTime: 1200,
      roundNumber: '1',
      playerTeam: 'Team Alpha',
      playerName: 'Player1',
      playerHero: 'Tracer',
      eliminations: 15,
      finalBlows: 12,
      deaths: 5,
      allDamageDealt: 8000,
      barrierDamageDealt: 1000,
      heroDamageDealt: 7000,
      healingDealt: 0,
      healingReceived: 2000,
      selfHealing: 500,
      damageTaken: 3000,
      damageBlocked: 0,
      defensiveAssists: 3,
      offensiveAssists: 8,
      ultimatesEarned: 4,
      ultimatesUsed: 3,
      multikillBest: 3,
      multikills: 2,
      soloKills: 6,
      objectiveKills: 10,
      environmentalKills: 1,
      environmentalDeaths: 0,
      criticalHits: 80,
      criticalHitAccuracy: 35.5,
      scopedAccuracy: 0,
      scopedCriticalHitAccuracy: 0,
      scopedCriticalHitKills: 0,
      shotsFired: 400,
      shotsHit: 280,
      shotsMissed: 120,
      scopedShotsFired: 0,
      scopedShotsHit: 0,
      weaponAccuracy: 70.0
    }], [{
      matchId: 'test-match',
      startTime: 0,
      endTime: 1200,
      duration: 1200
    }], [{
      matchId: 'test-match',
      type: 'roundEnd',
      matchTime: 400,
      roundNumber: 1,
      capturingTeam: 'Team Alpha',
      team1Score: 1,
      team2Score: 0,
      objectiveIndex: 3,
      controlTeam1Progress: 100,
      controlTeam2Progress: 0,
      matchTimeRemaining: 800
    }]);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      matchId: 'test-match',
      fileName: 'test-match.log',
      map: 'King\'s Row',
      mode: 'Escort',
      team1Name: 'Team Alpha',
      team2Name: 'Team Beta',
      team1Score: 2,
      team2Score: 1,
      duration: 1200,
      winner: 'Team Alpha'
    });
  });

  it('should handle missing match start data', () => {
    const result = matchDataAtomFn([{
      matchId: 'test-match',
      name: 'test-match.log',
      fileModified: 1234567890,
      dateString: '2023-01-01',
      timeString: '12:00'
    }], [], [], [], [], []);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      matchId: 'test-match',
      fileName: 'test-match.log',
      map: '',
      mode: '',
      team1Name: '',
      team2Name: ''
    });
  });

  it('should handle missing match end data', () => {
    const result = matchDataAtomFn([{
      matchId: 'test-match',
      name: 'test-match.log',
      fileModified: 1234567890,
      dateString: '2023-01-01',
      timeString: '12:00'
    }], [{
      matchId: 'test-match',
      type: 'matchStart',
      matchTime: 0,
      mapName: 'Hanamura',
      mapType: 'Assault',
      team1Name: 'Red Team',
      team2Name: 'Blue Team'
    }], [], [], [], []);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      matchId: 'test-match',
      map: 'Hanamura',
      mode: 'Assault',
      team1Name: 'Red Team',
      team2Name: 'Blue Team',
      team1Score: 0,
      team2Score: 0,
      winner: null
    });
  });

  it('should determine winner correctly from scores', () => {
    const result = matchDataAtomFn([{
      matchId: 'test-match',
      name: 'test-match.log',
      fileModified: 1234567890,
      dateString: '2023-01-01',
      timeString: '12:00'
    }], [{
      matchId: 'test-match',
      type: 'matchStart',
      matchTime: 0,
      mapName: 'Dorado',
      mapType: 'Escort',
      team1Name: 'Team A',
      team2Name: 'Team B'
    }], [{
      matchId: 'test-match',
      type: 'matchEnd',
      matchTime: 1000,
      roundNumber: 2,
      team1Score: 1,
      team2Score: 2
    }], [], [], []);
    
    expect(result).toHaveLength(1);
    expect(result[0].winner).toBe('Team B');
  });

  it('should extract team players from player stats', () => {
    const result = matchDataAtomFn([{
      matchId: 'test-match',
      name: 'test-match.log',
      fileModified: 1234567890,
      dateString: '2023-01-01',
      timeString: '12:00'
    }], [{
      matchId: 'test-match',
      type: 'matchStart',
      matchTime: 0,
      mapName: 'Nepal',
      mapType: 'Control',
      team1Name: 'Alpha',
      team2Name: 'Beta'
    }], [], [{
      matchId: 'test-match',
      type: 'playerStat',
      matchTime: 500,
      roundNumber: '1',
      playerTeam: 'Alpha',
      playerName: 'Player1',
      playerHero: 'Reinhardt',
      eliminations: 5,
      finalBlows: 3,
      deaths: 2,
      allDamageDealt: 4000,
      barrierDamageDealt: 2000,
      heroDamageDealt: 2000,
      healingDealt: 0,
      healingReceived: 3000,
      selfHealing: 800,
      damageTaken: 5000,
      damageBlocked: 12000,
      defensiveAssists: 2,
      offensiveAssists: 3,
      ultimatesEarned: 2,
      ultimatesUsed: 1,
      multikillBest: 2,
      multikills: 1,
      soloKills: 1,
      objectiveKills: 4,
      environmentalKills: 0,
      environmentalDeaths: 1,
      criticalHits: 10,
      criticalHitAccuracy: 20.0,
      scopedAccuracy: 0,
      scopedCriticalHitAccuracy: 0,
      scopedCriticalHitKills: 0,
      shotsFired: 50,
      shotsHit: 40,
      shotsMissed: 10,
      scopedShotsFired: 0,
      scopedShotsHit: 0,
      weaponAccuracy: 80.0
    }, {
      matchId: 'test-match',
      type: 'playerStat',
      matchTime: 500,
      roundNumber: '1',
      playerTeam: 'Beta',
      playerName: 'Player2',
      playerHero: 'Ana',
      eliminations: 8,
      finalBlows: 4,
      deaths: 3,
      allDamageDealt: 3000,
      barrierDamageDealt: 500,
      heroDamageDealt: 2500,
      healingDealt: 8000,
      healingReceived: 1000,
      selfHealing: 300,
      damageTaken: 2000,
      damageBlocked: 0,
      defensiveAssists: 10,
      offensiveAssists: 4,
      ultimatesEarned: 3,
      ultimatesUsed: 3,
      multikillBest: 1,
      multikills: 0,
      soloKills: 2,
      objectiveKills: 5,
      environmentalKills: 0,
      environmentalDeaths: 0,
      criticalHits: 25,
      criticalHitAccuracy: 60.0,
      scopedAccuracy: 75.0,
      scopedCriticalHitAccuracy: 80.0,
      scopedCriticalHitKills: 3,
      shotsFired: 100,
      shotsHit: 75,
      shotsMissed: 25,
      scopedShotsFired: 40,
      scopedShotsHit: 30,
      weaponAccuracy: 75.0
    }], [], []);
    
    expect(result).toHaveLength(1);
    expect(result[0].team1Players).toEqual(['Player1']);
    expect(result[0].team2Players).toEqual(['Player2']);
  });
});