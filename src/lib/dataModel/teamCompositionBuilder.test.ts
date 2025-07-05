
import { describe, it, expect } from 'vitest';
import { buildTeamCompositions } from './teamCompositionBuilder';
import * as ScrimsightDataModel from '../ScrimsightDataModel';

describe('buildTeamCompositions', () => {
  it('should build team compositions correctly', () => {
    const dataModel = {
      matches: [
        { match: 'match1', teams: ['TeamA', 'TeamB'], rounds: [1], map: 'Lijiang Tower', date: new Date(), duration: 0, team1Score: 0, team2Score: 0, winningTeam: '' },
      ],
      heroSpawn: [
        { matchId: 'match1', playerName: 'Player1', playerTeam: 'TeamA', playerHero: 'Ana', matchTime: 100, type: 'hero_spawn', previousHero: 'Ana', heroTimePlayed: 0 },
        { matchId: 'match1', playerName: 'Player2', playerTeam: 'TeamA', playerHero: 'Reinhardt', matchTime: 100, type: 'hero_spawn', previousHero: 'Reinhardt', heroTimePlayed: 0 },
      ],
      heroSwap: [
        { matchId: 'match1', playerName: 'Player1', playerTeam: 'TeamA', playerHero: 'Mercy', matchTime: 200, type: 'hero_swap', previousHero: 'Ana', heroTimePlayed: 0 },
      ],
      roundStart: [
        { matchId: 'match1', roundNumber: 1, matchTime: 0, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
      ],
      roundEnd: [
        { matchId: 'match1', roundNumber: 1, matchTime: 500, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const teamCompositions = buildTeamCompositions(dataModel);

    expect(teamCompositions).toHaveLength(2); // Initial composition + composition after swap

    // Initial composition
    expect(teamCompositions[0].matchId).toBe('match1');
    expect(teamCompositions[0].team).toBe('TeamA');
    expect(teamCompositions[0].startTime).toBe(0);
    expect(teamCompositions[0].endTime).toBe(200);
    expect(teamCompositions[0].duration).toBe(200);
    expect(teamCompositions[0].composition.support).toEqual(['Ana']);
    expect(teamCompositions[0].composition.tank).toEqual(['Reinhardt']);

    // Composition after swap
    expect(teamCompositions[1].matchId).toBe('match1');
    expect(teamCompositions[1].team).toBe('TeamA');
    expect(teamCompositions[1].startTime).toBe(200);
    expect(teamCompositions[1].endTime).toBe(500);
    expect(teamCompositions[1].duration).toBe(300);
    expect(teamCompositions[1].composition.support).toEqual(['Mercy']);
    expect(teamCompositions[1].composition.tank).toEqual(['Reinhardt']);
  });

  it('should handle no hero events', () => {
    const dataModel = {
      matches: [
        { match: 'match1', teams: ['TeamA', 'TeamB'], rounds: [1], map: 'Lijiang Tower', date: new Date(), duration: 0, team1Score: 0, team2Score: 0, winningTeam: '' },
      ],
      heroSpawn: [],
      heroSwap: [],
      roundStart: [
        { matchId: 'match1', roundNumber: 1, matchTime: 0, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
      ],
      roundEnd: [
        { matchId: 'match1', roundNumber: 1, matchTime: 500, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const teamCompositions = buildTeamCompositions(dataModel);
    expect(teamCompositions).toHaveLength(0);
  });

  it('should sort team compositions by matchId, roundIndex, and startTime', () => {
    const dataModel = {
      matches: [
        { match: 'match2', teams: ['TeamC', 'TeamD'], rounds: [1], map: 'Busan', date: new Date(), duration: 0, team1Score: 0, team2Score: 0, winningTeam: '' },
        { match: 'match1', teams: ['TeamA', 'TeamB'], rounds: [1, 2], map: 'Lijiang Tower', date: new Date(), duration: 0, team1Score: 0, team2Score: 0, winningTeam: '' },
      ],
      heroSpawn: [
        { matchId: 'match1', playerName: 'Player1', playerTeam: 'TeamA', playerHero: 'Ana', matchTime: 100, type: 'hero_spawn', previousHero: 'Ana', heroTimePlayed: 0 },
        { matchId: 'match2', playerName: 'Player3', playerTeam: 'TeamC', playerHero: 'Mercy', matchTime: 50, type: 'hero_spawn', previousHero: 'Mercy', heroTimePlayed: 0 },
        { matchId: 'match1', playerName: 'Player1', playerTeam: 'TeamA', playerHero: 'Mercy', matchTime: 300, type: 'hero_swap', previousHero: 'Ana', heroTimePlayed: 0 },
      ],
      heroSwap: [],
      roundStart: [
        { matchId: 'match1', roundNumber: 1, matchTime: 0, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
        { matchId: 'match2', roundNumber: 1, matchTime: 0, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
        { matchId: 'match1', roundNumber: 2, matchTime: 250, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
      ],
      roundEnd: [
        { matchId: 'match1', roundNumber: 1, matchTime: 240, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
        { matchId: 'match2', roundNumber: 1, matchTime: 400, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
        { matchId: 'match1', roundNumber: 2, matchTime: 500, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const teamCompositions = buildTeamCompositions(dataModel);

    expect(teamCompositions[0].matchId).toBe('match1');
    expect(teamCompositions[0].roundIndex).toBe(1);
    expect(teamCompositions[0].startTime).toBe(0);

    expect(teamCompositions[1].matchId).toBe('match1');
    expect(teamCompositions[1].roundIndex).toBe(1);
    expect(teamCompositions[1].startTime).toBe(100);

    expect(teamCompositions[2].matchId).toBe('match1');
    expect(teamCompositions[2].roundIndex).toBe(2);
    expect(teamCompositions[2].startTime).toBe(250);

    expect(teamCompositions[3].matchId).toBe('match2');
    expect(teamCompositions[3].roundIndex).toBe(1);
    expect(teamCompositions[3].startTime).toBe(50);
  });
});
