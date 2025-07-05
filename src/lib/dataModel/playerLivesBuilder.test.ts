
import { describe, it, expect } from 'vitest';
import { buildPlayerLives } from './playerLivesBuilder';
import * as ScrimsightDataModel from '../ScrimsightDataModel';

describe('buildPlayerLives', () => {
  it('should build player lives correctly for spawns, swaps, and deaths', () => {
    const dataModel = {
      heroSpawn: [
        { matchId: 'match1', playerName: 'PlayerA', playerHero: 'Ana', matchTime: 100, type: 'hero_spawn', previousHero: 'Ana', heroTimePlayed: 0 },
        { matchId: 'match1', playerName: 'PlayerB', playerHero: 'Reinhardt', matchTime: 110, type: 'hero_spawn', previousHero: 'Reinhardt', heroTimePlayed: 0 },
      ],
      heroSwap: [
        { matchId: 'match1', playerName: 'PlayerA', playerHero: 'Mercy', matchTime: 200, type: 'hero_swap', previousHero: 'Ana', heroTimePlayed: 0 },
      ],
      kill: [
        { matchId: 'match1', victimName: 'PlayerB', victimHero: 'Reinhardt', matchTime: 250, type: 'kill', attackerName: '', attackerHero: '', attackerTeam: '', eventAbility: '', eventDamage: 0, isCriticalHit: false, isEnvironmental: false, victimTeam: '' },
      ],
      roundStart: [
        { matchId: 'match1', roundNumber: 1, matchTime: 0, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
        { matchId: 'match1', roundNumber: 2, matchTime: 300, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
      ],
      roundEnd: [
        { matchId: 'match1', roundNumber: 1, matchTime: 290, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
        { matchId: 'match1', roundNumber: 2, matchTime: 500, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const playerLives = buildPlayerLives(dataModel);

    expect(playerLives).toHaveLength(4); // PlayerA (Ana), PlayerA (Mercy), PlayerB (Reinhardt), PlayerA (Mercy) in Round 2

    // PlayerA - Ana life
    const playerA_Ana = playerLives.find(l => l.player === 'PlayerA' && l.hero === 'Ana' && l.causeOfStart === 'spawn');
    expect(playerA_Ana).toBeDefined();
    expect(playerA_Ana?.startTime).toBe(100);
    expect(playerA_Ana?.endTime).toBe(200);
    expect(playerA_Ana?.duration).toBe(100);
    expect(playerA_Ana?.causeOfEnd).toBe('swap');
    expect(playerA_Ana?.roundIndex).toBe(1);

    // PlayerA - Mercy life
    const playerA_Mercy = playerLives.find(l => l.player === 'PlayerA' && l.hero === 'Mercy' && l.causeOfStart === 'swap');
    expect(playerA_Mercy).toBeDefined();
    expect(playerA_Mercy?.startTime).toBe(200);
    expect(playerA_Mercy?.endTime).toBe(290); // Ends at round end
    expect(playerA_Mercy?.duration).toBe(90);
    expect(playerA_Mercy?.causeOfEnd).toBe('round_end');
    expect(playerA_Mercy?.roundIndex).toBe(1);

    // PlayerB - Reinhardt life
    const playerB_Reinhardt = playerLives.find(l => l.player === 'PlayerB' && l.hero === 'Reinhardt');
    expect(playerB_Reinhardt).toBeDefined();
    expect(playerB_Reinhardt?.startTime).toBe(110);
    expect(playerB_Reinhardt?.endTime).toBe(250);
    expect(playerB_Reinhardt?.duration).toBe(140);
    expect(playerB_Reinhardt?.causeOfEnd).toBe('death');
    expect(playerB_Reinhardt?.roundIndex).toBe(1);

    // PlayerA - Mercy life in round 2 (from round end of round 1)
    const playerA_Mercy_Round2 = playerLives.find(l => l.player === 'PlayerA' && l.hero === 'Mercy' && l.roundIndex === 2);
    expect(playerA_Mercy_Round2).toBeDefined();
    expect(playerA_Mercy_Round2?.startTime).toBe(300); // Starts at round 2 start
    expect(playerA_Mercy_Round2?.endTime).toBe(500); // Ends at round 2 end
    expect(playerA_Mercy_Round2?.duration).toBe(200);
    expect(playerA_Mercy_Round2?.causeOfEnd).toBe('round_end');
    expect(playerA_Mercy_Round2?.roundIndex).toBe(2);
  });

  it('should handle cases where a player is alive at the end of the last round', () => {
    const dataModel = {
      heroSpawn: [
        { matchId: 'match1', playerName: 'PlayerA', playerHero: 'Ana', matchTime: 100, type: 'hero_spawn', previousHero: 'Ana', heroTimePlayed: 0 },
      ],
      heroSwap: [],
      kill: [],
      roundStart: [
        { matchId: 'match1', roundNumber: 1, matchTime: 0, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
      ],
      roundEnd: [
        { matchId: 'match1', roundNumber: 1, matchTime: 500, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const playerLives = buildPlayerLives(dataModel);

    expect(playerLives).toHaveLength(1);
    const playerA_Ana = playerLives[0];
    expect(playerA_Ana.player).toBe('PlayerA');
    expect(playerA_Ana.hero).toBe('Ana');
    expect(playerA_Ana.startTime).toBe(100);
    expect(playerA_Ana.endTime).toBe(500);
    expect(playerA_Ana.duration).toBe(400);
    expect(playerA_Ana.causeOfEnd).toBe('round_end');
  });

  it('should correctly assign roundIndex based on roundStart events', () => {
    const dataModel = {
      heroSpawn: [
        { matchId: 'match1', playerName: 'PlayerA', playerHero: 'Ana', matchTime: 50, type: 'hero_spawn', previousHero: 'Ana', heroTimePlayed: 0 },
        { matchId: 'match1', playerName: 'PlayerB', playerHero: 'Reinhardt', matchTime: 350, type: 'hero_spawn', previousHero: 'Reinhardt', heroTimePlayed: 0 },
      ],
      heroSwap: [],
      kill: [],
      roundStart: [
        { matchId: 'match1', roundNumber: 1, matchTime: 0, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
        { matchId: 'match1', roundNumber: 2, matchTime: 300, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
      ],
      roundEnd: [
        { matchId: 'match1', roundNumber: 1, matchTime: 290, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
        { matchId: 'match1', roundNumber: 2, matchTime: 500, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const playerLives = buildPlayerLives(dataModel);

    const playerA_life = playerLives.find(l => l.player === 'PlayerA');
    expect(playerA_life?.roundIndex).toBe(1);

    const playerB_life = playerLives.find(l => l.player === 'PlayerB');
    expect(playerB_life?.roundIndex).toBe(2);
  });

  it('should sort player lives by matchId and startTime', () => {
    const dataModel = {
      heroSpawn: [
        { matchId: 'match2', playerName: 'PlayerC', playerHero: 'Ana', matchTime: 50, type: 'hero_spawn', previousHero: 'Ana', heroTimePlayed: 0 },
        { matchId: 'match1', playerName: 'PlayerA', playerHero: 'Ana', matchTime: 100, type: 'hero_spawn', previousHero: 'Ana', heroTimePlayed: 0 },
        { matchId: 'match1', playerName: 'PlayerB', playerHero: 'Reinhardt', matchTime: 110, type: 'hero_spawn', previousHero: 'Reinhardt', heroTimePlayed: 0 },
      ],
      heroSwap: [],
      kill: [],
      roundStart: [
        { matchId: 'match1', roundNumber: 1, matchTime: 0, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
        { matchId: 'match2', roundNumber: 1, matchTime: 0, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
      ],
      roundEnd: [
        { matchId: 'match1', roundNumber: 1, matchTime: 200, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
        { matchId: 'match2', roundNumber: 1, matchTime: 150, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const playerLives = buildPlayerLives(dataModel);

    expect(playerLives[0].matchId).toBe('match1');
    expect(playerLives[0].player).toBe('PlayerA');
    expect(playerLives[1].matchId).toBe('match1');
    expect(playerLives[1].player).toBe('PlayerB');
    expect(playerLives[2].matchId).toBe('match2');
    expect(playerLives[2].player).toBe('PlayerC');
  });
});
