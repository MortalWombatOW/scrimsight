import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { mercyRezFn } from '@atoms/mercyRez';
import type { LogFileParserAtomType, MercyRezLogEvent } from '@atoms';
import { extractEventsFromFiles } from '@library';

vi.mock('@library', () => ({
  extractEventsFromFiles: vi.fn(),
  groupByAtom: vi.fn(),
}));

describe('mercyRezFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;

  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'match1.txt',
      matchId: 'match1',
      fileModified: 1234567890,
      logs: [
        {
          specName: 'mercy_rez',
          data: [
            {
              type: 'mercy_rez',
              matchTime: 120,
              playerTeam: 'Team A',
              playerName: 'Mercy_Player',
              playerHero: 'Mercy',
              revivedHero: 'Tracer',
              revivedName: 'Player1',
              revivedTeam: 'Team A',
            }
          ]
        }
      ]
    }
  ];

  const mockMercyRezEvents: MercyRezLogEvent[] = [
    {
      matchId: 'match1',
      type: 'mercy_rez',
      matchTime: 120,
      mercyTeam: 'Team A',
      mercyName: 'Mercy_Player',
      revivedHero: 'Tracer',
      revivedName: 'Player1',
      revivedTeam: 'Team A',
      eventAbility: 'Resurrect',
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract mercy_rez events from parsed files with field mapping', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockMercyRezEvents);

    const result = await mercyRezFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('mercy_rez', mockParsedFiles, {
      eventAbility: 'revivedHero',
      revivedHero: 'revivedName',
      revivedName: 'revivedTeam',
    });
    expect(result).toEqual(mockMercyRezEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no mercy_rez events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await mercyRezFn(mockParsedFiles);

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await mercyRezFn([]);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('mercy_rez', [], {
      eventAbility: 'revivedHero',
      revivedHero: 'revivedName',
      revivedName: 'revivedTeam',
    });
    expect(result).toEqual([]);
  });

  it('should pass correct event type and field mapping to extractEventsFromFiles', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    await mercyRezFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('mercy_rez', mockParsedFiles, {
      eventAbility: 'revivedHero',
      revivedHero: 'revivedName',
      revivedName: 'revivedTeam',
    });
    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
  });
});