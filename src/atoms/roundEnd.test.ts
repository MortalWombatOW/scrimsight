import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { roundEndFn } from '@atoms/roundEnd';
import type { LogFileParserAtomType, RoundEndType } from '@atoms';
import { extractEventsFromFiles } from '@library';

vi.mock('@library', () => ({
  extractEventsFromFiles: vi.fn(),
  groupByAtom: vi.fn(),
}));

describe('roundEndFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;
  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'test-match1.log',
      matchId: 'match1',
      logs: [
        {
          specName: 'round_end',
          data: [
            {
              type: 'round_end',
              matchTime: 600,
              objectiveIndex: 1,
              roundNumber: 1,
              winningTeam: 'Team A'
            }
          ]
        }
      ],
      fileModified: 1234567890,
    }
  ];

  const mockRoundEndEvents: RoundEndType = [
    {
      matchId: 'match1',
      type: 'round_end',
      matchTime: 600,
      roundNumber: 1,
      capturingTeam: 'Team A',
      team1Score: 1,
      team2Score: 0,
      objectiveIndex: 1,
      controlTeam1Progress: 100,
      controlTeam2Progress: 0,
      matchTimeRemaining: 300
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract round_end events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockRoundEndEvents);

    const result = await roundEndFn(mockParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('round_end', mockParsedFiles);
    expect(result).toEqual(mockRoundEndEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no round_end events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await roundEndFn(mockParsedFiles);

    expect(result).toEqual([]);
  });

  it('should handle empty parsed files array', async () => {
    const result = await roundEndFn([]);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('round_end', []);
    expect(result).toEqual([]);
  });

  it('should handle events with all required properties', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockRoundEndEvents);

    const result = await roundEndFn(mockParsedFiles);
    const roundEndEvent = result[0];

    expect(roundEndEvent).toHaveProperty('matchId', 'match1');
    expect(roundEndEvent).toHaveProperty('type', 'round_end');
    expect(roundEndEvent).toHaveProperty('matchTime', 600);
    expect(roundEndEvent).toHaveProperty('objectiveIndex', 1);
    expect(roundEndEvent).toHaveProperty('roundNumber', 1);
    expect(roundEndEvent).toHaveProperty('capturingTeam', 'Team A');
    expect(roundEndEvent).toHaveProperty('team1Score', 1);
    expect(roundEndEvent).toHaveProperty('team2Score', 0);
    expect(roundEndEvent).toHaveProperty('controlTeam1Progress', 100);
    expect(roundEndEvent).toHaveProperty('controlTeam2Progress', 0);
    expect(roundEndEvent).toHaveProperty('matchTimeRemaining', 300);
  });
});