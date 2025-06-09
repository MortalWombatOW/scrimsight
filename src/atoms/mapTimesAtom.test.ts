import { describe, it, expect } from 'vitest';
import { mapTimesAtomFn } from '@atoms/mapTimesAtom';
import type { MatchStartType, MatchEndType, RoundTimes } from '@atoms';

describe('mapTimesAtomFn', () => {
  const mockMatchStarts: MatchStartType = [
    {
      matchId: 'match1',
      type: 'Match Start',
      matchTime: 100,
      mapName: 'Lijiang Tower',
      mapType: 'Control',
      team1Name: 'Team A',
      team2Name: 'Team B',
    },
    {
      matchId: 'match2',
      type: 'Match Start',
      matchTime: 200,
      mapName: 'King\'s Row',
      mapType: 'Hybrid',
      team1Name: 'Team C',
      team2Name: 'Team D',
    },
    {
      matchId: 'match3',
      type: 'Match Start',
      matchTime: 300,
      mapName: 'Dorado',
      mapType: 'Escort',
      team1Name: 'Team E',
      team2Name: 'Team F',
    }
  ];

  const mockMatchEnds: MatchEndType = [
    {
      matchId: 'match1',
      type: 'Match End',
      matchTime: 500,
      roundNumber: 1,
      team1Score: 2,
      team2Score: 1,
    },
    {
      matchId: 'match2',
      type: 'Match End',
      matchTime: 800,
      roundNumber: 1,
      team1Score: 1,
      team2Score: 2,
    }
    // Note: No end for match3 to test filtering
  ];

  const mockRoundTimes: RoundTimes[] = [
    {
      matchId: 'match1',
      roundNumber: 1,
      roundStartTime: 120,
      roundSetupCompleteTime: 140,
      roundEndTime: 300,
      roundDuration: 180
    }
  ];

  it('should calculate map times correctly when match start and end exist', () => {
    const result = mapTimesAtomFn(mockMatchStarts, mockMatchEnds, mockRoundTimes);
    
    expect(result).toHaveLength(2);
    
    const match1 = result.find(map => map.matchId === 'match1');
    const match2 = result.find(map => map.matchId === 'match2');
    
    expect(match1).toEqual({
      matchId: 'match1',
      startTime: 100,
      endTime: 500,
      duration: 400,
    });
    
    expect(match2).toEqual({
      matchId: 'match2',
      startTime: 200,
      endTime: 800,
      duration: 600,
    });
  });

  it('should filter out matches without corresponding end events', () => {
    const result = mapTimesAtomFn(mockMatchStarts, mockMatchEnds, mockRoundTimes);
    
    // match3 should be filtered out because it has no end event
    const match3 = result.find(map => map.matchId === 'match3');
    expect(match3).toBeUndefined();
  });

  it('should return empty array when match starts is empty', () => {
    const result = mapTimesAtomFn([], mockMatchEnds, mockRoundTimes);
    expect(result).toEqual([]);
  });

  it('should return empty array when match ends is empty', () => {
    const result = mapTimesAtomFn(mockMatchStarts, [], mockRoundTimes);
    expect(result).toEqual([]);
  });

  it('should return empty array when round times is empty', () => {
    const result = mapTimesAtomFn(mockMatchStarts, mockMatchEnds, []);
    // The function doesn't actually use roundTimes parameter, so it still returns results
    expect(result).toHaveLength(2);
  });

  it('should handle null/undefined inputs gracefully', () => {
    expect(mapTimesAtomFn([] as MatchStartType, mockMatchEnds, mockRoundTimes)).toEqual([]);
    expect(mapTimesAtomFn(mockMatchStarts, [] as MatchEndType, mockRoundTimes)).toEqual([]);
    // Note: Function doesn't use roundTimes parameter, so empty roundTimes doesn't affect result
    expect(mapTimesAtomFn(mockMatchStarts, mockMatchEnds, [] as RoundTimes[])).toHaveLength(2);
  });

  it('should handle single match correctly', () => {
    const singleStart: MatchStartType = [mockMatchStarts[0]];
    const singleEnd: MatchEndType = [mockMatchEnds[0]];
    
    const result = mapTimesAtomFn(singleStart, singleEnd, mockRoundTimes);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      matchId: 'match1',
      startTime: 100,
      endTime: 500,
      duration: 400,
    });
  });

  it('should calculate duration correctly for different time ranges', () => {
    const shortMatch: MatchStartType = [{
      matchId: 'short',
      type: 'Match Start',
      matchTime: 1000,
      mapName: 'Test Map',
      mapType: 'Test Mode',
      team1Name: 'Team A',
      team2Name: 'Team B',
    }];
    
    const shortEnd: MatchEndType = [{
      matchId: 'short',
      type: 'Match End',
      matchTime: 1100,
      roundNumber: 1,
      team1Score: 1,
      team2Score: 0,
    }];
    
    const result = mapTimesAtomFn(shortMatch, shortEnd, mockRoundTimes);
    
    expect(result[0].duration).toBe(100);
  });
});