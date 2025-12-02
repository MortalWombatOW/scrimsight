import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { setupCompleteFn } from '@atoms/setupComplete';
import type { LogFileParserAtomType, SetupCompleteLogEvent } from '@atoms';
import { extractEventsFromFiles } from '@library';

vi.mock('@library', () => ({
  extractEventsFromFiles: vi.fn(),
  groupByAtom: vi.fn(),
}));

describe('setupCompleteFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;

  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'match1.txt',
      matchId: 'match1',
      fileModified: 1234567890,
      logs: [
        {
          specName: 'setup_complete',
          data: [
            {
              type: 'setup_complete',
              matchTime: 0,
              playerTeam: '',
              playerName: '',
              playerHero: '',
            }
          ]
        }
      ]
    }
  ];

  const mockSetupCompleteEvents: SetupCompleteLogEvent[] = [
    {
      matchId: 'match1',
      type: 'setup_complete',
      matchTime: 0,
      roundNumber: 1,
      matchTimeRemaining: 600,
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract setup_complete events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockSetupCompleteEvents);

    const result = await setupCompleteFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('setup_complete', mockParsedFiles);
    expect(result).toEqual(mockSetupCompleteEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no setup_complete events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await setupCompleteFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('setup_complete', mockParsedFiles);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await setupCompleteFn([]);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('setup_complete', []);
    expect(result).toEqual([]);
  });

  it('should pass correct event type parameter to extractEventsFromFiles', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    await setupCompleteFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('setup_complete', mockParsedFiles);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
  });
});