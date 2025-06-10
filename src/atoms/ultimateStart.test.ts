import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { ultimateStartFn } from '@atoms/ultimateStart';
import type { LogFileParserAtomType, UltimateStartLogEvent } from '@atoms';
import { extractEventsFromFiles } from '@library';

vi.mock('@library', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    extractEventsFromFiles: vi.fn(),
    groupByAtom: vi.fn(),
    getStatsAtom: vi.fn(),
    getPlayerStatsFilter: vi.fn(),
    transformPlayerInteractions: vi.fn(),
    createKillMatrix: vi.fn(),
    calculatePlayerTotals: vi.fn(),
    parseFile: vi.fn(),
    stringHash: vi.fn(),
    readFileAsync: vi.fn(),
    getRoleFromHero: vi.fn().mockReturnValue('damage'),
  };
});

describe('ultimateStartFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;

  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'match1.txt',
      matchId: 'match1',
      fileModified: 1234567890,
      logs: [
        {
          specName: 'ultimate_start',
          data: [
            {
              type: 'ultimate_start',
              matchTime: 185,
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

  const mockUltimateStartEvents: UltimateStartLogEvent[] = [
    {
      matchId: 'match1',
      type: 'ultimate_start',
      matchTime: 185,
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

  it('should extract ultimate_start events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockUltimateStartEvents);

    const result = await ultimateStartFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ultimate_start', mockParsedFiles);
    expect(result).toEqual(mockUltimateStartEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no ultimate_start events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await ultimateStartFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ultimate_start', mockParsedFiles);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await ultimateStartFn([]);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ultimate_start', []);
    expect(result).toEqual([]);
  });

  it('should pass correct event type parameter to extractEventsFromFiles', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    await ultimateStartFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ultimate_start', mockParsedFiles);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
  });
});