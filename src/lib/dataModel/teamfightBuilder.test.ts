
import { describe, it, expect } from 'vitest';
import { buildTeamfights } from './teamfightBuilder';
import * as ScrimsightDataModel from '../ScrimsightDataModel';

describe('buildTeamfights', () => {
  it('should build teamfights correctly based on kill events', () => {
    const dataModel = {
      kill: [
        { matchId: 'match1', matchTime: 100, attackerName: 'PlayerA', attackerTeam: 'TeamA', attackerHero: 'Ana', victimName: 'PlayerX', victimTeam: 'TeamX', victimHero: 'Mercy', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false },
        { matchId: 'match1', matchTime: 105, attackerName: 'PlayerB', attackerTeam: 'TeamA', attackerHero: 'Reinhardt', victimName: 'PlayerY', victimTeam: 'TeamX', victimHero: 'Soldier: 76', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false },
        { matchId: 'match1', matchTime: 120, attackerName: 'PlayerX', attackerTeam: 'TeamX', attackerHero: 'Mercy', victimName: 'PlayerA', victimTeam: 'TeamA', victimHero: 'Ana', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false },
        { matchId: 'match1', matchTime: 300, attackerName: 'PlayerC', attackerTeam: 'TeamA', attackerHero: 'Soldier: 76', victimName: 'PlayerZ', victimTeam: 'TeamX', victimHero: 'Zenyatta', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false },
      ],
      matchStart: [
        { matchId: 'match1', team1Name: 'TeamA', team2Name: 'TeamX', mapName: 'Lijiang Tower', mapType: 'Control', matchTime: 0 },
      ],
      roundStart: [
        { matchId: 'match1', roundNumber: 1, matchTime: 0, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
      ],
      roundEnd: [
        { matchId: 'match1', roundNumber: 1, matchTime: 500, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
      ],
      playerLives: [
        { matchId: 'match1', roundIndex: 1, startTime: 0, endTime: 500, duration: 500, player: 'PlayerA', hero: 'Ana', causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
        { matchId: 'match1', roundIndex: 1, startTime: 0, endTime: 500, duration: 500, player: 'PlayerB', hero: 'Reinhardt', causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
        { matchId: 'match1', roundIndex: 1, startTime: 0, endTime: 500, duration: 500, player: 'PlayerC', hero: 'Soldier: 76', causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
        { matchId: 'match1', roundIndex: 1, startTime: 0, endTime: 500, duration: 500, player: 'PlayerX', hero: 'Mercy', causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
        { matchId: 'match1', roundIndex: 1, startTime: 0, endTime: 500, duration: 500, player: 'PlayerY', hero: 'Soldier: 76', causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
        { matchId: 'match1', roundIndex: 1, startTime: 0, endTime: 500, duration: 500, player: 'PlayerZ', hero: 'Zenyatta', causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
      ],
      playerStat: [
        { matchId: 'match1', playerName: 'PlayerA', playerTeam: 'TeamA', playerHero: 'Ana', matchTime: 0, roundNumber: '1', eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0 },
        { matchId: 'match1', playerName: 'PlayerB', playerTeam: 'TeamA', playerHero: 'Reinhardt', matchTime: 0, roundNumber: '1', eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0 },
        { matchId: 'match1', playerName: 'PlayerC', playerTeam: 'TeamA', playerHero: 'Soldier: 76', matchTime: 0, roundNumber: '1', eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0 },
        { matchId: 'match1', playerName: 'PlayerX', playerTeam: 'TeamX', playerHero: 'Mercy', matchTime: 0, roundNumber: '1', eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0 },
        { matchId: 'match1', playerName: 'PlayerY', playerTeam: 'TeamX', playerHero: 'Soldier: 76', matchTime: 0, roundNumber: '1', eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0 },
        { matchId: 'match1', playerName: 'PlayerZ', playerTeam: 'TeamX', playerHero: 'Zenyatta', matchTime: 0, roundNumber: '1', eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0 },
      ],
      ultimateCharged: [
        { matchId: 'match1', playerName: 'PlayerA', playerHero: 'Ana', matchTime: 90, ultimateId: 1, type: 'ultimate_charged' },
        { matchId: 'match1', playerName: 'PlayerX', playerHero: 'Mercy', matchTime: 110, ultimateId: 2, type: 'ultimate_charged' },
      ],
      ultimateStart: [
        { matchId: 'match1', playerName: 'PlayerA', playerHero: 'Ana', matchTime: 100, ultimateId: 1, type: 'ultimate_start' },
        { matchId: 'match1', playerName: 'PlayerX', playerHero: 'Mercy', matchTime: 120, ultimateId: 2, type: 'ultimate_start' },
      ],
      ultimateEnd: [
        { matchId: 'match1', playerName: 'PlayerA', playerHero: 'Ana', matchTime: 110, ultimateId: 1, type: 'ultimate_end' },
        { matchId: 'match1', playerName: 'PlayerX', playerHero: 'Mercy', matchTime: 130, ultimateId: 2, type: 'ultimate_end' },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const teamfights = buildTeamfights(dataModel);

    expect(teamfights).toHaveLength(2);

    // First teamfight
    expect(teamfights[0].matchId).toBe('match1');
    expect(teamfights[0].startTime).toBe(98); // 100 - 2 (padding)
    expect(teamfights[0].endTime).toBe(122); // 120 + 2 (padding)
    expect(teamfights[0].duration).toBe(24);
    expect(teamfights[0].end.team1.kills).toEqual(['PlayerX']);
    expect(teamfights[0].end.team2.kills).toEqual(['PlayerY', 'PlayerZ']);
    expect(teamfights[0].winner).toBe('TeamX'); // PlayerX (Mercy) killed PlayerA (Ana)
    expect(teamfights[0].team1KillsPerUlt).toBe(1); // 1 kill / 1 ult
    expect(teamfights[0].team2KillsPerUlt).toBe(1); // 1 kill / 1 ult

    // Second teamfight
    expect(teamfights[1].matchId).toBe('match1');
    expect(teamfights[1].startTime).toBe(298); // 300 - 2 (padding)
    expect(teamfights[1].endTime).toBe(302); // 300 + 2 (padding)
    expect(teamfights[1].duration).toBe(4);
    expect(teamfights[1].end.team1.kills).toEqual(['PlayerZ']);
    expect(teamfights[1].end.team2.kills).toEqual([]);
    expect(teamfights[1].winner).toBe('TeamA');
    expect(teamfights[1].team1KillsPerUlt).toBe(0); // No ult used
    expect(teamfights[1].team2KillsPerUlt).toBe(0); // No ult used
  });

  it('should handle no kill events', () => {
    const dataModel = {
      kill: [],
      matchStart: [
        { matchId: 'match1', team1Name: 'TeamA', team2Name: 'TeamX', mapName: 'Lijiang Tower', mapType: 'Control', matchTime: 0 },
      ],
      roundStart: [],
      roundEnd: [],
      playerLives: [],
      playerStat: [],
      ultimateCharged: [],
      ultimateStart: [],
      ultimateEnd: [],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const teamfights = buildTeamfights(dataModel);
    expect(teamfights).toHaveLength(0);
  });

  it('should correctly identify players alive at start/end of teamfight', () => {
    const dataModel = {
      kill: [
        { matchId: 'match1', matchTime: 100, attackerName: 'PlayerA', attackerTeam: 'TeamA', attackerHero: 'Ana', victimName: 'PlayerX', victimTeam: 'TeamX', victimHero: 'Mercy', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false },
      ],
      matchStart: [
        { matchId: 'match1', team1Name: 'TeamA', team2Name: 'TeamX', mapName: 'Lijiang Tower', mapType: 'Control', matchTime: 0 },
      ],
      roundStart: [
        { matchId: 'match1', roundNumber: 1, matchTime: 0, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
      ],
      roundEnd: [
        { matchId: 'match1', roundNumber: 1, matchTime: 500, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
      ],
      playerLives: [
        { matchId: 'match1', roundIndex: 1, startTime: 0, endTime: 500, duration: 500, player: 'PlayerA', hero: 'Ana', causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
        { matchId: 'match1', roundIndex: 1, startTime: 0, endTime: 500, duration: 500, player: 'PlayerB', hero: 'Reinhardt', causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
        { matchId: 'match1', roundIndex: 1, startTime: 0, endTime: 500, duration: 500, player: 'PlayerX', hero: 'Mercy', causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
      ],
      playerStat: [
        { matchId: 'match1', playerName: 'PlayerA', playerTeam: 'TeamA', playerHero: 'Ana', matchTime: 0, roundNumber: '1', eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0 },
        { matchId: 'match1', playerName: 'PlayerB', playerTeam: 'TeamA', playerHero: 'Reinhardt', matchTime: 0, roundNumber: '1', eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0 },
        { matchId: 'match1', playerName: 'PlayerX', playerTeam: 'TeamX', playerHero: 'Mercy', matchTime: 0, roundNumber: '1', eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0 },
      ],
      ultimateCharged: [],
      ultimateStart: [],
      ultimateEnd: [],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const teamfights = buildTeamfights(dataModel);
    expect(teamfights).toHaveLength(1);
    expect(teamfights[0].start.team1.alivePlayers).toEqual(['PlayerA', 'PlayerB']);
    expect(teamfights[0].end.team1.alivePlayers).toEqual(['PlayerA', 'PlayerB']);
    expect(teamfights[0].start.team2.alivePlayers).toEqual(['PlayerX']);
    expect(teamfights[0].end.team2.alivePlayers).toEqual(['PlayerX']);
  });
});
