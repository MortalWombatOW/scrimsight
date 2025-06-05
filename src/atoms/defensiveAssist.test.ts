import { describe, it, expect } from 'vitest';
import { defensiveAssistFn } from '@atoms/defensiveAssist';
import type { LogFileParserAtomType, DefensiveAssistLogEvent, DefensiveAssistType } from '@atoms';

describe('defensiveAssistFn', () => {
  const createMockLogFileParserData = (
    matchId: string,
    defensiveAssistData: object[] = []
  ): LogFileParserAtomType => [
    {
      fileName: 'test-log.txt',
      matchId,
      logs: [
        {
          specName: 'defensive_assist',
          data: defensiveAssistData,
        },
      ],
      fileModified: Date.now(),
    },
  ];

  const createMockDefensiveAssistEvent = (
    overrides: Partial<DefensiveAssistLogEvent> = {}
  ): DefensiveAssistLogEvent => ({
    matchId: 'default-match',
    type: 'defensive_assist',
    matchTime: 100,
    playerTeam: 'Team A',
    playerName: 'Player1',
    playerHero: 'Ana',
    heroDuplicated: 'false',
    ...overrides,
  });

  it('should extract defensive assist events from parsed log files', async () => {
    const mockEvents = [
      createMockDefensiveAssistEvent({
        playerName: 'Player1',
        playerHero: 'Ana',
        matchTime: 100,
      }),
      createMockDefensiveAssistEvent({
        playerName: 'Player2',
        playerHero: 'Mercy',
        matchTime: 200,
      }),
    ];

    const parsedFiles = createMockLogFileParserData('match1', mockEvents);
    const result: DefensiveAssistType = await defensiveAssistFn(parsedFiles);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      ...mockEvents[0],
      matchId: 'match1',
    });
    expect(result[1]).toEqual({
      ...mockEvents[1],
      matchId: 'match1',
    });
  });

  it('should return empty array when no defensive assist events exist', async () => {
    const parsedFiles = createMockLogFileParserData('match1', []);
    const result = await defensiveAssistFn(parsedFiles);

    expect(result).toEqual([]);
  });

  it('should return empty array when defensive_assist spec is not found', async () => {
    const parsedFiles: LogFileParserAtomType = [
      {
        fileName: 'test-log.txt',
        matchId: 'match1',
        logs: [
          {
            specName: 'other_event_type',
            data: [{ some: 'data' }],
          },
        ],
        fileModified: Date.now(),
      },
    ];

    const result = await defensiveAssistFn(parsedFiles);
    expect(result).toEqual([]);
  });

  it('should handle multiple log files with defensive assist events', async () => {
    const events1 = [
      createMockDefensiveAssistEvent({
        playerName: 'Player1',
        playerHero: 'Ana',
        matchTime: 100,
      }),
    ];

    const events2 = [
      createMockDefensiveAssistEvent({
        playerName: 'Player2',
        playerHero: 'Mercy',
        matchTime: 200,
      }),
    ];

    const parsedFiles: LogFileParserAtomType = [
      {
        fileName: 'test-log1.txt',
        matchId: 'match1',
        logs: [{ specName: 'defensive_assist', data: events1 }],
        fileModified: Date.now(),
      },
      {
        fileName: 'test-log2.txt',
        matchId: 'match2',
        logs: [{ specName: 'defensive_assist', data: events2 }],
        fileModified: Date.now(),
      },
    ];

    const result = await defensiveAssistFn(parsedFiles);

    expect(result).toHaveLength(2);
    expect(result[0].matchId).toBe('match1');
    expect(result[0].playerName).toBe('Player1');
    expect(result[1].matchId).toBe('match2');
    expect(result[1].playerName).toBe('Player2');
  });

  it('should correctly assign matchId from file to events', async () => {
    const mockEvents = [
      createMockDefensiveAssistEvent({
        matchId: 'original-match-id', // This should be overridden
        playerName: 'Player1',
      }),
    ];

    const parsedFiles = createMockLogFileParserData('file-match-id', mockEvents);
    const result = await defensiveAssistFn(parsedFiles);

    expect(result).toHaveLength(1);
    expect(result[0].matchId).toBe('file-match-id');
  });

  it('should handle events with different hero types', async () => {
    const mockEvents = [
      createMockDefensiveAssistEvent({
        playerHero: 'Ana',
        playerName: 'Support1',
        matchTime: 100,
      }),
      createMockDefensiveAssistEvent({
        playerHero: 'Reinhardt',
        playerName: 'Tank1',
        matchTime: 150,
      }),
      createMockDefensiveAssistEvent({
        playerHero: 'Soldier: 76',
        playerName: 'DPS1',
        matchTime: 200,
      }),
    ];

    const parsedFiles = createMockLogFileParserData('match1', mockEvents);
    const result = await defensiveAssistFn(parsedFiles);

    expect(result).toHaveLength(3);
    expect(result.map(event => event.playerHero)).toEqual(['Ana', 'Reinhardt', 'Soldier: 76']);
  });

  it('should handle events with different team assignments', async () => {
    const mockEvents = [
      createMockDefensiveAssistEvent({
        playerTeam: 'Team A',
        playerName: 'Player1',
        matchTime: 100,
      }),
      createMockDefensiveAssistEvent({
        playerTeam: 'Team B',
        playerName: 'Player2',
        matchTime: 150,
      }),
    ];

    const parsedFiles = createMockLogFileParserData('match1', mockEvents);
    const result = await defensiveAssistFn(parsedFiles);

    expect(result).toHaveLength(2);
    expect(result[0].playerTeam).toBe('Team A');
    expect(result[1].playerTeam).toBe('Team B');
  });

  it('should handle events with heroDuplicated field variations', async () => {
    const mockEvents = [
      createMockDefensiveAssistEvent({
        heroDuplicated: 'true',
        playerName: 'Player1',
      }),
      createMockDefensiveAssistEvent({
        heroDuplicated: 'false',
        playerName: 'Player2',
      }),
    ];

    const parsedFiles = createMockLogFileParserData('match1', mockEvents);
    const result = await defensiveAssistFn(parsedFiles);

    expect(result).toHaveLength(2);
    expect(result[0].heroDuplicated).toBe('true');
    expect(result[1].heroDuplicated).toBe('false');
  });

  it('should handle events with various match times', async () => {
    const mockEvents = [
      createMockDefensiveAssistEvent({
        matchTime: 0,
        playerName: 'Player1',
      }),
      createMockDefensiveAssistEvent({
        matchTime: 999.999,
        playerName: 'Player2',
      }),
      createMockDefensiveAssistEvent({
        matchTime: 1234567890,
        playerName: 'Player3',
      }),
    ];

    const parsedFiles = createMockLogFileParserData('match1', mockEvents);
    const result = await defensiveAssistFn(parsedFiles);

    expect(result).toHaveLength(3);
    expect(result[0].matchTime).toBe(0);
    expect(result[1].matchTime).toBe(999.999);
    expect(result[2].matchTime).toBe(1234567890);
  });

  it('should handle empty parsedFiles array', async () => {
    const parsedFiles: LogFileParserAtomType = [];
    const result = await defensiveAssistFn(parsedFiles);

    expect(result).toEqual([]);
  });

  it('should handle files with empty logs array', async () => {
    const parsedFiles: LogFileParserAtomType = [
      {
        fileName: 'test-log.txt',
        matchId: 'match1',
        logs: [],
        fileModified: Date.now(),
      },
    ];

    const result = await defensiveAssistFn(parsedFiles);
    expect(result).toEqual([]);
  });

  it('should handle mixed files with and without defensive assist events', async () => {
    const eventsFile1 = [
      createMockDefensiveAssistEvent({
        playerName: 'Player1',
        matchTime: 100,
      }),
    ];

    const parsedFiles: LogFileParserAtomType = [
      {
        fileName: 'file-with-events.txt',
        matchId: 'match1',
        logs: [{ specName: 'defensive_assist', data: eventsFile1 }],
        fileModified: Date.now(),
      },
      {
        fileName: 'file-without-events.txt',
        matchId: 'match2',
        logs: [{ specName: 'other_event', data: [{ some: 'data' }] }],
        fileModified: Date.now(),
      },
      {
        fileName: 'file-with-empty-events.txt',
        matchId: 'match3',
        logs: [{ specName: 'defensive_assist', data: [] }],
        fileModified: Date.now(),
      },
    ];

    const result = await defensiveAssistFn(parsedFiles);

    expect(result).toHaveLength(1);
    expect(result[0].matchId).toBe('match1');
    expect(result[0].playerName).toBe('Player1');
  });

  it('should preserve all required DefensiveAssistLogEvent properties', async () => {
    const mockEvent = createMockDefensiveAssistEvent({
      type: 'defensive_assist',
      matchTime: 123.456,
      playerTeam: 'Blue Team',
      playerName: 'TestPlayer',
      playerHero: 'Ana',
      heroDuplicated: 'true',
    });

    const parsedFiles = createMockLogFileParserData('test-match', [mockEvent]);
    const result = await defensiveAssistFn(parsedFiles);

    expect(result).toHaveLength(1);
    const event = result[0];

    // Check all required properties are present and correctly assigned
    expect(event.matchId).toBe('test-match');
    expect(event.type).toBe('defensive_assist');
    expect(event.matchTime).toBe(123.456);
    expect(event.playerTeam).toBe('Blue Team');
    expect(event.playerName).toBe('TestPlayer');
    expect(event.playerHero).toBe('Ana');
    expect(event.heroDuplicated).toBe('true');
  });

  it('should handle events with special characters in player names and teams', async () => {
    const mockEvents = [
      createMockDefensiveAssistEvent({
        playerName: 'Player-With_Special.Characters',
        playerTeam: 'Team [A]',
        playerHero: 'D.Va',
      }),
      createMockDefensiveAssistEvent({
        playerName: 'Player@#$%',
        playerTeam: 'Team (B)',
        playerHero: 'Soldier: 76',
      }),
    ];

    const parsedFiles = createMockLogFileParserData('match1', mockEvents);
    const result = await defensiveAssistFn(parsedFiles);

    expect(result).toHaveLength(2);
    expect(result[0].playerName).toBe('Player-With_Special.Characters');
    expect(result[0].playerTeam).toBe('Team [A]');
    expect(result[0].playerHero).toBe('D.Va');
    expect(result[1].playerName).toBe('Player@#$%');
    expect(result[1].playerTeam).toBe('Team (B)');
    expect(result[1].playerHero).toBe('Soldier: 76');
  });
});