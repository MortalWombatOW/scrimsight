import { describe, it, expect, vi, MockedFunction, afterEach } from 'vitest';
import { ability2UsedFn } from '@atoms/ability2Used';
import type { LogFileParserAtomType, Ability2UsedLogEvent, Ability2UsedType } from '@atoms';
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

describe('ability2UsedFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;
  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'test-match-1.txt',
      matchId: 'match1',
      fileModified: 1234567890,
      logs: [
        {
          specName: 'ability_2_used',
          data: [
            {
              matchId: 'match1',
              type: 'ability_2_used',
              matchTime: 100,
              playerTeam: 'Team A',
              playerName: 'Player1',
              playerHero: 'Ana',
              heroDuplicated: '',
            },
            {
              matchId: 'match1',
              type: 'ability_2_used',
              matchTime: 150,
              playerTeam: 'Team B',
              playerName: 'Player2',
              playerHero: 'Mercy',
              heroDuplicated: '',
            },
          ],
        },
      ],
    },
    {
      fileName: 'test-match-2.txt',
      matchId: 'match2',
      fileModified: 9876543210,
      logs: [
        {
          specName: 'ability_2_used',
          data: [
            {
              matchId: 'match2',
              type: 'ability_2_used',
              matchTime: 200,
              playerTeam: 'Team C',
              playerName: 'Player3',
              playerHero: 'Genji',
              heroDuplicated: '',
            },
          ],
        },
      ],
    },
  ];

  const mockAbility2UsedEvents: Ability2UsedLogEvent[] = [
    {
      matchId: 'match1',
      type: 'ability_2_used',
      matchTime: 100,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Ana',
      heroDuplicated: '',
    },
    {
      matchId: 'match1',
      type: 'ability_2_used',
      matchTime: 150,
      playerTeam: 'Team B',
      playerName: 'Player2',
      playerHero: 'Mercy',
      heroDuplicated: '',
    },
    {
      matchId: 'match2',
      type: 'ability_2_used',
      matchTime: 200,
      playerTeam: 'Team C',
      playerName: 'Player3',
      playerHero: 'Genji',
      heroDuplicated: '',
    },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract ability_2_used events from parsed files correctly', async () => {
    mockExtractEventsFromFiles.mockResolvedValueOnce(mockAbility2UsedEvents);

    const result = await ability2UsedFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ability_2_used', mockParsedFiles);
    expect(result).toEqual(mockAbility2UsedEvents);
    expect(result).toHaveLength(3);
  });

  it('should return an empty array when no ability_2_used events exist', async () => {
    const emptyResult: Ability2UsedType = [];
    mockExtractEventsFromFiles.mockResolvedValueOnce(emptyResult);

    const result = await ability2UsedFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ability_2_used', mockParsedFiles);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    const emptyParsedFiles: LogFileParserAtomType = [];
    const emptyResult: Ability2UsedType = [];
    mockExtractEventsFromFiles.mockResolvedValueOnce(emptyResult);

    const result = await ability2UsedFn(emptyParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ability_2_used', emptyParsedFiles);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle parsed files with no ability_2_used logs', async () => {
    const parsedFilesWithoutAbility2Used: LogFileParserAtomType = [
      {
        fileName: 'test-match-3.txt',
        matchId: 'match3',
        fileModified: 1111111111,
        logs: [
          {
            specName: 'kill',
            data: [
              {
                matchId: 'match3',
                type: 'kill',
                matchTime: 300,
                attackerTeam: 'Team A',
                attackerName: 'Player1',
                attackerHero: 'Widowmaker',
                victimTeam: 'Team B',
                victimName: 'Player2',
                victimHero: 'Tracer',
                eventAbility: 'Widow\'s Kiss',
                eventDamage: 300,
                isCriticalHit: true,
                isEnvironmental: false,
              },
            ],
          },
        ],
      },
    ];

    const emptyResult: Ability2UsedType = [];
    mockExtractEventsFromFiles.mockResolvedValueOnce(emptyResult);

    const result = await ability2UsedFn(parsedFilesWithoutAbility2Used);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ability_2_used', parsedFilesWithoutAbility2Used);
    expect(result).toEqual([]);
  });

  it('should handle single ability_2_used event correctly', async () => {
    const singleEvent: Ability2UsedLogEvent[] = [
      {
        matchId: 'match1',
        type: 'ability_2_used',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Ana',
        heroDuplicated: '',
      },
    ];

    mockExtractEventsFromFiles.mockResolvedValueOnce(singleEvent);

    const result = await ability2UsedFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ability_2_used', mockParsedFiles);
    expect(result).toEqual(singleEvent);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      matchId: 'match1',
      type: 'ability_2_used',
      matchTime: 100,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Ana',
      heroDuplicated: '',
    });
  });

  it('should handle events with different hero duplicated values', async () => {
    const eventsWithHeroDuplicated: Ability2UsedLogEvent[] = [
      {
        matchId: 'match1',
        type: 'ability_2_used',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Ana',
        heroDuplicated: '',
      },
      {
        matchId: 'match1',
        type: 'ability_2_used',
        matchTime: 150,
        playerTeam: 'Team A',
        playerName: 'Player2',
        playerHero: 'Ana',
        heroDuplicated: '0x02',
      },
    ];

    mockExtractEventsFromFiles.mockResolvedValueOnce(eventsWithHeroDuplicated);

    const result = await ability2UsedFn(mockParsedFiles);

    expect(result).toEqual(eventsWithHeroDuplicated);
    expect(result).toHaveLength(2);
    expect(result[0].heroDuplicated).toBe('');
    expect(result[1].heroDuplicated).toBe('0x02');
  });

  it('should handle events from multiple matches with various heroes', async () => {
    const multiMatchEvents: Ability2UsedLogEvent[] = [
      {
        matchId: 'match1',
        type: 'ability_2_used',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Ana',
        heroDuplicated: '',
      },
      {
        matchId: 'match1',
        type: 'ability_2_used',
        matchTime: 150,
        playerTeam: 'Team B',
        playerName: 'Player2',
        playerHero: 'Mercy',
        heroDuplicated: '',
      },
      {
        matchId: 'match2',
        type: 'ability_2_used',
        matchTime: 200,
        playerTeam: 'Team C',
        playerName: 'Player3',
        playerHero: 'Genji',
        heroDuplicated: '',
      },
      {
        matchId: 'match2',
        type: 'ability_2_used',
        matchTime: 250,
        playerTeam: 'Team D',
        playerName: 'Player4',
        playerHero: 'Reinhardt',
        heroDuplicated: '',
      },
    ];

    mockExtractEventsFromFiles.mockResolvedValueOnce(multiMatchEvents);

    const result = await ability2UsedFn(mockParsedFiles);

    expect(result).toEqual(multiMatchEvents);
    expect(result).toHaveLength(4);
    
    // Verify different match IDs
    const matchIds = [...new Set(result.map(event => event.matchId))];
    expect(matchIds).toContain('match1');
    expect(matchIds).toContain('match2');
    
    // Verify different heroes
    const heroes = [...new Set(result.map(event => event.playerHero))];
    expect(heroes).toContain('Ana');
    expect(heroes).toContain('Mercy');
    expect(heroes).toContain('Genji');
    expect(heroes).toContain('Reinhardt');
  });

  it('should handle error from extractEventsFromFiles', async () => {
    const errorMessage = 'Failed to extract events';
    mockExtractEventsFromFiles.mockRejectedValueOnce(new Error(errorMessage));

    await expect(ability2UsedFn(mockParsedFiles)).rejects.toThrow(errorMessage);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ability_2_used', mockParsedFiles);
  });

  it('should maintain the correct type structure for ability_2_used events', async () => {
    const typedEvents: Ability2UsedLogEvent[] = [
      {
        matchId: 'match1',
        type: 'ability_2_used',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Ana',
        heroDuplicated: '',
      },
    ];

    mockExtractEventsFromFiles.mockResolvedValueOnce(typedEvents);

    const result = await ability2UsedFn(mockParsedFiles);

    expect(result).toEqual(typedEvents);
    
    // Verify the structure of the returned event
    if (result.length > 0) {
      const event = result[0];
      expect(event).toHaveProperty('matchId');
      expect(event).toHaveProperty('type');
      expect(event).toHaveProperty('matchTime');
      expect(event).toHaveProperty('playerTeam');
      expect(event).toHaveProperty('playerName');
      expect(event).toHaveProperty('playerHero');
      expect(event).toHaveProperty('heroDuplicated');
      
      expect(typeof event.matchId).toBe('string');
      expect(typeof event.type).toBe('string');
      expect(typeof event.matchTime).toBe('number');
      expect(typeof event.playerTeam).toBe('string');
      expect(typeof event.playerName).toBe('string');
      expect(typeof event.playerHero).toBe('string');
      expect(typeof event.heroDuplicated).toBe('string');
      
      expect(event.type).toBe('ability_2_used');
    }
  });

  it('should handle events with edge case values', async () => {
    const edgeCaseEvents: Ability2UsedLogEvent[] = [
      {
        matchId: '',
        type: 'ability_2_used',
        matchTime: 0,
        playerTeam: '',
        playerName: '',
        playerHero: '',
        heroDuplicated: '',
      },
      {
        matchId: 'very-long-match-id-with-special-characters-123456789',
        type: 'ability_2_used',
        matchTime: 999999,
        playerTeam: 'Team with spaces',
        playerName: 'Player.Name-With_Special*Characters',
        playerHero: 'D.Va',
        heroDuplicated: '0xFF',
      },
    ];

    mockExtractEventsFromFiles.mockResolvedValueOnce(edgeCaseEvents);

    const result = await ability2UsedFn(mockParsedFiles);

    expect(result).toEqual(edgeCaseEvents);
    expect(result).toHaveLength(2);
    
    // Verify edge case handling
    expect(result[0].matchId).toBe('');
    expect(result[0].matchTime).toBe(0);
    expect(result[1].matchId).toBe('very-long-match-id-with-special-characters-123456789');
    expect(result[1].matchTime).toBe(999999);
    expect(result[1].playerName).toBe('Player.Name-With_Special*Characters');
    expect(result[1].playerHero).toBe('D.Va');
  });
});