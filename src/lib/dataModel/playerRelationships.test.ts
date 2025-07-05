
import { describe, it, expect } from 'vitest';
import { buildPlayerRelationships } from './playerRelationships';
import * as ScrimsightDataModel from '../ScrimsightDataModel';
import { getRoleFromHero } from '../hero';

describe('buildPlayerRelationships', () => {
  it('should build player relationships correctly', () => {
    const dataModel = {
      heroSpawn: [
        { matchId: '1', playerName: 'Player1', playerTeam: 'TeamA', playerHero: 'Ana', matchTime: 0, type: 'hero_spawn', previousHero: 'Ana', heroTimePlayed: 0 },
      ],
      heroSwap: [
        { matchId: '1', playerName: 'Player1', playerTeam: 'TeamA', playerHero: 'Mercy', matchTime: 100, type: 'hero_swap', previousHero: 'Ana', heroTimePlayed: 0 },
      ],
      kill: [
        { matchId: '1', attackerName: 'Player1', attackerTeam: 'TeamA', attackerHero: 'Ana', victimName: 'Player2', victimTeam: 'TeamB', victimHero: 'Mercy', matchTime: 50, eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false },
      ],
      damage: [
        { matchId: '1', attackerName: 'Player1', attackerTeam: 'TeamA', attackerHero: 'Ana', victimName: 'Player2', victimTeam: 'TeamB', victimHero: 'Mercy', matchTime: 20, eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false },
      ],
      scrims: [
        { scrim: 'scrim-1', teams: ['TeamA', 'TeamB'], matches: ['1'], date: new Date(), team1MatchesWon: 0, team2MatchesWon: 0 },
      ],
      matches: [
        { match: '1', scrim: 'scrim-1', teams: ['TeamA', 'TeamB'], map: 'Lijiang Tower', date: new Date(), rounds: [], duration: 0, team1Score: 0, team2Score: 0, winningTeam: 'TeamA', gameMode: 'Control' },
      ],
      playerLives: [
        { matchId: '1', roundIndex: 1, startTime: 0, endTime: 100, duration: 100, player: 'Player1', hero: 'Ana', causeOfStart: 'spawn', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
        { matchId: '1', roundIndex: 1, startTime: 100, endTime: 200, duration: 100, player: 'Player1', hero: 'Mercy', causeOfStart: 'swap', causeOfEnd: 'round_end', eliminations: 0, assists: 0, ultimatesUsed: 0 },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const players = buildPlayerRelationships(dataModel);

    expect(players).toHaveLength(2);
    const player1 = players.find(p => p.player === 'Player1');
    expect(player1?.teams).toEqual(['TeamA']);
    expect(player1?.scrims).toEqual(['scrim-1']);
    expect(player1?.matches).toEqual(['1']);
    expect(player1?.heroes).toEqual([
      { hero: 'Ana', playtime: 100 },
      { hero: 'Mercy', playtime: 100 },
    ]);
    expect(player1?.roles).toEqual([
      { role: getRoleFromHero('Ana'), playtime: 100 },
      { role: getRoleFromHero('Mercy'), playtime: 100 },
    ]);
  });
});
