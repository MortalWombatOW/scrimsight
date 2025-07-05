
import { describe, it, expect } from 'vitest';
import { groupMatchesIntoScrims } from './scrimRelationships';
import * as ScrimsightDataModel from '../ScrimsightDataModel';

describe('groupMatchesIntoScrims', () => {
  it('should group matches into scrims based on date and teams', () => {
    const dataModel = {
      matchStart: [
        { matchId: '1', team1Name: 'A', team2Name: 'B', matchTime: 0, mapName: 'Lijiang Tower', mapType: 'Control' },
        { matchId: '2', team1Name: 'A', team2Name: 'B', matchTime: 0, mapName: 'Dorado', mapType: 'Escort' },
        { matchId: '3', team1Name: 'C', team2Name: 'D', matchTime: 0, mapName: 'Oasis', mapType: 'Control' },
      ],
      matchEnd: [
        { matchId: '1', team1Score: 2, team2Score: 1, roundNumber: 3, matchTime: 0, type: 'match_end' },
        { matchId: '2', team1Score: 1, team2Score: 3, roundNumber: 1, matchTime: 0, type: 'match_end' },
        { matchId: '3', team1Score: 0, team2Score: 2, roundNumber: 2, matchTime: 0, type: 'match_end' },
      ],
      roundEnd: [],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const parsedFiles = [
      { matchId: '1', fileModified: new Date('2023-01-01T12:00:00Z').getTime(), team1Name: 'A', team2Name: 'B' },
      { matchId: '2', fileModified: new Date('2023-01-01T13:00:00Z').getTime(), team1Name: 'A', team2Name: 'B' },
      { matchId: '3', fileModified: new Date('2023-01-01T14:00:00Z').getTime(), team1Name: 'C', team2Name: 'D' },
    ];

    const scrims = groupMatchesIntoScrims(dataModel, parsedFiles);

    expect(scrims).toHaveLength(2);
    expect(scrims[0].matches).toEqual(['1', '2']);
    expect(scrims[1].matches).toEqual(['3']);
  });

  it('should calculate team match wins correctly', () => {
    const dataModel = {
      matchStart: [
        { matchId: '1', team1Name: 'A', team2Name: 'B', matchTime: 0, mapName: 'Lijiang Tower', mapType: 'Control' },
        { matchId: '2', team1Name: 'A', team2Name: 'B', matchTime: 0, mapName: 'Dorado', mapType: 'Escort' },
      ],
      matchEnd: [
        { matchId: '1', team1Score: 2, team2Score: 1, roundNumber: 3, matchTime: 0, type: 'match_end' },
        { matchId: '2', team1Score: 1, team2Score: 3, roundNumber: 1, matchTime: 0, type: 'match_end' },
      ],
      roundEnd: [],
    } as unknown as ScrimsightDataModel.ScrimsightDataModel;

    const parsedFiles = [
      { matchId: '1', fileModified: new Date('2023-01-01T12:00:00Z').getTime(), team1Name: 'A', team2Name: 'B' },
      { matchId: '2', fileModified: new Date('2023-01-01T13:00:00Z').getTime(), team1Name: 'A', team2Name: 'B' },
    ];

    const scrims = groupMatchesIntoScrims(dataModel, parsedFiles);

    expect(scrims[0].team1MatchesWon).toBe(1);
    expect(scrims[0].team2MatchesWon).toBe(1);
  });
});
