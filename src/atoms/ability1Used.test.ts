import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { ability1UsedFn } from '@atoms/ability1Used';
import type { LogFileParserAtomType, Ability1UsedLogEvent } from '@atoms';
import { extractEventsFromFiles } from '@library';

vi.mock('@library', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    extractEventsFromFiles: vi.fn(),
  };
});

describe('ability1UsedFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;
  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'match1.txt',
      matchId: 'match1',
      fileModified: 1234567890,
      logs: [
        {
          specName: 'ability_1_used',
          data: [
            {
              type: 'ability_1_used',
              matchTime: 150,
              playerTeam: 'Team A',
              playerName: 'Player1',
              playerHero: 'Ana',
              heroDuplicated: '',
            },
            {
              type: 'ability_1_used',
              matchTime: 300,
              playerTeam: 'Team B',
              playerName: 'Player2',
              playerHero: 'Genji',
              heroDuplicated: '',
            }
          ]
        }
      ]
    },
    {
      fileName: 'match2.txt',
      matchId: 'match2',
      fileModified: 1234567891,
      logs: [
        {
          specName: 'ability_1_used',
          data: [
            {
              type: 'ability_1_used',
              matchTime: 75,
              playerTeam: 'Team C',
              playerName: 'Player3',
              playerHero: 'Tracer',
              heroDuplicated: '',
            }
          ]
        }
      ]
    }
  ];

  const mockAbility1UsedEvents: Ability1UsedLogEvent[] = [
    {
      matchId: 'match1',
      type: 'ability_1_used',
      matchTime: 150,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Ana',
      heroDuplicated: '',
    },
    {
      matchId: 'match1',
      type: 'ability_1_used',
      matchTime: 300,
      playerTeam: 'Team B',
      playerName: 'Player2',
      playerHero: 'Genji',
      heroDuplicated: '',
    },
    {
      matchId: 'match2',
      type: 'ability_1_used',
      matchTime: 75,
      playerTeam: 'Team C',
      playerName: 'Player3',
      playerHero: 'Tracer',
      heroDuplicated: '',
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract ability_1_used events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockAbility1UsedEvents);

    const result = await ability1UsedFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ability_1_used', mockParsedFiles);
    expect(result).toEqual(mockAbility1UsedEvents);
    expect(result).toHaveLength(3);
  });

  it('should return correct event structure with all required properties', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockAbility1UsedEvents);

    const result = await ability1UsedFn(mockParsedFiles);
    const firstEvent = result[0];

    expect(firstEvent).toHaveProperty('matchId', 'match1');
    expect(firstEvent).toHaveProperty('type', 'ability_1_used');
    expect(firstEvent).toHaveProperty('matchTime', 150);
    expect(firstEvent).toHaveProperty('playerTeam', 'Team A');
    expect(firstEvent).toHaveProperty('playerName', 'Player1');
    expect(firstEvent).toHaveProperty('playerHero', 'Ana');
    expect(firstEvent).toHaveProperty('heroDuplicated', '');
  });

  it('should handle empty parsed files array', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await ability1UsedFn([]);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ability_1_used', []);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle parsed files with no ability_1_used events', async () => {
    const parsedFilesWithoutAbility1Used: LogFileParserAtomType = [
      {
        fileName: 'match_no_abilities.txt',
        matchId: 'match_no_abilities',
        fileModified: 1234567892,
        logs: [
          {
            specName: 'kill',
            data: [
              {
                type: 'kill',
                matchTime: 100,
                attackerTeam: 'Team A',
                attackerName: 'Player1',
                attackerHero: 'Ana',
                victimTeam: 'Team B',
                victimName: 'Player2',
                victimHero: 'Mercy',
              }
            ]
          }
        ]
      }
    ];

    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await ability1UsedFn(parsedFilesWithoutAbility1Used);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ability_1_used', parsedFilesWithoutAbility1Used);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle single file with multiple ability_1_used events', async () => {
    const singleFileMultipleEvents: LogFileParserAtomType = [
      {
        fileName: 'single_match.txt',
        matchId: 'single_match',
        fileModified: 1234567893,
        logs: [
          {
            specName: 'ability_1_used',
            data: [
              {
                type: 'ability_1_used',
                matchTime: 50,
                playerTeam: 'Team A',
                playerName: 'Ana_Player',
                playerHero: 'Ana',
                heroDuplicated: '',
              },
              {
                type: 'ability_1_used',
                matchTime: 125,
                playerTeam: 'Team A',
                playerName: 'Ana_Player',
                playerHero: 'Ana',
                heroDuplicated: '',
              },
              {
                type: 'ability_1_used',
                matchTime: 200,
                playerTeam: 'Team B',
                playerName: 'Genji_Player',
                playerHero: 'Genji',
                heroDuplicated: '',
              }
            ]
          }
        ]
      }
    ];

    const expectedEvents: Ability1UsedLogEvent[] = [
      {
        matchId: 'single_match',
        type: 'ability_1_used',
        matchTime: 50,
        playerTeam: 'Team A',
        playerName: 'Ana_Player',
        playerHero: 'Ana',
        heroDuplicated: '',
      },
      {
        matchId: 'single_match',
        type: 'ability_1_used',
        matchTime: 125,
        playerTeam: 'Team A',
        playerName: 'Ana_Player',
        playerHero: 'Ana',
        heroDuplicated: '',
      },
      {
        matchId: 'single_match',
        type: 'ability_1_used',
        matchTime: 200,
        playerTeam: 'Team B',
        playerName: 'Genji_Player',
        playerHero: 'Genji',
        heroDuplicated: '',
      }
    ];

    mockExtractEventsFromFiles.mockReturnValue(expectedEvents);

    const result = await ability1UsedFn(singleFileMultipleEvents);

    expect(result).toEqual(expectedEvents);
    expect(result).toHaveLength(3);
  });

  it('should handle files with mixed event types', async () => {
    const mixedEventFiles: LogFileParserAtomType = [
      {
        fileName: 'mixed_events.txt',
        matchId: 'mixed_match',
        fileModified: 1234567894,
        logs: [
          {
            specName: 'ability_1_used',
            data: [
              {
                type: 'ability_1_used',
                matchTime: 100,
                playerTeam: 'Team A',
                playerName: 'Player1',
                playerHero: 'Ana',
                heroDuplicated: '',
              }
            ]
          },
          {
            specName: 'ability_2_used',
            data: [
              {
                type: 'ability_2_used',
                matchTime: 150,
                playerTeam: 'Team A',
                playerName: 'Player1',
                playerHero: 'Ana',
                heroDuplicated: '',
              }
            ]
          },
          {
            specName: 'kill',
            data: [
              {
                type: 'kill',
                matchTime: 200,
                attackerTeam: 'Team A',
                attackerName: 'Player1',
                attackerHero: 'Ana',
              }
            ]
          }
        ]
      }
    ];

    const expectedAbility1Events: Ability1UsedLogEvent[] = [
      {
        matchId: 'mixed_match',
        type: 'ability_1_used',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Ana',
        heroDuplicated: '',
      }
    ];

    mockExtractEventsFromFiles.mockReturnValue(expectedAbility1Events);

    const result = await ability1UsedFn(mixedEventFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ability_1_used', mixedEventFiles);
    expect(result).toEqual(expectedAbility1Events);
    expect(result).toHaveLength(1);
  });

  it('should handle events with heroDuplicated field populated', async () => {
    const duplicatedHeroEvents: LogFileParserAtomType = [
      {
        fileName: 'duplicated_heroes.txt',
        matchId: 'duplicated_match',
        fileModified: 1234567895,
        logs: [
          {
            specName: 'ability_1_used',
            data: [
              {
                type: 'ability_1_used',
                matchTime: 100,
                playerTeam: 'Team A',
                playerName: 'Ana_Player1',
                playerHero: 'Ana',
                heroDuplicated: 'true',
              },
              {
                type: 'ability_1_used',
                matchTime: 150,
                playerTeam: 'Team A',
                playerName: 'Ana_Player2',
                playerHero: 'Ana',
                heroDuplicated: 'true',
              }
            ]
          }
        ]
      }
    ];

    const expectedEvents: Ability1UsedLogEvent[] = [
      {
        matchId: 'duplicated_match',
        type: 'ability_1_used',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Ana_Player1',
        playerHero: 'Ana',
        heroDuplicated: 'true',
      },
      {
        matchId: 'duplicated_match',
        type: 'ability_1_used',
        matchTime: 150,
        playerTeam: 'Team A',
        playerName: 'Ana_Player2',
        playerHero: 'Ana',
        heroDuplicated: 'true',
      }
    ];

    mockExtractEventsFromFiles.mockReturnValue(expectedEvents);

    const result = await ability1UsedFn(duplicatedHeroEvents);

    expect(result).toEqual(expectedEvents);
    expect(result.every(event => event.heroDuplicated === 'true')).toBe(true);
  });

  it('should handle extractEventsFromFiles throwing an error', async () => {
    const errorMessage = 'Failed to extract events';
    mockExtractEventsFromFiles.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await expect(ability1UsedFn(mockParsedFiles)).rejects.toThrow(errorMessage);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ability_1_used', mockParsedFiles);
  });

  it('should pass correct event type parameter to extractEventsFromFiles', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    await ability1UsedFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('ability_1_used', mockParsedFiles);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
  });

  it('should handle events with edge case timing values', async () => {
    const edgeCaseEvents: LogFileParserAtomType = [
      {
        fileName: 'edge_cases.txt',
        matchId: 'edge_match',
        fileModified: 1234567896,
        logs: [
          {
            specName: 'ability_1_used',
            data: [
              {
                type: 'ability_1_used',
                matchTime: 0, // Start of match
                playerTeam: 'Team A',
                playerName: 'Player1',
                playerHero: 'Ana',
                heroDuplicated: '',
              },
              {
                type: 'ability_1_used',
                matchTime: 999999, // Very late in match
                playerTeam: 'Team B',
                playerName: 'Player2',
                playerHero: 'Genji',
                heroDuplicated: '',
              }
            ]
          }
        ]
      }
    ];

    const expectedEvents: Ability1UsedLogEvent[] = [
      {
        matchId: 'edge_match',
        type: 'ability_1_used',
        matchTime: 0,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Ana',
        heroDuplicated: '',
      },
      {
        matchId: 'edge_match',
        type: 'ability_1_used',
        matchTime: 999999,
        playerTeam: 'Team B',
        playerName: 'Player2',
        playerHero: 'Genji',
        heroDuplicated: '',
      }
    ];

    mockExtractEventsFromFiles.mockReturnValue(expectedEvents);

    const result = await ability1UsedFn(edgeCaseEvents);

    expect(result).toEqual(expectedEvents);
    expect(result[0].matchTime).toBe(0);
    expect(result[1].matchTime).toBe(999999);
  });

  it('should handle events with special characters in player names', async () => {
    const specialCharEvents: LogFileParserAtomType = [
      {
        fileName: 'special_chars.txt',
        matchId: 'special_match',
        fileModified: 1234567897,
        logs: [
          {
            specName: 'ability_1_used',
            data: [
              {
                type: 'ability_1_used',
                matchTime: 100,
                playerTeam: 'Team A',
                playerName: 'Player-1_Test',
                playerHero: 'Ana',
                heroDuplicated: '',
              },
              {
                type: 'ability_1_used',
                matchTime: 200,
                playerTeam: 'Team B',
                playerName: 'Player#2@Test',
                playerHero: 'Genji',
                heroDuplicated: '',
              }
            ]
          }
        ]
      }
    ];

    const expectedEvents: Ability1UsedLogEvent[] = [
      {
        matchId: 'special_match',
        type: 'ability_1_used',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player-1_Test',
        playerHero: 'Ana',
        heroDuplicated: '',
      },
      {
        matchId: 'special_match',
        type: 'ability_1_used',
        matchTime: 200,
        playerTeam: 'Team B',
        playerName: 'Player#2@Test',
        playerHero: 'Genji',
        heroDuplicated: '',
      }
    ];

    mockExtractEventsFromFiles.mockReturnValue(expectedEvents);

    const result = await ability1UsedFn(specialCharEvents);

    expect(result).toEqual(expectedEvents);
    expect(result[0].playerName).toBe('Player-1_Test');
    expect(result[1].playerName).toBe('Player#2@Test');
  });
});