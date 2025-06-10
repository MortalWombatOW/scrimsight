import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { matchEndFn } from '@atoms/matchEnd';
import type { LogFileParserAtomType, MatchEndType } from '@atoms';
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

describe('matchEndFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;
  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'test-match1.log',
      matchId: 'match1',
      logs: [
        {
          specName: 'match_end',
          data: [
            {
              type: 'match_end',
              matchTime: 1200,
              winningTeam: 'Team A'
            }
          ]
        }
      ],
      fileModified: 1234567890,
    }
  ];

  const mockMatchEndEvents: MatchEndType = [
    {
      matchId: 'match1',
      type: 'match_end',
      matchTime: 1200,
      roundNumber: 3,
      team1Score: 2,
      team2Score: 1
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract match_end events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockMatchEndEvents);

    const result = await matchEndFn(mockParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('match_end', mockParsedFiles);
    expect(result).toEqual(mockMatchEndEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no match_end events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await matchEndFn(mockParsedFiles);

    expect(result).toEqual([]);
  });

  it('should handle empty parsed files array', async () => {
    const result = await matchEndFn([]);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('match_end', []);
    expect(result).toEqual([]);
  });

  it('should handle events with all required properties', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockMatchEndEvents);

    const result = await matchEndFn(mockParsedFiles);
    const matchEndEvent = result[0];

    expect(matchEndEvent).toHaveProperty('matchId', 'match1');
    expect(matchEndEvent).toHaveProperty('type', 'match_end');
    expect(matchEndEvent).toHaveProperty('matchTime', 1200);
    expect(matchEndEvent).toHaveProperty('roundNumber', 3);
    expect(matchEndEvent).toHaveProperty('team1Score', 2);
    expect(matchEndEvent).toHaveProperty('team2Score', 1);
  });
});