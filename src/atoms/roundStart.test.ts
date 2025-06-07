import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { roundStartFn } from '@atoms/roundStart';
import type { LogFileParserAtomType, RoundStartType } from '@atoms';
import { extractEventsFromFiles } from '@library';

vi.mock('@library', () => ({
  extractEventsFromFiles: vi.fn(),
}));

describe('roundStartFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;
  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'test-match1.log',
      matchId: 'match1',
      logs: [
        {
          specName: 'round_start',
          data: [
            {
              type: 'round_start',
              matchTime: 100,
              objectiveIndex: 1,
              roundNumber: 1
            }
          ]
        }
      ],
      fileModified: 1234567890,
    }
  ];

  const mockRoundStartEvents: RoundStartType = [
    {
      matchId: 'match1',
      type: 'round_start',
      matchTime: 100,
      roundNumber: 1,
      capturingTeam: '',
      team1Score: 0,
      team2Score: 0,
      objectiveIndex: 1
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract round_start events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockRoundStartEvents);

    const result = await roundStartFn(mockParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('round_start', mockParsedFiles);
    expect(result).toEqual(mockRoundStartEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no round_start events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await roundStartFn(mockParsedFiles);

    expect(result).toEqual([]);
  });

  it('should handle empty parsed files array', async () => {
    const result = await roundStartFn([]);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('round_start', []);
    expect(result).toEqual([]);
  });

  it('should handle events with all required properties', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockRoundStartEvents);

    const result = await roundStartFn(mockParsedFiles);
    const roundStartEvent = result[0];

    expect(roundStartEvent).toHaveProperty('matchId', 'match1');
    expect(roundStartEvent).toHaveProperty('type', 'round_start');
    expect(roundStartEvent).toHaveProperty('matchTime', 100);
    expect(roundStartEvent).toHaveProperty('objectiveIndex', 1);
    expect(roundStartEvent).toHaveProperty('roundNumber', 1);
  });
});