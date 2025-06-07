import { describe, it, expect, vi, MockedFunction, afterEach } from 'vitest';
import { heroSpawnFn } from '@atoms/heroSpawn';
import type { LogFileParserAtomType, HeroSpawnType } from '@atoms';
import { extractEventsFromFiles } from '@library';

vi.mock('@library', () => ({
  extractEventsFromFiles: vi.fn(),
}));

describe('heroSpawnFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;
  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'test-match1.log',
      matchId: 'match1',
      logs: [
        {
          specName: 'hero_spawn',
          data: [
            {
              matchId: 'match1',
              type: 'hero_spawn',
              matchTime: 150,
              playerTeam: 'Team A',
              playerName: 'Player1',
              playerHero: 'Ana',
              previousHero: 'None',
              heroTimePlayed: 0,
            },
            {
              matchId: 'match1',
              type: 'hero_spawn',
              matchTime: 180,
              playerTeam: 'Team A',
              playerName: 'Player2',
              playerHero: 'Genji',
              previousHero: 'None',
              heroTimePlayed: 0,
            }
          ]
        }
      ],
      fileModified: 1234567890,
    },
    {
      fileName: 'test-match2.log',
      matchId: 'match2',
      logs: [
        {
          specName: 'hero_spawn',
          data: [
            {
              matchId: 'match2',
              type: 'hero_spawn',
              matchTime: 200,
              playerTeam: 'Team B',
              playerName: 'Player3',
              playerHero: 'Mercy',
              previousHero: 'None',
              heroTimePlayed: 0,
            }
          ]
        }
      ],
      fileModified: 1234567891,
    }
  ];

  const mockHeroSpawnEvents: HeroSpawnType = [
    {
      matchId: 'match1',
      type: 'hero_spawn',
      matchTime: 150,
      playerTeam: 'Team A',
      playerName: 'Player1',
      playerHero: 'Ana',
      previousHero: 'None',
      heroTimePlayed: 0,
    },
    {
      matchId: 'match1',
      type: 'hero_spawn',
      matchTime: 180,
      playerTeam: 'Team A',
      playerName: 'Player2',
      playerHero: 'Genji',
      previousHero: 'None',
      heroTimePlayed: 0,
    },
    {
      matchId: 'match2',
      type: 'hero_spawn',
      matchTime: 200,
      playerTeam: 'Team B',
      playerName: 'Player3',
      playerHero: 'Mercy',
      previousHero: 'None',
      heroTimePlayed: 0,
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract hero spawn events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValueOnce(mockHeroSpawnEvents);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('hero_spawn', mockParsedFiles);
    expect(extractEventsFromFiles).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockHeroSpawnEvents);
    expect(result).toHaveLength(3);
  });

  it('should return empty array when no hero spawn events found', async () => {
    mockExtractEventsFromFiles.mockReturnValueOnce([]);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('hero_spawn', mockParsedFiles);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    const emptyParsedFiles: LogFileParserAtomType = [];
    mockExtractEventsFromFiles.mockReturnValueOnce([]);

    const result = await heroSpawnFn(emptyParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('hero_spawn', emptyParsedFiles);
    expect(result).toEqual([]);
  });

  it('should handle files with no hero spawn data', async () => {
    const filesWithoutHeroSpawn: LogFileParserAtomType = [
      {
        fileName: 'no-spawn.log',
        matchId: 'match3',
        logs: [
          {
            specName: 'damage',
            data: [{ /* damage event */ }]
          }
        ],
        fileModified: 1234567892,
      }
    ];
    mockExtractEventsFromFiles.mockReturnValueOnce([]);

    const result = await heroSpawnFn(filesWithoutHeroSpawn);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('hero_spawn', filesWithoutHeroSpawn);
    expect(result).toEqual([]);
  });

  it('should handle mixed file types with some containing hero spawn data', async () => {
    const mixedEvents: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Reinhardt',
        previousHero: 'None',
        heroTimePlayed: 0,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(mixedEvents);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(mixedEvents);
    expect(result).toHaveLength(1);
  });

  it('should handle hero spawns with previous hero data', async () => {
    const heroSpawnWithPrevious: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 300,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Mercy',
        previousHero: 'Ana',
        heroTimePlayed: 120,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(heroSpawnWithPrevious);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(heroSpawnWithPrevious);
    expect(result[0].previousHero).toBe('Ana');
    expect(result[0].heroTimePlayed).toBe(120);
  });

  it('should handle hero spawns at match start (time 0)', async () => {
    const matchStartSpawns: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 0,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Ana',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 0,
        playerTeam: 'Team B',
        playerName: 'Player2',
        playerHero: 'Mercy',
        previousHero: 'None',
        heroTimePlayed: 0,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(matchStartSpawns);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(matchStartSpawns);
    expect(result.every(event => event.matchTime === 0)).toBe(true);
    expect(result.every(event => event.previousHero === 'None')).toBe(true);
  });

  it('should handle hero spawns with very long hero time played', async () => {
    const longPlayTimeSpawns: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 1800,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Reinhardt',
        previousHero: 'Orisa',
        heroTimePlayed: 1200,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(longPlayTimeSpawns);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(longPlayTimeSpawns);
    expect(result[0].heroTimePlayed).toBe(1200);
  });

  it('should handle multiple hero spawns for same player', async () => {
    const multipleSpawns: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Ana',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 250,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Mercy',
        previousHero: 'Ana',
        heroTimePlayed: 150,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 400,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Zenyatta',
        previousHero: 'Mercy',
        heroTimePlayed: 150,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(multipleSpawns);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(multipleSpawns);
    expect(result).toHaveLength(3);
    
    // Verify progression of hero changes for the same player
    expect(result[0].playerHero).toBe('Ana');
    expect(result[1].playerHero).toBe('Mercy');
    expect(result[1].previousHero).toBe('Ana');
    expect(result[2].playerHero).toBe('Zenyatta');
    expect(result[2].previousHero).toBe('Mercy');
  });

  it('should handle various hero names including special characters', async () => {
    const specialHeroNames: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'D.Va',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 200,
        playerTeam: 'Team A',
        playerName: 'Player2',
        playerHero: 'Soldier: 76',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 300,
        playerTeam: 'Team A',
        playerName: 'Player3',
        playerHero: 'Torbjörn',
        previousHero: 'None',
        heroTimePlayed: 0,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(specialHeroNames);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(specialHeroNames);
    expect(result.map(event => event.playerHero)).toContain('D.Va');
    expect(result.map(event => event.playerHero)).toContain('Soldier: 76');
    expect(result.map(event => event.playerHero)).toContain('Torbjörn');
  });

  it('should handle player names with special characters and spaces', async () => {
    const specialPlayerNames: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 100,
        playerTeam: 'Team Alpha',
        playerName: 'Player_With_Underscore',
        playerHero: 'Ana',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 200,
        playerTeam: 'Team Beta',
        playerName: 'Player-With-Dashes',
        playerHero: 'Genji',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 300,
        playerTeam: 'Team Gamma',
        playerName: 'PlayerWithNumbers123',
        playerHero: 'Mercy',
        previousHero: 'None',
        heroTimePlayed: 0,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(specialPlayerNames);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(specialPlayerNames);
    expect(result.map(event => event.playerName)).toContain('Player_With_Underscore');
    expect(result.map(event => event.playerName)).toContain('Player-With-Dashes');
    expect(result.map(event => event.playerName)).toContain('PlayerWithNumbers123');
  });

  it('should handle team names with various formats', async () => {
    const variousTeamNames: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Ana',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 200,
        playerTeam: 'Red Team',
        playerName: 'Player2',
        playerHero: 'Genji',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 300,
        playerTeam: 'TEAM_BLUE_123',
        playerName: 'Player3',
        playerHero: 'Mercy',
        previousHero: 'None',
        heroTimePlayed: 0,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(variousTeamNames);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(variousTeamNames);
    expect(result.map(event => event.playerTeam)).toContain('Team A');
    expect(result.map(event => event.playerTeam)).toContain('Red Team');
    expect(result.map(event => event.playerTeam)).toContain('TEAM_BLUE_123');
  });

  it('should preserve all event properties correctly', async () => {
    const completeEvent: HeroSpawnType = [
      {
        matchId: 'match_complete_test',
        type: 'hero_spawn',
        matchTime: 450,
        playerTeam: 'Team Complete',
        playerName: 'CompletePlayer',
        playerHero: 'Baptiste',
        previousHero: 'Ana',
        heroTimePlayed: 300,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(completeEvent);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result[0]).toHaveProperty('matchId', 'match_complete_test');
    expect(result[0]).toHaveProperty('type', 'hero_spawn');
    expect(result[0]).toHaveProperty('matchTime', 450);
    expect(result[0]).toHaveProperty('playerTeam', 'Team Complete');
    expect(result[0]).toHaveProperty('playerName', 'CompletePlayer');
    expect(result[0]).toHaveProperty('playerHero', 'Baptiste');
    expect(result[0]).toHaveProperty('previousHero', 'Ana');
    expect(result[0]).toHaveProperty('heroTimePlayed', 300);
  });

  it('should handle multiple matches in sequence', async () => {
    const multiMatchEvents: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Ana',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match2',
        type: 'hero_spawn',
        matchTime: 150,
        playerTeam: 'Team X',
        playerName: 'Player2',
        playerHero: 'Genji',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match3',
        type: 'hero_spawn',
        matchTime: 200,
        playerTeam: 'Team Y',
        playerName: 'Player3',
        playerHero: 'Mercy',
        previousHero: 'None',
        heroTimePlayed: 0,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(multiMatchEvents);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(multiMatchEvents);
    expect(result).toHaveLength(3);
    
    // Verify different matches are present
    const matchIds = result.map(event => event.matchId);
    expect(matchIds).toContain('match1');
    expect(matchIds).toContain('match2');
    expect(matchIds).toContain('match3');
  });

  it('should handle zero hero time played edge case', async () => {
    const zeroTimeEvents: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Ana',
        previousHero: 'Mercy',
        heroTimePlayed: 0,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(zeroTimeEvents);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(zeroTimeEvents);
    expect(result[0].heroTimePlayed).toBe(0);
    expect(result[0].previousHero).toBe('Mercy');
  });

  it('should handle rapid hero swaps with minimal time played', async () => {
    const rapidSwaps: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Ana',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 105,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Mercy',
        previousHero: 'Ana',
        heroTimePlayed: 5,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 108,
        playerTeam: 'Team A',
        playerName: 'Player1',
        playerHero: 'Zenyatta',
        previousHero: 'Mercy',
        heroTimePlayed: 3,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(rapidSwaps);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(rapidSwaps);
    expect(result).toHaveLength(3);
    expect(result[1].heroTimePlayed).toBe(5);
    expect(result[2].heroTimePlayed).toBe(3);
  });

  it('should handle all tank heroes', async () => {
    const tankHeroes: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'TankPlayer1',
        playerHero: 'Reinhardt',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 200,
        playerTeam: 'Team A',
        playerName: 'TankPlayer2',
        playerHero: 'D.Va',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 300,
        playerTeam: 'Team A',
        playerName: 'TankPlayer3',
        playerHero: 'Winston',
        previousHero: 'None',
        heroTimePlayed: 0,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(tankHeroes);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(tankHeroes);
    expect(result.map(event => event.playerHero)).toContain('Reinhardt');
    expect(result.map(event => event.playerHero)).toContain('D.Va');
    expect(result.map(event => event.playerHero)).toContain('Winston');
  });

  it('should handle all support heroes', async () => {
    const supportHeroes: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'SupportPlayer1',
        playerHero: 'Ana',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 200,
        playerTeam: 'Team A',
        playerName: 'SupportPlayer2',
        playerHero: 'Mercy',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 300,
        playerTeam: 'Team A',
        playerName: 'SupportPlayer3',
        playerHero: 'Lucio',
        previousHero: 'None',
        heroTimePlayed: 0,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(supportHeroes);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(supportHeroes);
    expect(result.map(event => event.playerHero)).toContain('Ana');
    expect(result.map(event => event.playerHero)).toContain('Mercy');
    expect(result.map(event => event.playerHero)).toContain('Lucio');
  });

  it('should handle all damage heroes', async () => {
    const damageHeroes: HeroSpawnType = [
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 100,
        playerTeam: 'Team A',
        playerName: 'DpsPlayer1',
        playerHero: 'Genji',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 200,
        playerTeam: 'Team A',
        playerName: 'DpsPlayer2',
        playerHero: 'Tracer',
        previousHero: 'None',
        heroTimePlayed: 0,
      },
      {
        matchId: 'match1',
        type: 'hero_spawn',
        matchTime: 300,
        playerTeam: 'Team A',
        playerName: 'DpsPlayer3',
        playerHero: 'Widowmaker',
        previousHero: 'None',
        heroTimePlayed: 0,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(damageHeroes);

    const result = await heroSpawnFn(mockParsedFiles);

    expect(result).toEqual(damageHeroes);
    expect(result.map(event => event.playerHero)).toContain('Genji');
    expect(result.map(event => event.playerHero)).toContain('Tracer');
    expect(result.map(event => event.playerHero)).toContain('Widowmaker');
  });
});