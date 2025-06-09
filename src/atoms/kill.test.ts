import { describe, it, expect, vi, MockedFunction } from 'vitest';
import { killFn } from '@atoms/kill';
import type { LogFileParserAtomType, KillType } from '@atoms';
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

describe('killFn', () => {
  // Mock @library functions
  const mockExtractEventsFromFiles = extractEventsFromFiles as MockedFunction<typeof extractEventsFromFiles>;
  const mockParsedFiles: LogFileParserAtomType = [
    {
      fileName: 'test-match1.log',
      matchId: 'match1',
      logs: [
        {
          specName: 'kill',
          data: [
            {
              type: 'kill',
              matchTime: 150,
              attackerTeam: 'Team A',
              attackerName: 'Player1',
              attackerHero: 'Ana',
              victimTeam: 'Team B',
              victimName: 'Player2',
              victimHero: 'Mercy',
              eventAbility: 'Scoped Shot',
              eventDamage: 200,
              isCriticalHit: true
            }
          ]
        }
      ],
      fileModified: 1234567890,
    }
  ];

  const mockKillEvents: KillType = [
    {
      matchId: 'match1',
      type: 'kill',
      matchTime: 150,
      attackerTeam: 'Team A',
      attackerName: 'Player1',
      attackerHero: 'Ana',
      victimTeam: 'Team B', 
      victimName: 'Player2',
      victimHero: 'Mercy',
      eventAbility: 'Scoped Shot',
      eventDamage: 200,
      isCriticalHit: true,
      isEnvironmental: false
    }
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extract kill events from parsed files', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockKillEvents);

    const result = await killFn(mockParsedFiles);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('kill', mockParsedFiles);
    expect(result).toEqual(mockKillEvents);
    expect(result).toHaveLength(1);
  });

  it('should return empty array when no kill events found', async () => {
    mockExtractEventsFromFiles.mockReturnValue([]);

    const result = await killFn(mockParsedFiles);

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle empty parsed files array', async () => {
    const result = await killFn([]);

    expect(extractEventsFromFiles).toHaveBeenCalledWith('kill', []);
    expect(result).toEqual([]);
  });

  it('should handle critical kills correctly', async () => {
    const criticalKills: KillType = [
      {
        matchId: 'match1',
        type: 'kill',
        matchTime: 100,
        attackerTeam: 'Team A',
        attackerName: 'Widowmaker1',
        attackerHero: 'Widowmaker',
        victimTeam: 'Team B',
        victimName: 'Tracer1',
        victimHero: 'Tracer',
        eventAbility: 'Widow\'s Kiss',
        eventDamage: 300,
        isCriticalHit: true,
        isEnvironmental: false
      }
    ];

    mockExtractEventsFromFiles.mockReturnValue(criticalKills);

    const result = await killFn(mockParsedFiles);

    expect(result[0].isCriticalHit).toBe(true);
    expect(result[0].eventDamage).toBe(300);
  });

  it('should handle events with all required properties', async () => {
    mockExtractEventsFromFiles.mockReturnValue(mockKillEvents);

    const result = await killFn(mockParsedFiles);
    const killEvent = result[0];

    expect(killEvent).toHaveProperty('matchId', 'match1');
    expect(killEvent).toHaveProperty('type', 'kill');
    expect(killEvent).toHaveProperty('matchTime', 150);
    expect(killEvent).toHaveProperty('attackerTeam', 'Team A');
    expect(killEvent).toHaveProperty('attackerName', 'Player1');
    expect(killEvent).toHaveProperty('attackerHero', 'Ana');
    expect(killEvent).toHaveProperty('victimTeam', 'Team B');
    expect(killEvent).toHaveProperty('victimName', 'Player2');
    expect(killEvent).toHaveProperty('victimHero', 'Mercy');
    expect(killEvent).toHaveProperty('eventAbility', 'Scoped Shot');
    expect(killEvent).toHaveProperty('eventDamage', 200);
    expect(killEvent).toHaveProperty('isCriticalHit', true);
  });
});