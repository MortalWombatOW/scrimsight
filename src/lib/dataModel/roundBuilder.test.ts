
import { describe, it, expect } from 'vitest';
import { buildRounds } from './roundBuilder';
import * as ScrimsightDataModel from '../ScrimsightDataModel';

describe('buildRounds', () => {
  it('should build rounds correctly', () => {
    const dataModel = {
      matches: [
        { match: 'match1', teams: ['TeamA', 'TeamB'], rounds: [1, 2], map: 'Lijiang Tower', date: new Date(), duration: 0, team1Score: 0, team2Score: 0, winningTeam: '' },
      ],
      roundStart: [
        { matchId: 'match1', roundNumber: 1, matchTime: 100, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
        { matchId: 'match1', roundNumber: 2, matchTime: 500, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
      ],
      roundEnd: [
        { matchId: 'match1', roundNumber: 1, matchTime: 400, team1Score: 1, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
        { matchId: 'match1', roundNumber: 2, matchTime: 800, team1Score: 1, team2Score: 1, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const rounds = buildRounds(dataModel);

    expect(rounds).toHaveLength(2);
    expect(rounds[0].matchId).toBe('match1');
    expect(rounds[0].roundIndex).toBe(1);
    expect(rounds[0].startTime).toBe(100);
    expect(rounds[0].endTime).toBe(400);
    expect(rounds[0].duration).toBe(300);
    expect(rounds[0].team1Score).toBe(1);
    expect(rounds[0].team2Score).toBe(0);
    expect(rounds[0].winningTeam).toBe('TeamA');

    expect(rounds[1].matchId).toBe('match1');
    expect(rounds[1].roundIndex).toBe(2);
    expect(rounds[1].startTime).toBe(500);
    expect(rounds[1].endTime).toBe(800);
    expect(rounds[1].duration).toBe(300);
    expect(rounds[1].team1Score).toBe(1);
    expect(rounds[1].team2Score).toBe(1);
    expect(rounds[1].winningTeam).toBe('TeamA'); // Default to team1 in case of tie
  });

  it('should handle missing round start or end events gracefully', () => {
    const dataModel = {
      matches: [
        { match: 'match1', teams: ['TeamA', 'TeamB'], rounds: [1, 2], map: 'Lijiang Tower', date: new Date(), duration: 0, team1Score: 0, team2Score: 0, winningTeam: '' },
      ],
      roundStart: [
        { matchId: 'match1', roundNumber: 1, matchTime: 100, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
      ],
      roundEnd: [
        { matchId: 'match1', roundNumber: 2, matchTime: 800, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const rounds = buildRounds(dataModel);
    expect(rounds).toHaveLength(0); // No complete rounds can be built
  });

  it('should sort rounds by matchId and roundIndex', () => {
    const dataModel = {
      matches: [
        { match: 'match2', teams: ['TeamC', 'TeamD'], rounds: [1], map: 'Busan', date: new Date(), duration: 0, team1Score: 0, team2Score: 0, winningTeam: '' },
        { match: 'match1', teams: ['TeamA', 'TeamB'], rounds: [1, 2], map: 'Lijiang Tower', date: new Date(), duration: 0, team1Score: 0, team2Score: 0, winningTeam: '' },
      ],
      roundStart: [
        { matchId: 'match1', roundNumber: 1, matchTime: 100, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
        { matchId: 'match2', roundNumber: 1, matchTime: 50, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
        { matchId: 'match1', roundNumber: 2, matchTime: 500, team1Score: 0, team2Score: 0, capturingTeam: '', objectiveIndex: 0 },
      ],
      roundEnd: [
        { matchId: 'match1', roundNumber: 1, matchTime: 400, team1Score: 1, team2Score: 0, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
        { matchId: 'match2', roundNumber: 1, matchTime: 300, team1Score: 0, team2Score: 1, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
        { matchId: 'match1', roundNumber: 2, matchTime: 800, team1Score: 1, team2Score: 1, capturingTeam: '', objectiveIndex: 0, controlTeam1Progress: 0, controlTeam2Progress: 0, matchTimeRemaining: 0, type: 'round_end' },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const rounds = buildRounds(dataModel);

    expect(rounds[0].matchId).toBe('match1');
    expect(rounds[0].roundIndex).toBe(1);
    expect(rounds[1].matchId).toBe('match1');
    expect(rounds[1].roundIndex).toBe(2);
    expect(rounds[2].matchId).toBe('match2');
    expect(rounds[2].roundIndex).toBe(1);
  });
});
