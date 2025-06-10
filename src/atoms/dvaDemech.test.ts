import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { dvaDemechFn } from '@atoms/dvaDemech';
import type { LogFileParserAtomType, DvaDemechLogEvent } from '@atoms';
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

describe('dvaDemechFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;

  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'match1.txt',
      matchId: 'match1',
      fileModified: 1234567890,
      logs: [
        {
          specName: 'dva_demech',
          data: [
            {
              type: 'dva_demech',
              matchTime: 150,
              playerTeam: 'Team A',
              playerName: 'DVa_Player',
              playerHero: 'D.Va',
            }
          ]
        }
      ]
    }
  ];

  const mockDvaDemechEvents: DvaDemechLogEvent[] = [
    {
      matchId: 'match1',
      type: 'dva_demech',
      matchTime: 150,
      attackerTeam: 'Team A',
      attackerName: 'DVa_Player',
      attackerHero: 'D.Va',
      victimTeam: 'Team B',
      victimName: 'Enemy',
      victimHero: 'D.Va',
      eventAbility: 'Mech Call',
      eventDamage: 50,
      isCriticalHit: false,
      isEnvironmental: false,
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract dva_demech events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockDvaDemechEvents);

    const result = await dvaDemechFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('dva_demech', mockParsedFiles);
    expect(result).toEqual(mockDvaDemechEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no dva_demech events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await dvaDemechFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('dva_demech', mockParsedFiles);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await dvaDemechFn([]);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('dva_demech', []);
    expect(result).toEqual([]);
  });

  it('should pass correct event type parameter to extractEventsFromFiles', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    await dvaDemechFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('dva_demech', mockParsedFiles);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
  });
});