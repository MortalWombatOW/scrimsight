import { describe, it, expect } from 'vitest';
import { calculatePlaytime, calculateUltsUsed, calculateTotalAssists, calculateRoleBasedKills, calculateUltKills, calculateTeamfightsParticipated, calculateTeamfightsWon, calculateTeamfightsWonWithUlt, calculateTeamfightsWithFirstKill, calculateTeamfightsWithFirstDeath, calculateTeamfightsWonWithFirstKill, calculateTeamfightsWonWithFirstDeath, calculateDeathsWithUltAvailable } from './baseStatCollection';
import * as ScrimsightDataModel from '../../ScrimsightDataModel';

describe('baseStatCollection', () => {
  const mockDataModel = {
    playerLives: [
      { matchId: 'm1', roundIndex: 1, player: 'p1', hero: 'Ana', startTime: 0, endTime: 100, duration: 100, causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
      { matchId: 'm1', roundIndex: 1, player: 'p1', hero: 'Ana', startTime: 150, endTime: 200, duration: 50, causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
      { matchId: 'm1', roundIndex: 2, player: 'p1', hero: 'Ana', startTime: 300, endTime: 400, duration: 100, causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
    ],
    kill: [
      { matchId: 'm1', attackerName: 'p1', attackerHero: 'Ana', victimHero: 'Reinhardt', matchTime: 10, attackerTeam: 'TeamA', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false, victimName: 'victim1', victimTeam: 'TeamB' },
      { matchId: 'm1', attackerName: 'p1', attackerHero: 'Ana', victimHero: 'Soldier: 76', matchTime: 20, attackerTeam: 'TeamA', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false, victimName: 'victim2', victimTeam: 'TeamB' },
      { matchId: 'm1', attackerName: 'p1', attackerHero: 'Ana', victimHero: 'Mercy', matchTime: 30, attackerTeam: 'TeamA', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false, victimName: 'victim3', victimTeam: 'TeamB' },
      { matchId: 'm1', attackerName: 'p2', attackerHero: 'Mercy', victimName: 'p1', victimHero: 'Ana', matchTime: 180, attackerTeam: 'TeamB', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false, victimTeam: 'TeamA', },
    ],
    ultimateCharged: [
      { matchId: 'm1', playerName: 'p1', playerHero: 'Ana', matchTime: 50, ultimateId: 1, type: 'ultimate_charged' },
      { matchId: 'm1', playerName: 'p1', playerHero: 'Ana', matchTime: 250, ultimateId: 2, type: 'ultimate_charged' },
    ],
    ultimateStart: [
      // Removed the ultimateStart event at 60 to make ult available at 180
      { matchId: 'm1', playerName: 'p1', playerHero: 'Ana', matchTime: 260, ultimateId: 2, type: 'ultimate_start' },
    ],
    ultimateEnd: [
      { matchId: 'm1', playerName: 'p1', playerHero: 'Ana', matchTime: 70, ultimateId: 1, type: 'ultimate_end' },
      { matchId: 'm1', playerName: 'p1', playerHero: 'Ana', matchTime: 270, ultimateId: 2, type: 'ultimate_end' },
    ],
    teamfights: [
      { matchId: 'm1', roundIndex: 1, startTime: 5, endTime: 40, duration: 35, winner: 'TeamA', team1KillsPerUlt: 0, team2KillsPerUlt: 0, start: { team1: { teamName: 'TeamA', alivePlayers: [], ultimatesReady: [] }, team2: { teamName: 'TeamB', alivePlayers: [], ultimatesReady: [] } }, end: { team1: { teamName: 'TeamA', alivePlayers: [], ultimatesReady: [], ultimatesUsed: [], kills: ['pX'] }, team2: { teamName: 'TeamB', alivePlayers: [], ultimatesReady: [], ultimatesUsed: [], kills: [] } } },
      { matchId: 'm1', roundIndex: 1, startTime: 170, endTime: 190, duration: 20, winner: 'TeamB', team1KillsPerUlt: 0, team2KillsPerUlt: 0, start: { team1: { teamName: 'TeamA', alivePlayers: [], ultimatesReady: [] }, team2: { teamName: 'TeamB', alivePlayers: [], ultimatesReady: [] } }, end: { team1: { teamName: 'TeamA', alivePlayers: [], ultimatesReady: [], ultimatesUsed: [], kills: [] }, team2: { teamName: 'TeamB', alivePlayers: [], ultimatesReady: [], ultimatesUsed: [], kills: ['p1'] } } },
    ],
  } as unknown as ScrimsightDataModel.ScrimsightDataModel;

  const mockStatEvent: ScrimsightDataModel.PlayerStatLogEvent = {
    matchId: 'm1',
    roundNumber: '1',
    playerName: 'p1',
    playerTeam: 'TeamA',
    playerHero: 'Ana',
    eliminations: 0, finalBlows: 0, deaths: 0, allDamageDealt: 0, barrierDamageDealt: 0, heroDamageDealt: 0, healingDealt: 0, healingReceived: 0, selfHealing: 0, damageTaken: 0, damageBlocked: 0, defensiveAssists: 0, offensiveAssists: 0, ultimatesEarned: 0, ultimatesUsed: 0, multikillBest: 0, multikills: 0, soloKills: 0, objectiveKills: 0, environmentalKills: 0, environmentalDeaths: 0, criticalHits: 0, criticalHitAccuracy: 0, scopedAccuracy: 0, scopedCriticalHitAccuracy: 0, scopedCriticalHitKills: 0, shotsFired: 0, shotsHit: 0, shotsMissed: 0, scopedShotsFired: 0, scopedShotsHit: 0, weaponAccuracy: 0, matchTime: 0, type: 'player_stat'
  };

  it('calculatePlaytime should return correct playtime', () => {
    expect(calculatePlaytime(mockDataModel, 'm1', '1', 'p1')).toBe(150);
    expect(calculatePlaytime(mockDataModel, 'm1', '2', 'p1')).toBe(100);
    expect(calculatePlaytime(mockDataModel, 'm2', '1', 'p1')).toBe(0);
  });

  it('calculateUltsUsed should return ultimatesUsed from statEvent', () => {
    expect(calculateUltsUsed({ ...mockStatEvent, ultimatesUsed: 5 })).toBe(5);
    expect(calculateUltsUsed({ ...mockStatEvent, ultimatesUsed: undefined })).toBe(0);
  });

  it('calculateTotalAssists should sum offensive and defensive assists', () => {
    expect(calculateTotalAssists({ ...mockStatEvent, offensiveAssists: 5, defensiveAssists: 3 })).toBe(8);
    expect(calculateTotalAssists({ ...mockStatEvent, offensiveAssists: undefined, defensiveAssists: 3 })).toBe(3);
    expect(calculateTotalAssists({ ...mockStatEvent, offensiveAssists: 5, defensiveAssists: undefined })).toBe(5);
    expect(calculateTotalAssists({ ...mockStatEvent, offensiveAssists: undefined, defensiveAssists: undefined })).toBe(0);
  });

  it('calculateRoleBasedKills should count kills by victim role', () => {
    const result = calculateRoleBasedKills(mockDataModel, mockStatEvent);
    expect(result.tankKills).toBe(1);
    expect(result.damageKills).toBe(1);
    expect(result.supportKills).toBe(1);
  });

  it('calculateUltKills should count kills during ultimate activity', () => {
    const result = calculateUltKills(mockDataModel, mockStatEvent);
    expect(result).toBe(0); // No kills during ult in mock data
  });

  it('calculateTeamfightsParticipated should count relevant teamfights', () => {
    const result = calculateTeamfightsParticipated(mockDataModel, mockStatEvent);
    expect(result).toBe(1); // Only the second teamfight is relevant to p1
  });

  it('calculateTeamfightsWon should count teamfights won by player\'s team', () => {
    const result = calculateTeamfightsWon(mockDataModel, mockStatEvent);
    expect(result).toBe(0); // p1's team (TeamA) did not win the relevant teamfight
  });

  it('calculateTeamfightsWonWithUlt should count teamfights won with player\'s ult', () => {
    const result = calculateTeamfightsWonWithUlt(mockDataModel, mockStatEvent);
    expect(result).toBe(0);
  });

  it('calculateTeamfightsWithFirstKill should count teamfights where player got first kill', () => {
    const result = calculateTeamfightsWithFirstKill(mockDataModel, mockStatEvent);
    expect(result).toBe(0);
  });

  it('calculateTeamfightsWithFirstDeath should count teamfights where player/team had first death', () => {
    const result = calculateTeamfightsWithFirstDeath(mockDataModel, mockStatEvent);
    expect(result).toBe(1);
  });

  it('calculateTeamfightsWonWithFirstKill should count teamfights won with player\'s first kill', () => {
    const result = calculateTeamfightsWonWithFirstKill(mockDataModel, mockStatEvent);
    expect(result).toBe(0);
  });

  it('calculateTeamfightsWonWithFirstDeath should count teamfights won with player/team\'s first death', () => {
    const result = calculateTeamfightsWonWithFirstDeath(mockDataModel, mockStatEvent);
    expect(result).toBe(0);
  });

  it('calculateDeathsWithUltAvailable should count deaths when ult was available', () => {
    const result = calculateDeathsWithUltAvailable(mockDataModel, mockStatEvent);
    expect(result).toBe(1); // p1 dies at 180, ult charged at 50, not used until 260
  });
});
