import { describe, it, expect } from 'vitest';
import { uniqueMapNamesAtomFn } from '@atoms/uniqueMapNamesAtom';
import type { MatchStartType } from '@atoms';

describe('uniqueMapNamesAtomFn', () => {
  it('should extract unique map names from match starts', () => {
    const mockMatchStarts: MatchStartType = [
      {
        matchId: 'match1',
        type: 'match_start',
        matchTime: 0,
        team1Name: 'Team A',
        team2Name: 'Team B',
        mapName: 'Lijiang Tower',
        mapType: 'Control',
      },
      {
        matchId: 'match2',
        type: 'match_start',
        matchTime: 0,
        team1Name: 'Team A',
        team2Name: 'Team B',
        mapName: 'King\'s Row',
        mapType: 'Hybrid',
      },
      {
        matchId: 'match3',
        type: 'match_start',
        matchTime: 0,
        team1Name: 'Team A',
        team2Name: 'Team B',
        mapName: 'Lijiang Tower',
        mapType: 'Control',
      }
    ];

    const result = uniqueMapNamesAtomFn(mockMatchStarts);

    expect(result).toEqual(['Lijiang Tower', 'King\'s Row']);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no match starts provided', () => {
    const result = uniqueMapNamesAtomFn([]);

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
        mapName: 'Hanamura',
        mapType: 'Assault',
      }
    ];

    const result = uniqueMapNamesAtomFn(mockMatchStarts);

    expect(result).toEqual(['Hanamura']);
    expect(result).toHaveLength(1);
  });

  it('should handle multiple identical map names', () => {
    const mockMatchStarts: MatchStartType = [
      {
        matchId: 'match1',
        type: 'match_start',
        matchTime: 0,
        team1Name: 'Team A',
        team2Name: 'Team B',
        mapName: 'Dorado',
        mapType: 'Escort',
      },
      {
        matchId: 'match2',
        type: 'match_start',
        matchTime: 0,
        team1Name: 'Team A',
        team2Name: 'Team B',
        mapName: 'Dorado',
        mapType: 'Escort',
      },
      {
        matchId: 'match3',
        type: 'match_start',
        matchTime: 0,
        team1Name: 'Team A',
        team2Name: 'Team B',
        mapName: 'Dorado',
        mapType: 'Escort',
      }
    ];

    const result = uniqueMapNamesAtomFn(mockMatchStarts);

    expect(result).toEqual(['Dorado']);
    expect(result).toHaveLength(1);
  });
});