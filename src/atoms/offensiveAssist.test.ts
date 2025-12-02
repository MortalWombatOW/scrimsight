import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { offensiveAssistFn } from '@atoms/offensiveAssist';
import type { LogFileParserAtomType, OffensiveAssistLogEvent } from '@atoms';
import { extractEventsFromFiles } from '@library';

vi.mock('@library', () => ({
  extractEventsFromFiles: vi.fn(),
  groupByAtom: vi.fn(),
}));

describe('offensiveAssistFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;

  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'match1.txt',
      matchId: 'match1',
      fileModified: 1234567890,
      logs: [
        {
          specName: 'offensive_assist',
          data: [
            {
              type: 'offensive_assist',
              matchTime: 150,
              playerTeam: 'Team A',
              playerName: 'Support_Player',
              playerHero: 'Ana',
              heroDuplicated: '',
            }
          ]
        }
      ]
    }
  ];

  const mockOffensiveAssistEvents: OffensiveAssistLogEvent[] = [
    {
      matchId: 'match1',
      type: 'offensive_assist',
      matchTime: 150,
      playerTeam: 'Team A',
      playerName: 'Support_Player',
      playerHero: 'Ana',
      heroDuplicated: '',
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract offensive_assist events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockOffensiveAssistEvents);

    const result = await offensiveAssistFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('offensive_assist', mockParsedFiles);
    expect(result).toEqual(mockOffensiveAssistEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no offensive_assist events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await offensiveAssistFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('offensive_assist', mockParsedFiles);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await offensiveAssistFn([]);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('offensive_assist', []);
    expect(result).toEqual([]);
  });

  it('should pass correct event type parameter to extractEventsFromFiles', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    await offensiveAssistFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('offensive_assist', mockParsedFiles);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
  });
});