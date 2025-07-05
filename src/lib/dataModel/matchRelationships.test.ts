
import { describe, it, expect } from 'vitest';
import { buildMatchRelationships } from './matchRelationships';
import * as ScrimsightDataModel from '../ScrimsightDataModel';

describe('buildMatchRelationships', () => {
  it('should build match relationships correctly', () => {
    const dataModel = {
      scrims: [
        { scrim: 'scrim-1', matches: ['1', '2'], teams: ['A', 'B'], date: new Date(), team1MatchesWon: 1, team2MatchesWon: 1 },
      ],
      matchStart: [
        { matchId: '1', team1Name: 'A', team2Name: 'B', mapName: 'Lijiang Tower', mapType: 'Control', matchTime: 0 },
        { matchId: '2', team1Name: 'A', team2Name: 'B', mapName: 'Dorado', mapType: 'Escort', matchTime: 0 },
      ],
      roundStart: [
        { matchId: '1', roundNumber: 1, matchTime: 10, team1Score: 0, team2Score: 0, capturingTeam: 'A', objectiveIndex: 1 },
        { matchId: '1', roundNumber: 2, matchTime: 500, team1Score: 1, team2Score: 0, capturingTeam: 'B', objectiveIndex: 2 },
      ],
      roundEnd: [
        { matchId: '1', roundNumber: 1, matchTime: 400, team1Score: 1, team2Score: 0, capturingTeam: 'A', objectiveIndex: 1, controlTeam1Progress: 100, controlTeam2Progress: 50, matchTimeRemaining: 0, type: 'round_end' },
        { matchId: '1', roundNumber: 2, matchTime: 900, team1Score: 1, team2Score: 1, capturingTeam: 'B', objectiveIndex: 2, controlTeam1Progress: 100, controlTeam2Progress: 100, matchTimeRemaining: 0, type: 'round_end' },
      ],
      matchEnd: [
        { matchId: '1', team1Score: 2, team2Score: 1, roundNumber: 3, matchTime: 1000, type: 'match_end' },
      ],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const parsedFiles = [
      { matchId: '1', fileModified: new Date('2023-01-01T12:00:00Z').getTime() },
      { matchId: '2', fileModified: new Date('2023-01-01T13:00:00Z').getTime() },
    ];

    const matches = buildMatchRelationships(dataModel, parsedFiles);

    expect(matches).toHaveLength(2);
    expect(matches[0].match).toBe('1');
    expect(matches[0].scrim).toBe('scrim-1');
    expect(matches[0].duration).toBe(790);
    expect(matches[0].winningTeam).toBe('A');
  });
});
