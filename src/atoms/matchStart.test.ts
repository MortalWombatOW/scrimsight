import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { matchStartFn } from '@atoms/matchStart';
import type { LogFileParserAtomType, MatchStartType } from '@atoms';
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

describe('matchStartFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;
  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'test-match1.log',
      matchId: 'match1',
      logs: [
        {
          specName: 'match_start',
          data: [
            {
              type: 'match_start',
              matchTime: 0,
              mapName: 'Numbani',
              mapType: 'Hybrid'
            }
          ]
        }
      ],
      fileModified: 1234567890,
    }
  ];

  const mockMatchStartEvents: MatchStartType = [
    {
      matchId: 'match1',
      type: 'match_start',
      matchTime: 0,
      mapName: 'Numbani',
      mapType: 'Hybrid',
      team1Name: 'Team A',
      team2Name: 'Team B'
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract match_start events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockMatchStartEvents);

    const result = await matchStartFn(mockParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('match_start', mockParsedFiles);
    expect(result).toEqual(mockMatchStartEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no match_start events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await matchStartFn(mockParsedFiles);

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    const result = await matchStartFn([]);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('match_start', []);
    expect(result).toEqual([]);
  });

  it('should handle events with all required properties', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockMatchStartEvents);

    const result = await matchStartFn(mockParsedFiles);
    const matchStartEvent = result[0];

    expect(matchStartEvent).toHaveProperty('matchId', 'match1');
    expect(matchStartEvent).toHaveProperty('type', 'match_start');
    expect(matchStartEvent).toHaveProperty('matchTime', 0);
    expect(matchStartEvent).toHaveProperty('mapName', 'Numbani');
    expect(matchStartEvent).toHaveProperty('mapType', 'Hybrid');
    expect(matchStartEvent).toHaveProperty('team1Name', 'Team A');
    expect(matchStartEvent).toHaveProperty('team2Name', 'Team B');
  });

  it('should handle different maps and game modes', async () => {
    const multipleMatches: MatchStartType = [
      {
        matchId: 'match1',
        type: 'match_start',
        matchTime: 0,
        mapName: 'Hanamura',
        mapType: 'Assault',
        team1Name: 'Team A',
        team2Name: 'Team B'
      },
      {
        matchId: 'match2',
        type: 'match_start',
        matchTime: 0,
        mapName: 'Dorado',
        mapType: 'Escort',
        team1Name: 'Team A',
        team2Name: 'Team B'
      }
    ];

    mockExtractEventsFromFiles.mockReturnValue(multipleMatches);

    const result = await matchStartFn(mockParsedFiles);

    expect(result).toEqual(multipleMatches);
    expect(result).toHaveLength(2);
    expect(result[0].mapName).toBe('Hanamura');
    expect(result[1].mapName).toBe('Dorado');
  });
});