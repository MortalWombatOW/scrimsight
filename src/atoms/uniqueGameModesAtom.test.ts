import { describe, it, expect } from 'vitest';
import { uniqueGameModesAtomFn } from '@atoms/uniqueGameModesAtom';
import type { MatchStartType } from '@atoms';

describe('uniqueGameModesAtomFn', () => {
  it('should extract unique game modes from match starts', () => {
    const mockMatchStarts: MatchStartType = [
      {
        matchId: 'match1',
        type: 'match_start',
        matchTime: 0,
        mapName: 'Lijiang Tower',
        mapType: 'Control',
        team1Name: 'Team A',
        team2Name: 'Team B',
      },
      {
        matchId: 'match2',
        type: 'match_start',
        matchTime: 0,
        mapName: 'King\'s Row',
        mapType: 'Hybrid',
        team1Name: 'Team C',
        team2Name: 'Team D',
      },
      {
        matchId: 'match3',
        type: 'match_start',
        matchTime: 0,
        mapName: 'Nepal',
        mapType: 'Control',
        team1Name: 'Team E',
        team2Name: 'Team F',
      }
    ];

    const result = uniqueGameModesAtomFn(mockMatchStarts);

    expect(result).toEqual([
      { mapType: 'Control' },
      { mapType: 'Hybrid' }
    ]);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no match starts provided', () => {
    const result = uniqueGameModesAtomFn([]);

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle single match start', () => {
    const mockMatchStarts: MatchStartType = [
      {
        matchId: 'match1',
        type: 'match_start',
        matchTime: 0,
        team1Name: 'Team A',
        team2Name: 'Team B',
        mapName: 'Dorado',
        mapType: 'Escort',
      }
    ];

    const result = uniqueGameModesAtomFn(mockMatchStarts);

    expect(result).toEqual([{ mapType: 'Escort' }]);
    expect(result).toHaveLength(1);
  });

  it('should handle multiple maps with same game mode', () => {
    const mockMatchStarts: MatchStartType = [
      {
        matchId: 'match1',
        type: 'match_start',
        matchTime: 0,
        team1Name: 'Team A',
        team2Name: 'Team B',
        mapName: 'Hanamura',
        mapType: 'Assault',
      },
      {
        matchId: 'match2',
        type: 'match_start',
        matchTime: 0,
        team1Name: 'Team A',
        team2Name: 'Team B',
        mapName: 'Temple of Anubis',
        mapType: 'Assault',
      }
    ];

    const result = uniqueGameModesAtomFn(mockMatchStarts);

    expect(result).toEqual([{ mapType: 'Assault' }]);
    expect(result).toHaveLength(1);
  });
});