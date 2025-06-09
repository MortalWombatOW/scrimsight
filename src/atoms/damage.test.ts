import { describe, it, expect, vi, MockedFunction, afterEach } from 'vitest';
import { damageFn } from '@atoms/damage';
import type { LogFileParserAtomType, DamageType } from '@atoms';
import { extractEventsFromFiles } from '@library';

vi.mock('@library', () => ({
  extractEventsFromFiles: vi.fn(),
}));

describe('damageFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;
  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'test-match1.log',
      matchId: 'match1',
      logs: [
        {
          specName: 'damage',
          data: [
            {
              matchId: 'match1',
              type: 'damage',
              matchTime: 150,
              attackerTeam: 'Team A',
              attackerName: 'Soldier1',
              attackerHero: 'Soldier: 76',
              victimTeam: 'Team B',
              victimName: 'Tracer1',
              victimHero: 'Tracer',
              eventAbility: 'Heavy Pulse Rifle',
              eventDamage: 19,
              isCriticalHit: false,
              isEnvironmental: false,
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
          specName: 'damage',
          data: [
            {
              matchId: 'match2',
              type: 'damage',
              matchTime: 200,
              attackerTeam: 'Team B',
              attackerName: 'Widowmaker1',
              attackerHero: 'Widowmaker',
              victimTeam: 'Team A',
              victimName: 'Ana1',
              victimHero: 'Ana',
              eventAbility: 'Widow\'s Kiss',
              eventDamage: 300,
              isCriticalHit: true,
              isEnvironmental: false,
            }
          ]
        }
      ],
      fileModified: 1234567891,
    }
  ];

  const mockDamageEvents: DamageType = [
    {
      matchId: 'match1',
      type: 'damage',
      matchTime: 150,
      attackerTeam: 'Team A',
      attackerName: 'Soldier1',
      attackerHero: 'Soldier: 76',
      victimTeam: 'Team B',
      victimName: 'Tracer1',
      victimHero: 'Tracer',
      eventAbility: 'Heavy Pulse Rifle',
      eventDamage: 19,
      isCriticalHit: false,
      isEnvironmental: false,
    },
    {
      matchId: 'match2',
      type: 'damage',
      matchTime: 200,
      attackerTeam: 'Team B',
      attackerName: 'Widowmaker1',
      attackerHero: 'Widowmaker',
      victimTeam: 'Team A',
      victimName: 'Ana1',
      victimHero: 'Ana',
      eventAbility: 'Widow\'s Kiss',
      eventDamage: 300,
      isCriticalHit: true,
      isEnvironmental: false,
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract damage events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValueOnce(mockDamageEvents);

    const result = await damageFn(mockParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('damage', mockParsedFiles);
    expect(extractEventsFromFiles).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockDamageEvents);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no damage events found', async () => {
    mockExtractEventsFromFiles.mockReturnValueOnce([]);

    const result = await damageFn(mockParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('damage', mockParsedFiles);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    const emptyParsedFiles: LogFileParserAtomType = [];
    mockExtractEventsFromFiles.mockReturnValueOnce([]);

    const result = await damageFn(emptyParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('damage', emptyParsedFiles);
    expect(result).toEqual([]);
  });

  it('should handle files with no damage data', async () => {
    const filesWithoutDamage: LogFileParserAtomType = [
      {
        fileName: 'no-damage.log',
        matchId: 'match3',
        logs: [
          {
            specName: 'healing',
            data: [{ /* healing event */ }]
          }
        ],
        fileModified: 1234567892,
      }
    ];
    mockExtractEventsFromFiles.mockReturnValueOnce([]);

    const result = await damageFn(filesWithoutDamage);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('damage', filesWithoutDamage);
    expect(result).toEqual([]);
  });

  it('should handle critical hit damage events', async () => {
    const criticalHitEvents: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 180,
        attackerTeam: 'Team A',
        attackerName: 'Hanzo1',
        attackerHero: 'Hanzo',
        victimTeam: 'Team B',
        victimName: 'Mercy1',
        victimHero: 'Mercy',
        eventAbility: 'Storm Bow',
        eventDamage: 250,
        isCriticalHit: true,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(criticalHitEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(criticalHitEvents);
    expect(result[0].isCriticalHit).toBe(true);
    expect(result[0].eventDamage).toBe(250);
  });

  it('should handle environmental damage events', async () => {
    const environmentalEvents: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 220,
        attackerTeam: 'Team A',
        attackerName: 'Pharah1',
        attackerHero: 'Pharah',
        victimTeam: 'Team B',
        victimName: 'Roadhog1',
        victimHero: 'Roadhog',
        eventAbility: 'Concussive Blast',
        eventDamage: 1000,
        isCriticalHit: false,
        isEnvironmental: true,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(environmentalEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(environmentalEvents);
    expect(result[0].isEnvironmental).toBe(true);
    expect(result[0].eventDamage).toBe(1000);
  });

  it('should handle zero damage events', async () => {
    const zeroDamageEvents: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 250,
        attackerTeam: 'Team A',
        attackerName: 'Genji1',
        attackerHero: 'Genji',
        victimTeam: 'Team B',
        victimName: 'Zarya1',
        victimHero: 'Zarya',
        eventAbility: 'Shuriken',
        eventDamage: 0,
        isCriticalHit: false,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(zeroDamageEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(zeroDamageEvents);
    expect(result[0].eventDamage).toBe(0);
  });

  it('should handle large damage amounts', async () => {
    const largeDamageEvents: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 280,
        attackerTeam: 'Team A',
        attackerName: 'Junkrat1',
        attackerHero: 'Junkrat',
        victimTeam: 'Team B',
        victimName: 'Reinhardt1',
        victimHero: 'Reinhardt',
        eventAbility: 'RIP-Tire',
        eventDamage: 600,
        isCriticalHit: false,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(largeDamageEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(largeDamageEvents);
    expect(result[0].eventDamage).toBe(600);
  });

  it('should handle self-damage events', async () => {
    const selfDamageEvents: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 310,
        attackerTeam: 'Team A',
        attackerName: 'Pharah1',
        attackerHero: 'Pharah',
        victimTeam: 'Team A',
        victimName: 'Pharah1',
        victimHero: 'Pharah',
        eventAbility: 'Rocket Launcher',
        eventDamage: 40,
        isCriticalHit: false,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(selfDamageEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(selfDamageEvents);
    expect(result[0].attackerName).toBe(result[0].victimName);
    expect(result[0].attackerTeam).toBe(result[0].victimTeam);
  });

  it('should handle multiple attacker heroes', async () => {
    const multiAttackerEvents: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 100,
        attackerTeam: 'Team A',
        attackerName: 'McCree1',
        attackerHero: 'Cassidy',
        victimTeam: 'Team B',
        victimName: 'Soldier1',
        victimHero: 'Soldier: 76',
        eventAbility: 'Peacekeeper',
        eventDamage: 70,
        isCriticalHit: false,
        isEnvironmental: false,
      },
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 120,
        attackerTeam: 'Team A',
        attackerName: 'Reaper1',
        attackerHero: 'Reaper',
        victimTeam: 'Team B',
        victimName: 'Winston1',
        victimHero: 'Winston',
        eventAbility: 'Hellfire Shotguns',
        eventDamage: 140,
        isCriticalHit: false,
        isEnvironmental: false,
      },
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 140,
        attackerTeam: 'Team A',
        attackerName: 'Ana1',
        attackerHero: 'Ana',
        victimTeam: 'Team B',
        victimName: 'Genji1',
        victimHero: 'Genji',
        eventAbility: 'Biotic Rifle',
        eventDamage: 70,
        isCriticalHit: false,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(multiAttackerEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(multiAttackerEvents);
    expect(result).toHaveLength(3);
    
    // Verify different attacker heroes are present
    const attackerHeroes = result.map(event => event.attackerHero);
    expect(attackerHeroes).toContain('Cassidy');
    expect(attackerHeroes).toContain('Reaper');
    expect(attackerHeroes).toContain('Ana');
  });

  it('should handle cross-team damage', async () => {
    const crossTeamEvents: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 350,
        attackerTeam: 'Team A',
        attackerName: 'Soldier1',
        attackerHero: 'Soldier: 76',
        victimTeam: 'Team B',
        victimName: 'Mercy1',
        victimHero: 'Mercy',
        eventAbility: 'Heavy Pulse Rifle',
        eventDamage: 19,
        isCriticalHit: false,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(crossTeamEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(crossTeamEvents);
    expect(result[0].attackerTeam).not.toBe(result[0].victimTeam);
  });

  it('should preserve all event properties correctly', async () => {
    const completeEvent: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 400,
        attackerTeam: 'Team Alpha',
        attackerName: 'DPS_Player',
        attackerHero: 'Tracer',
        victimTeam: 'Team Beta',
        victimName: 'Support_Player',
        victimHero: 'Zenyatta',
        eventAbility: 'Pulse Pistols',
        eventDamage: 240,
        isCriticalHit: true,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(completeEvent);

    const result = await damageFn(mockParsedFiles);

    expect(result[0]).toHaveProperty('matchId', 'match1');
    expect(result[0]).toHaveProperty('type', 'damage');
    expect(result[0]).toHaveProperty('matchTime', 400);
    expect(result[0]).toHaveProperty('attackerTeam', 'Team Alpha');
    expect(result[0]).toHaveProperty('attackerName', 'DPS_Player');
    expect(result[0]).toHaveProperty('attackerHero', 'Tracer');
    expect(result[0]).toHaveProperty('victimTeam', 'Team Beta');
    expect(result[0]).toHaveProperty('victimName', 'Support_Player');
    expect(result[0]).toHaveProperty('victimHero', 'Zenyatta');
    expect(result[0]).toHaveProperty('eventAbility', 'Pulse Pistols');
    expect(result[0]).toHaveProperty('eventDamage', 240);
    expect(result[0]).toHaveProperty('isCriticalHit', true);
    expect(result[0]).toHaveProperty('isEnvironmental', false);
  });

  it('should handle ultimate abilities damage', async () => {
    const ultimateEvents: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 450,
        attackerTeam: 'Team A',
        attackerName: 'Pharah1',
        attackerHero: 'Pharah',
        victimTeam: 'Team B',
        victimName: 'Mercy1',
        victimHero: 'Mercy',
        eventAbility: 'Barrage',
        eventDamage: 1200,
        isCriticalHit: false,
        isEnvironmental: false,
      },
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 470,
        attackerTeam: 'Team A',
        attackerName: 'Genji1',
        attackerHero: 'Genji',
        victimTeam: 'Team B',
        victimName: 'Ana1',
        victimHero: 'Ana',
        eventAbility: 'Dragonblade',
        eventDamage: 120,
        isCriticalHit: false,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(ultimateEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(ultimateEvents);
    expect(result).toHaveLength(2);
    expect(result[0].eventAbility).toBe('Barrage');
    expect(result[1].eventAbility).toBe('Dragonblade');
  });

  it('should handle ability damage with special characters', async () => {
    const specialAbilityEvents: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 500,
        attackerTeam: 'Team A',
        attackerName: 'DVa1',
        attackerHero: 'D.Va',
        victimTeam: 'Team B',
        victimName: 'Soldier1',
        victimHero: 'Soldier: 76',
        eventAbility: 'Self-Destruct',
        eventDamage: 1000,
        isCriticalHit: false,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(specialAbilityEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(specialAbilityEvents);
    expect(result[0].attackerHero).toBe('D.Va');
    expect(result[0].victimHero).toBe('Soldier: 76');
    expect(result[0].eventAbility).toBe('Self-Destruct');
  });

  it('should handle multiple matches in sequence', async () => {
    const multiMatchEvents: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 100,
        attackerTeam: 'Team A',
        attackerName: 'Soldier1',
        attackerHero: 'Soldier: 76',
        victimTeam: 'Team B',
        victimName: 'Tracer1',
        victimHero: 'Tracer',
        eventAbility: 'Heavy Pulse Rifle',
        eventDamage: 19,
        isCriticalHit: false,
        isEnvironmental: false,
      },
      {
        matchId: 'match2',
        type: 'damage',
        matchTime: 200,
        attackerTeam: 'Team X',
        attackerName: 'Widowmaker2',
        attackerHero: 'Widowmaker',
        victimTeam: 'Team Y',
        victimName: 'Ana2',
        victimHero: 'Ana',
        eventAbility: 'Widow\'s Kiss',
        eventDamage: 300,
        isCriticalHit: true,
        isEnvironmental: false,
      },
      {
        matchId: 'match3',
        type: 'damage',
        matchTime: 300,
        attackerTeam: 'Team Z',
        attackerName: 'Reinhardt3',
        attackerHero: 'Reinhardt',
        victimTeam: 'Team W',
        victimName: 'Genji3',
        victimHero: 'Genji',
        eventAbility: 'Rocket Hammer',
        eventDamage: 75,
        isCriticalHit: false,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(multiMatchEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(multiMatchEvents);
    expect(result).toHaveLength(3);
    
    // Verify different matches are present
    const matchIds = result.map(event => event.matchId);
    expect(matchIds).toContain('match1');
    expect(matchIds).toContain('match2');
    expect(matchIds).toContain('match3');
  });

  it('should handle mixed file types with some containing damage data', async () => {
    const mixedEvents: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 550,
        attackerTeam: 'Team A',
        attackerName: 'Reaper1',
        attackerHero: 'Reaper',
        victimTeam: 'Team B',
        victimName: 'Winston1',
        victimHero: 'Winston',
        eventAbility: 'Hellfire Shotguns',
        eventDamage: 140,
        isCriticalHit: false,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(mixedEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(mixedEvents);
    expect(result).toHaveLength(1);
  });

  it('should handle extractEventsFromFiles throwing an error', async () => {
    const errorMessage = 'Failed to extract damage events';
    mockExtractEventsFromFiles.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await expect(damageFn(mockParsedFiles)).rejects.toThrow(errorMessage);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('damage', mockParsedFiles);
  });

  it('should pass correct event type parameter to extractEventsFromFiles', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    await damageFn(mockParsedFiles);

    expect(mockExtractEventsFromFiles).toHaveBeenCalledWith('damage', mockParsedFiles);
    expect(mockExtractEventsFromFiles).toHaveBeenCalledTimes(1);
  });

  it('should handle events with edge case timing values', async () => {
    const edgeCaseEvents: DamageType = [
      {
        matchId: 'edge_match',
        type: 'damage',
        matchTime: 0, // Start of match
        attackerTeam: 'Team A',
        attackerName: 'Soldier1',
        attackerHero: 'Soldier: 76',
        victimTeam: 'Team B',
        victimName: 'Tracer1',
        victimHero: 'Tracer',
        eventAbility: 'Heavy Pulse Rifle',
        eventDamage: 19,
        isCriticalHit: false,
        isEnvironmental: false,
      },
      {
        matchId: 'edge_match',
        type: 'damage',
        matchTime: 999999, // Very late in match
        attackerTeam: 'Team B',
        attackerName: 'Widowmaker1',
        attackerHero: 'Widowmaker',
        victimTeam: 'Team A',
        victimName: 'Ana1',
        victimHero: 'Ana',
        eventAbility: 'Widow\'s Kiss',
        eventDamage: 300,
        isCriticalHit: true,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(edgeCaseEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(edgeCaseEvents);
    expect(result[0].matchTime).toBe(0);
    expect(result[1].matchTime).toBe(999999);
  });

  it('should handle events with special characters in player names', async () => {
    const specialCharEvents: DamageType = [
      {
        matchId: 'special_match',
        type: 'damage',
        matchTime: 100,
        attackerTeam: 'Team A',
        attackerName: 'Player-1_Test',
        attackerHero: 'Soldier: 76',
        victimTeam: 'Team B',
        victimName: 'Player#2@Test',
        victimHero: 'Tracer',
        eventAbility: 'Heavy Pulse Rifle',
        eventDamage: 19,
        isCriticalHit: false,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(specialCharEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(specialCharEvents);
    expect(result[0].attackerName).toBe('Player-1_Test');
    expect(result[0].victimName).toBe('Player#2@Test');
  });

  it('should handle both critical hit and environmental damage combined', async () => {
    const combinedEvents: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 600,
        attackerTeam: 'Team A',
        attackerName: 'Lucio1',
        attackerHero: 'Lucio',
        victimTeam: 'Team B',
        victimName: 'Widowmaker1',
        victimHero: 'Widowmaker',
        eventAbility: 'Soundwave',
        eventDamage: 1000,
        isCriticalHit: true,
        isEnvironmental: true,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(combinedEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(combinedEvents);
    expect(result[0].isCriticalHit).toBe(true);
    expect(result[0].isEnvironmental).toBe(true);
    expect(result[0].eventDamage).toBe(1000);
  });

  it('should handle damage events with various abilities from same hero', async () => {
    const multiAbilityEvents: DamageType = [
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 100,
        attackerTeam: 'Team A',
        attackerName: 'Ana1',
        attackerHero: 'Ana',
        victimTeam: 'Team B',
        victimName: 'Tracer1',
        victimHero: 'Tracer',
        eventAbility: 'Biotic Rifle',
        eventDamage: 70,
        isCriticalHit: false,
        isEnvironmental: false,
      },
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 150,
        attackerTeam: 'Team A',
        attackerName: 'Ana1',
        attackerHero: 'Ana',
        victimTeam: 'Team B',
        victimName: 'Genji1',
        victimHero: 'Genji',
        eventAbility: 'Sleep Dart',
        eventDamage: 5,
        isCriticalHit: false,
        isEnvironmental: false,
      },
      {
        matchId: 'match1',
        type: 'damage',
        matchTime: 200,
        attackerTeam: 'Team A',
        attackerName: 'Ana1',
        attackerHero: 'Ana',
        victimTeam: 'Team B',
        victimName: 'Reinhardt1',
        victimHero: 'Reinhardt',
        eventAbility: 'Biotic Grenade',
        eventDamage: 60,
        isCriticalHit: false,
        isEnvironmental: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(multiAbilityEvents);

    const result = await damageFn(mockParsedFiles);

    expect(result).toEqual(multiAbilityEvents);
    expect(result).toHaveLength(3);
    
    // Verify different abilities from same hero
    const abilities = result.map(event => event.eventAbility);
    expect(abilities).toContain('Biotic Rifle');
    expect(abilities).toContain('Sleep Dart');
    expect(abilities).toContain('Biotic Grenade');
    
    // Verify all from same attacker
    const attackers = result.map(event => event.attackerName);
    expect(attackers.every(name => name === 'Ana1')).toBe(true);
  });
});