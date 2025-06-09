import { describe, it, expect } from 'vitest';
import { teamNamesAtomFn } from '@atoms/teamNamesAtom';
import type { MatchStartType } from '@atoms';

describe('teamNamesAtomFn', () => {
  it('should extract unique team names from match starts', () => {
    const mockMatchStarts: MatchStartType = [
      {
        matchId: 'match1',
        type: 'Match Start',
        matchTime: 100,
        mapName: 'Lijiang Tower',
        mapType: 'Control',
        team1Name: 'Team Alpha',
        team2Name: 'Team Beta',
      },
      {
        matchId: 'match2',
        type: 'Match Start',
        matchTime: 200,
        mapName: 'King\'s Row',
        mapType: 'Hybrid',
        team1Name: 'Team Gamma',
        team2Name: 'Team Alpha', // Repeated team name
      },
      {
        matchId: 'match3',
        type: 'Match Start',
        matchTime: 300,
        mapName: 'Dorado',
        mapType: 'Escort',
        team1Name: 'Team Alpha', // Another repeat
        team2Name: 'Team Delta',
      }
    ];

    const result = teamNamesAtomFn(mockMatchStarts);
    
    // Should return unique team names
    expect(result).toHaveLength(4);
    expect(result).toContain('Team Alpha');
    expect(result).toContain('Team Beta');
    expect(result).toContain('Team Gamma');
    expect(result).toContain('Team Delta');
  });

  it('should handle empty match starts array', () => {
    const result = teamNamesAtomFn([]);
    expect(result).toEqual([]);
  });

  it('should handle single match', () => {
    const mockMatchStarts: MatchStartType = [
      {
        matchId: 'match1',
        type: 'Match Start',
        matchTime: 100,
        mapName: 'Numbani',
        mapType: 'Hybrid',
        team1Name: 'Solo Team A',
        team2Name: 'Solo Team B',
      }
    ];

    const result = teamNamesAtomFn(mockMatchStarts);
    
    expect(result).toHaveLength(2);
    expect(result).toContain('Solo Team A');
    expect(result).toContain('Solo Team B');
  });

  it('should handle same team playing against itself', () => {
    const mockMatchStarts: MatchStartType = [
      {
        matchId: 'match1',
        type: 'Match Start',
        matchTime: 100,
        mapName: 'Workshop Chamber',
        mapType: 'Skirmish',
        team1Name: 'Same Team',
        team2Name: 'Same Team',
      }
    ];

    const result = teamNamesAtomFn(mockMatchStarts);
    
    // Should only return one instance of the team name
    expect(result).toHaveLength(1);
    expect(result).toContain('Same Team');
  });

  it('should handle undefined team names gracefully', () => {
    const mockMatchStarts: MatchStartType = [
      {
        matchId: 'match1',
        type: 'Match Start',
        matchTime: 100,
        mapName: 'Test Map',
        mapType: 'Test Mode',
        team1Name: 'Valid Team',
        team2Name: '' as string,
      },
      {
        matchId: 'match2',
        type: 'Match Start',
        matchTime: 200,
        mapName: 'Test Map 2',
        mapType: 'Test Mode',
        team1Name: '' as string,
        team2Name: 'Another Valid Team',
      }
    ];

    const result = teamNamesAtomFn(mockMatchStarts);
    
    // Function doesn't filter out undefined values, so they are included
    expect(result).toHaveLength(3);
    expect(result).toContain('Valid Team');
    expect(result).toContain('Another Valid Team');
    expect(result).toContain(undefined);
  });

  it('should handle multiple matches with mixed team combinations', () => {
    const mockMatchStarts: MatchStartType = [
      {
        matchId: 'match1',
        type: 'Match Start',
        matchTime: 100,
        mapName: 'Map1',
        mapType: 'Control',
        team1Name: 'Team A',
        team2Name: 'Team B',
      },
      {
        matchId: 'match2',
        type: 'Match Start',
        matchTime: 200,
        mapName: 'Map2',
        mapType: 'Escort',
        team1Name: 'Team B', // Team B now as team1
        team2Name: 'Team C',
      },
      {
        matchId: 'match3',
        type: 'Match Start',
        matchTime: 300,
        mapName: 'Map3',
        mapType: 'Hybrid',
        team1Name: 'Team C',
        team2Name: 'Team A', // Team A now as team2
      }
    ];

    const result = teamNamesAtomFn(mockMatchStarts);
    
    expect(result).toHaveLength(3);
    expect(result).toContain('Team A');
    expect(result).toContain('Team B');
    expect(result).toContain('Team C');
  });
});