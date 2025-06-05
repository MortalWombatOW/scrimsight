import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { healingFn } from '@atoms/healing';
import type { LogFileParserAtomType, HealingType } from '@atoms';
import { extractEventsFromFiles } from '@library';

// Mock @library functions
const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;

vi.mock('@library', () => ({
  extractEventsFromFiles: vi.fn(),
}));

describe('healingFn', () => {
  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'test-match1.log',
      matchId: 'match1',
      logs: [
        {
          specName: 'healing',
          data: [
            {
              matchId: 'match1',
              type: 'healing',
              matchTime: 150,
              healerTeam: 'Team A',
              healerName: 'Mercy1',
              healeeTeam: 'Team A',
              healeeName: 'Tracer1',
              healeeHero: 'Tracer',
              eventAbility: 'Caduceus Staff',
              eventHealing: 60,
              isHealthPack: false,
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
          specName: 'healing',
          data: [
            {
              matchId: 'match2',
              type: 'healing',
              matchTime: 200,
              healerTeam: 'Team B',
              healerName: 'Ana1',
              healeeTeam: 'Team B',
              healeeName: 'Reinhardt1',
              healeeHero: 'Reinhardt',
              eventAbility: 'Biotic Rifle',
              eventHealing: 75,
              isHealthPack: false,
            }
          ]
        }
      ],
      fileModified: 1234567891,
    }
  ];

  const mockHealingEvents: HealingType = [
    {
      matchId: 'match1',
      type: 'healing',
      matchTime: 150,
      healerTeam: 'Team A',
      healerName: 'Mercy1',
      healeeTeam: 'Team A',
      healeeName: 'Tracer1',
      healeeHero: 'Tracer',
      eventAbility: 'Caduceus Staff',
      eventHealing: 60,
      isHealthPack: false,
    },
    {
      matchId: 'match2',
      type: 'healing',
      matchTime: 200,
      healerTeam: 'Team B',
      healerName: 'Ana1',
      healeeTeam: 'Team B',
      healeeName: 'Reinhardt1',
      healeeHero: 'Reinhardt',
      eventAbility: 'Biotic Rifle',
      eventHealing: 75,
      isHealthPack: false,
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract healing events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValueOnce(mockHealingEvents);

    const result = await healingFn(mockParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('healing', mockParsedFiles);
    expect(extractEventsFromFiles).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockHealingEvents);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no healing events found', async () => {
    mockExtractEventsFromFiles.mockReturnValueOnce([]);

    const result = await healingFn(mockParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('healing', mockParsedFiles);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    const emptyParsedFiles: LogFileParserAtomType = [];
    mockExtractEventsFromFiles.mockReturnValueOnce([]);

    const result = await healingFn(emptyParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('healing', emptyParsedFiles);
    expect(result).toEqual([]);
  });

  it('should handle files with no healing data', async () => {
    const filesWithoutHealing: LogFileParserAtomType = [
      {
        fileName: 'no-healing.log',
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

    const result = await healingFn(filesWithoutHealing);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('healing', filesWithoutHealing);
    expect(result).toEqual([]);
  });

  it('should handle mixed file types with some containing healing data', async () => {
    const mixedEvents: HealingType = [
      {
        matchId: 'match1',
        type: 'healing',
        matchTime: 100,
        healerTeam: 'Team A',
        healerName: 'Baptiste1',
        healeeTeam: 'Team A',
        healeeName: 'Soldier1',
        healeeHero: 'Soldier: 76',
        eventAbility: 'Biotic Launcher',
        eventHealing: 45,
        isHealthPack: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(mixedEvents);

    const result = await healingFn(mockParsedFiles);

    expect(result).toEqual(mixedEvents);
    expect(result).toHaveLength(1);
  });

  it('should handle health pack healing events', async () => {
    const healthPackEvents: HealingType = [
      {
        matchId: 'match1',
        type: 'healing',
        matchTime: 180,
        healerTeam: 'Team A',
        healerName: 'Genji1',
        healeeTeam: 'Team A',
        healeeName: 'Genji1',
        healeeHero: 'Genji',
        eventAbility: 'Health Pack',
        eventHealing: 75,
        isHealthPack: true,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(healthPackEvents);

    const result = await healingFn(mockParsedFiles);

    expect(result).toEqual(healthPackEvents);
    expect(result[0].isHealthPack).toBe(true);
  });

  it('should handle self-healing events', async () => {
    const selfHealingEvents: HealingType = [
      {
        matchId: 'match1',
        type: 'healing',
        matchTime: 220,
        healerTeam: 'Team A',
        healerName: 'Roadhog1',
        healeeTeam: 'Team A',
        healeeName: 'Roadhog1',
        healeeHero: 'Roadhog',
        eventAbility: 'Take a Breather',
        eventHealing: 300,
        isHealthPack: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(selfHealingEvents);

    const result = await healingFn(mockParsedFiles);

    expect(result).toEqual(selfHealingEvents);
    expect(result[0].healerName).toBe(result[0].healeeName);
  });

  it('should handle large healing amounts', async () => {
    const largeHealingEvents: HealingType = [
      {
        matchId: 'match1',
        type: 'healing',
        matchTime: 250,
        healerTeam: 'Team A',
        healerName: 'Moira1',
        healeeTeam: 'Team A',
        healeeName: 'Reinhardt1',
        healeeHero: 'Reinhardt',
        eventAbility: 'Coalescence',
        eventHealing: 999,
        isHealthPack: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(largeHealingEvents);

    const result = await healingFn(mockParsedFiles);

    expect(result).toEqual(largeHealingEvents);
    expect(result[0].eventHealing).toBe(999);
  });

  it('should handle zero healing amounts', async () => {
    const zeroHealingEvents: HealingType = [
      {
        matchId: 'match1',
        type: 'healing',
        matchTime: 280,
        healerTeam: 'Team A',
        healerName: 'Mercy1',
        healeeTeam: 'Team A',
        healeeName: 'Tracer1',
        healeeHero: 'Tracer',
        eventAbility: 'Caduceus Staff',
        eventHealing: 0,
        isHealthPack: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(zeroHealingEvents);

    const result = await healingFn(mockParsedFiles);

    expect(result).toEqual(zeroHealingEvents);
    expect(result[0].eventHealing).toBe(0);
  });

  it('should handle events with various healer heroes', async () => {
    const multiHealerEvents: HealingType = [
      {
        matchId: 'match1',
        type: 'healing',
        matchTime: 100,
        healerTeam: 'Team A',
        healerName: 'Mercy1',
        healeeTeam: 'Team A',
        healeeName: 'Soldier1',
        healeeHero: 'Soldier: 76',
        eventAbility: 'Caduceus Staff',
        eventHealing: 60,
        isHealthPack: false,
      },
      {
        matchId: 'match1',
        type: 'healing',
        matchTime: 120,
        healerTeam: 'Team A',
        healerName: 'Ana1',
        healeeTeam: 'Team A',
        healeeName: 'Reinhardt1',
        healeeHero: 'Reinhardt',
        eventAbility: 'Biotic Rifle',
        eventHealing: 75,
        isHealthPack: false,
      },
      {
        matchId: 'match1',
        type: 'healing',
        matchTime: 140,
        healerTeam: 'Team A',
        healerName: 'Zenyatta1',
        healeeTeam: 'Team A',
        healeeName: 'Tracer1',
        healeeHero: 'Tracer',
        eventAbility: 'Orb of Harmony',
        eventHealing: 30,
        isHealthPack: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(multiHealerEvents);

    const result = await healingFn(mockParsedFiles);

    expect(result).toEqual(multiHealerEvents);
    expect(result).toHaveLength(3);
    
    // Verify different healer types are present
    const healerNames = result.map(event => event.healerName);
    expect(healerNames).toContain('Mercy1');
    expect(healerNames).toContain('Ana1');
    expect(healerNames).toContain('Zenyatta1');
  });

  it('should handle cross-team healing (if possible in game)', async () => {
    const crossTeamEvents: HealingType = [
      {
        matchId: 'match1',
        type: 'healing',
        matchTime: 300,
        healerTeam: 'Team A',
        healerName: 'Mercy1',
        healeeTeam: 'Team B',
        healeeName: 'Soldier1',
        healeeHero: 'Soldier: 76',
        eventAbility: 'Caduceus Staff',
        eventHealing: 60,
        isHealthPack: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(crossTeamEvents);

    const result = await healingFn(mockParsedFiles);

    expect(result).toEqual(crossTeamEvents);
    expect(result[0].healerTeam).not.toBe(result[0].healeeTeam);
  });

  it('should preserve all event properties correctly', async () => {
    const completeEvent: HealingType = [
      {
        matchId: 'match1',
        type: 'healing',
        matchTime: 350,
        healerTeam: 'Team Alpha',
        healerName: 'Lucio_Player',
        healeeTeam: 'Team Alpha',
        healeeName: 'DVa_Player',
        healeeHero: 'D.Va',
        eventAbility: 'Crossfade',
        eventHealing: 16,
        isHealthPack: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(completeEvent);

    const result = await healingFn(mockParsedFiles);

    expect(result[0]).toHaveProperty('matchId', 'match1');
    expect(result[0]).toHaveProperty('type', 'healing');
    expect(result[0]).toHaveProperty('matchTime', 350);
    expect(result[0]).toHaveProperty('healerTeam', 'Team Alpha');
    expect(result[0]).toHaveProperty('healerName', 'Lucio_Player');
    expect(result[0]).toHaveProperty('healeeTeam', 'Team Alpha');
    expect(result[0]).toHaveProperty('healeeName', 'DVa_Player');
    expect(result[0]).toHaveProperty('healeeHero', 'D.Va');
    expect(result[0]).toHaveProperty('eventAbility', 'Crossfade');
    expect(result[0]).toHaveProperty('eventHealing', 16);
    expect(result[0]).toHaveProperty('isHealthPack', false);
  });

  it('should handle multiple matches in sequence', async () => {
    const multiMatchEvents: HealingType = [
      {
        matchId: 'match1',
        type: 'healing',
        matchTime: 100,
        healerTeam: 'Team A',
        healerName: 'Mercy1',
        healeeTeam: 'Team A',
        healeeName: 'Soldier1',
        healeeHero: 'Soldier: 76',
        eventAbility: 'Caduceus Staff',
        eventHealing: 60,
        isHealthPack: false,
      },
      {
        matchId: 'match2',
        type: 'healing',
        matchTime: 200,
        healerTeam: 'Team X',
        healerName: 'Ana2',
        healeeTeam: 'Team X',
        healeeName: 'Reinhardt2',
        healeeHero: 'Reinhardt',
        eventAbility: 'Biotic Rifle',
        eventHealing: 75,
        isHealthPack: false,
      },
      {
        matchId: 'match3',
        type: 'healing',
        matchTime: 300,
        healerTeam: 'Team Y',
        healerName: 'Baptiste3',
        healeeTeam: 'Team Y',
        healeeName: 'Tracer3',
        healeeHero: 'Tracer',
        eventAbility: 'Biotic Launcher',
        eventHealing: 45,
        isHealthPack: false,
      }
    ];

    mockExtractEventsFromFiles.mockReturnValueOnce(multiMatchEvents);

    const result = await healingFn(mockParsedFiles);

    expect(result).toEqual(multiMatchEvents);
    expect(result).toHaveLength(3);
    
    // Verify different matches are present
    const matchIds = result.map(event => event.matchId);
    expect(matchIds).toContain('match1');
    expect(matchIds).toContain('match2');
    expect(matchIds).toContain('match3');
  });
});