import { describe, it, expect } from 'vitest';
import { roundTimesAtomFn } from '@atoms/roundTimesAtom';
import type { RoundStartType, SetupCompleteType, RoundEndType } from '@atoms';

describe('roundTimesAtomFn', () => {
  const mockRoundStarts: RoundStartType = [
    {
      matchId: 'match1',
      type: 'Round Start',
      matchTime: 100,
      roundNumber: 1,
      capturingTeam: 'Team A',
      team1Score: 0,
      team2Score: 0,
      objectiveIndex: 0,
    },
    {
      matchId: 'match1',
      type: 'Round Start',
      matchTime: 500,
      roundNumber: 2,
      capturingTeam: 'Team B',
      team1Score: 1,
      team2Score: 0,
      objectiveIndex: 0,
    },
    {
      matchId: 'match2',
      type: 'Round Start',
      matchTime: 1000,
      roundNumber: 1,
      capturingTeam: 'Team C',
      team1Score: 0,
      team2Score: 0,
      objectiveIndex: 0,
    }
  ];

  const mockSetupCompletes: SetupCompleteType = [
    {
      matchId: 'match1',
      type: 'Setup Complete',
      matchTime: 120,
      roundNumber: 1,
      matchTimeRemaining: 300,
    },
    {
      matchId: 'match1',
      type: 'Setup Complete',
      matchTime: 520,
      roundNumber: 2,
      matchTimeRemaining: 300,
    },
    {
      matchId: 'match2',
      type: 'Setup Complete',
      matchTime: 1020,
      roundNumber: 1,
      matchTimeRemaining: 300,
    }
  ];

  const mockRoundEnds: RoundEndType = [
    {
      matchId: 'match1',
      type: 'Round End',
      matchTime: 300,
      roundNumber: 1,
      capturingTeam: 'Team A',
      team1Score: 1,
      team2Score: 0,
      objectiveIndex: 0,
      controlTeam1Progress: 100,
      controlTeam2Progress: 0,
      matchTimeRemaining: 200,
    },
    {
      matchId: 'match1',
      type: 'Round End',
      matchTime: 700,
      roundNumber: 2,
      capturingTeam: 'Team B',
      team1Score: 1,
      team2Score: 1,
      objectiveIndex: 0,
      controlTeam1Progress: 0,
      controlTeam2Progress: 100,
      matchTimeRemaining: 100,
    },
    {
      matchId: 'match2',
      type: 'Round End',
      matchTime: 1200,
      roundNumber: 1,
      capturingTeam: 'Team A',
      team1Score: 1,
      team2Score: 0,
      objectiveIndex: 0,
      controlTeam1Progress: 100,
      controlTeam2Progress: 0,
      matchTimeRemaining: 150,
    }
  ];

  it('should combine round start, setup complete, and end events correctly', () => {
    const result = roundTimesAtomFn(mockRoundStarts, mockSetupCompletes, mockRoundEnds);
    
    expect(result).toHaveLength(3);
    
    // Check first round
    const round1 = result.find(r => r.matchId === 'match1' && r.roundNumber === 1);
    expect(round1).toEqual({
      matchId: 'match1',
      roundNumber: 1,
      roundStartTime: 100,
      roundSetupCompleteTime: 120,
      roundEndTime: 300,
      roundDuration: 200, // 300 - 100
    });
    
    // Check second round
    const round2 = result.find(r => r.matchId === 'match1' && r.roundNumber === 2);
    expect(round2).toEqual({
      matchId: 'match1',
      roundNumber: 2,
      roundStartTime: 500,
      roundSetupCompleteTime: 520,
      roundEndTime: 700,
      roundDuration: 200, // 700 - 500
    });
  });

  it('should sort rounds by match ID and then round number', () => {
    const result = roundTimesAtomFn(mockRoundStarts, mockSetupCompletes, mockRoundEnds);
    
    // Should be sorted: match1 round1, match1 round2, match2 round1
    expect(result[0].matchId).toBe('match1');
    expect(result[0].roundNumber).toBe(1);
    
    expect(result[1].matchId).toBe('match1');
    expect(result[1].roundNumber).toBe(2);
    
    expect(result[2].matchId).toBe('match2');
    expect(result[2].roundNumber).toBe(1);
  });

  it('should exclude rounds missing setup complete events', () => {
    const incompleteSetupCompletes: SetupCompleteType = [
      {
        matchId: 'match1',
        type: 'Setup Complete',
        matchTime: 120,
        roundNumber: 1,
        matchTimeRemaining: 300,
      }
      // Missing setup complete for match1 round2 and match2 round1
    ];

    const result = roundTimesAtomFn(mockRoundStarts, incompleteSetupCompletes, mockRoundEnds);
    
    expect(result).toHaveLength(1);
    expect(result[0].matchId).toBe('match1');
    expect(result[0].roundNumber).toBe(1);
  });

  it('should exclude rounds missing end events', () => {
    const incompleteRoundEnds: RoundEndType = [
      {
        matchId: 'match1',
        type: 'Round End',
        matchTime: 300,
        roundNumber: 1,
        capturingTeam: 'Team A',
        team1Score: 1,
        team2Score: 0,
        objectiveIndex: 0,
        controlTeam1Progress: 100,
        controlTeam2Progress: 0,
        matchTimeRemaining: 200,
      }
      // Missing end events for match1 round2 and match2 round1
    ];

    const result = roundTimesAtomFn(mockRoundStarts, mockSetupCompletes, incompleteRoundEnds);
    
    expect(result).toHaveLength(1);
    expect(result[0].matchId).toBe('match1');
    expect(result[0].roundNumber).toBe(1);
  });

  it('should handle empty input arrays', () => {
    expect(roundTimesAtomFn([], mockSetupCompletes, mockRoundEnds)).toEqual([]);
    expect(roundTimesAtomFn(mockRoundStarts, [], mockRoundEnds)).toEqual([]);
    expect(roundTimesAtomFn(mockRoundStarts, mockSetupCompletes, [])).toEqual([]);
    expect(roundTimesAtomFn([], [], [])).toEqual([]);
  });

  it('should handle mismatched match IDs and round numbers', () => {
    const mismatchedStarts: RoundStartType = [
      {
        matchId: 'match3',
        type: 'Round Start',
        matchTime: 100,
        roundNumber: 5,
        capturingTeam: 'Team A',
        team1Score: 0,
        team2Score: 0,
        objectiveIndex: 0,
      }
    ];

    const result = roundTimesAtomFn(mismatchedStarts, mockSetupCompletes, mockRoundEnds);
    expect(result).toEqual([]);
  });

  it('should calculate round duration correctly', () => {
    const shortRoundStarts: RoundStartType = [
      {
        matchId: 'short',
        type: 'Round Start',
        matchTime: 1000,
        roundNumber: 1,
        capturingTeam: 'Team A',
        team1Score: 0,
        team2Score: 0,
        objectiveIndex: 0,
      }
    ];

    const shortSetupCompletes: SetupCompleteType = [
      {
        matchId: 'short',
        type: 'Setup Complete',
        matchTime: 1010,
        roundNumber: 1,
        matchTimeRemaining: 300,
      }
    ];

    const shortRoundEnds: RoundEndType = [
      {
        matchId: 'short',
        type: 'Round End',
        matchTime: 1050,
        roundNumber: 1,
        capturingTeam: 'Team A',
        team1Score: 1,
        team2Score: 0,
        objectiveIndex: 0,
        controlTeam1Progress: 100,
        controlTeam2Progress: 0,
        matchTimeRemaining: 250,
      }
    ];

    const result = roundTimesAtomFn(shortRoundStarts, shortSetupCompletes, shortRoundEnds);
    
    expect(result).toHaveLength(1);
    expect(result[0].roundDuration).toBe(50); // 1050 - 1000
  });

  it('should handle rounds with same start time but different round numbers', () => {
    const sameTimeStarts: RoundStartType = [
      {
        matchId: 'match1',
        type: 'Round Start',
        matchTime: 100,
        roundNumber: 1,
        capturingTeam: 'Team A',
        team1Score: 0,
        team2Score: 0,
        objectiveIndex: 0,
      },
      {
        matchId: 'match1',
        type: 'Round Start',
        matchTime: 100, // Same start time
        roundNumber: 2,
        capturingTeam: 'Team B',
        team1Score: 1,
        team2Score: 0,
        objectiveIndex: 0,
      }
    ];

    const sameTimeSetups: SetupCompleteType = [
      {
        matchId: 'match1',
        type: 'Setup Complete',
        matchTime: 120,
        roundNumber: 1,
        matchTimeRemaining: 300,
      },
      {
        matchId: 'match1',
        type: 'Setup Complete',
        matchTime: 120,
        roundNumber: 2,
        matchTimeRemaining: 300,
      }
    ];

    const sameTimeEnds: RoundEndType = [
      {
        matchId: 'match1',
        type: 'Round End',
        matchTime: 200,
        roundNumber: 1,
        capturingTeam: 'Team A',
        team1Score: 1,
        team2Score: 0,
        objectiveIndex: 0,
        controlTeam1Progress: 100,
        controlTeam2Progress: 0,
        matchTimeRemaining: 200,
      },
      {
        matchId: 'match1',
        type: 'Round End',
        matchTime: 300,
        roundNumber: 2,
        capturingTeam: 'Team B',
        team1Score: 1,
        team2Score: 1,
        objectiveIndex: 0,
        controlTeam1Progress: 0,
        controlTeam2Progress: 100,
        matchTimeRemaining: 100,
      }
    ];

    const result = roundTimesAtomFn(sameTimeStarts, sameTimeSetups, sameTimeEnds);
    
    expect(result).toHaveLength(2);
    expect(result[0].roundNumber).toBe(1);
    expect(result[0].roundDuration).toBe(100);
    expect(result[1].roundNumber).toBe(2);
    expect(result[1].roundDuration).toBe(200);
  });
});