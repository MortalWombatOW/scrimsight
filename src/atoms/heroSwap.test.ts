import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { heroSwapFn } from '@atoms/heroSwap';
import type { LogFileParserAtomType, HeroSwapLogEvent } from '@atoms';
import { extractEventsFromFiles } from '@library';

vi.mock('@library', async (importOriginal) => {
  const actual = await importOriginal() as any;
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

describe('heroSwapFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;

  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'match1.txt',
      matchId: 'match1',
      fileModified: 1234567890,
      logs: [
        {
          specName: 'hero_swap',
          data: [
            {
              type: 'hero_swap',
              matchTime: 100,
              playerTeam: 'Team A',
              playerName: 'Player1',
              playerHero: 'Tracer',
              previousHero: 'Soldier: 76',
            }
          ]
        }
      ]
    }
  ];

  const mockHeroSwapEvents: HeroSwapLogEvent[] = [
    {
      matchId: 'match1',
      type: 'hero_swap',
      matchTime: 100,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Tracer',
      previousHero: 'Soldier: 76',
      heroTimePlayed: 60,
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract hero_swap events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockHeroSwapEvents);

    const result = await heroSwapFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('hero_swap', mockParsedFiles);
    expect(result).toEqual(mockHeroSwapEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no hero_swap events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await heroSwapFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('hero_swap', mockParsedFiles);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await heroSwapFn([]);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('hero_swap', []);
    expect(result).toEqual([]);
  });

  it('should pass correct event type parameter to extractEventsFromFiles', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    await heroSwapFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('hero_swap', mockParsedFiles);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
  });
});