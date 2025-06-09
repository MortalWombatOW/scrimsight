import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { ultimateChargedFn } from '@atoms/ultimateCharged';
import type { LogFileParserAtomType, UltimateChargedLogEvent } from '@atoms';
import { extractEventsFromFiles } from '@library';

vi.mock('@library', () => ({
  extractEventsFromFiles: vi.fn(),
}));

describe('ultimateChargedFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;

  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'match1.txt',
      matchId: 'match1',
      fileModified: 1234567890,
      logs: [
        {
          specName: 'ultimate_charged',
          data: [
            {
              type: 'ultimate_charged',
              matchTime: 180,
              playerTeam: 'Team A',
              playerName: 'Player1',
              playerHero: 'Genji',
              heroDuplicated: '',
            }
          ]
        }
      ]
    }
  ];

  const mockUltimateChargedEvents: UltimateChargedLogEvent[] = [
    {
      matchId: 'match1',
      type: 'ultimate_charged',
      matchTime: 180,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Genji',
      heroDuplicated: '',
      ultimateId: 1,
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract ultimate_charged events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockUltimateChargedEvents);

    const result = await ultimateChargedFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ultimate_charged', mockParsedFiles);
    expect(result).toEqual(mockUltimateChargedEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no ultimate_charged events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await ultimateChargedFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ultimate_charged', mockParsedFiles);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await ultimateChargedFn([]);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ultimate_charged', []);
    expect(result).toEqual([]);
  });

  it('should pass correct event type parameter to extractEventsFromFiles', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    await ultimateChargedFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ultimate_charged', mockParsedFiles);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
  });
});