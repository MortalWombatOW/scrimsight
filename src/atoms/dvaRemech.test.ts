import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { dvaRemechFn } from '@atoms/dvaRemech';
import type { LogFileParserAtomType, DvaRemechLogEvent } from '@atoms';
import { extractEventsFromFiles } from '@library';

vi.mock('@library', () => ({
  extractEventsFromFiles: vi.fn(),
}));

describe('dvaRemechFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;

  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'match1.txt',
      matchId: 'match1',
      fileModified: 1234567890,
      logs: [
        {
          specName: 'dva_remech',
          data: [
            {
              type: 'dva_remech',
              matchTime: 180,
              playerTeam: 'Team A',
              playerName: 'DVa_Player',
              playerHero: 'D.Va',
            }
          ]
        }
      ]
    }
  ];

  const mockDvaRemechEvents: DvaRemechLogEvent[] = [
    {
      matchId: 'match1',
      type: 'dva_remech',
      matchTime: 180,
      playerTeam: 'Team A',
      playerName: 'DVa_Player',
      playerHero: 'D.Va',
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract dva_remech events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockDvaRemechEvents);

    const result = await dvaRemechFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('dva_remech', mockParsedFiles);
    expect(result).toEqual(mockDvaRemechEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no dva_remech events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await dvaRemechFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('dva_remech', mockParsedFiles);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await dvaRemechFn([]);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('dva_remech', []);
    expect(result).toEqual([]);
  });

  it('should pass correct event type parameter to extractEventsFromFiles', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    await dvaRemechFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('dva_remech', mockParsedFiles);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
  });
});