import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { playerStatFn } from '@atoms/playerStat';
import type { LogFileParserAtomType, PlayerStatLogEvent } from '@atoms';
import { extractEventsFromFiles } from '@library';

vi.mock('@library', () => ({
  extractEventsFromFiles: vi.fn(),
}));

describe('playerStatFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;

  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'match1.txt',
      matchId: 'match1',
      fileModified: 1234567890,
      logs: [
        {
          specName: 'player_stat',
          data: [
            {
              type: 'player_stat',
              matchTime: 150,
              playerTeam: 'Team A',
              playerName: 'Player1',
              playerHero: 'Tracer',
              statName: 'eliminations',
              statValue: 25,
            }
          ]
        }
      ]
    }
  ];

  const mockPlayerStatEvents: PlayerStatLogEvent[] = [
    {
      matchId: 'match1',
      type: 'player_stat',
      matchTime: 150,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Tracer',
      statName: 'eliminations',
      statValue: 25,
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract player_stat events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockPlayerStatEvents);

    const result = await playerStatFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('player_stat', mockParsedFiles);
    expect(result).toEqual(mockPlayerStatEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no player_stat events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await playerStatFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('player_stat', mockParsedFiles);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await playerStatFn([]);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('player_stat', []);
    expect(result).toEqual([]);
  });

  it('should pass correct event type parameter to extractEventsFromFiles', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    await playerStatFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('player_stat', mockParsedFiles);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
  });
});