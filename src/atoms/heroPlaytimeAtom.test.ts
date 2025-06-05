import { describe, it, expect } from 'vitest';
import { heroPlaytimeAtomFn } from '@atoms/heroPlaytimeAtom';
import type { PlayerEventForPlaytime, RoundTimes } from '@atoms';

describe('heroPlaytimeAtomFn', () => {
  const mockRoundTimes: RoundTimes[] = [
    {
      matchId: 'match1',
      roundNumber: 1,
      roundStartTime: 100,
      roundSetupCompleteTime: 120,
      roundEndTime: 200,
    },
    {
      matchId: 'match1',
      roundNumber: 2,
      roundStartTime: 300,
      roundSetupCompleteTime: 320,
      roundEndTime: 400,
    }
  ];

  const mockPlayerEvents: PlayerEventForPlaytime[] = [
    {
      matchId: 'match1',
      playerName: 'Player1',
      playerHero: 'Ana',
      playerEventType: 'heroSpawn',
      playerEventTime: 125,
      matchTime: 125,
    },
    {
      matchId: 'match1',
      playerName: 'Player1',
      playerHero: 'Mercy',
      playerEventType: 'heroSwap',
      playerEventTime: 150,
      matchTime: 150,
    },
    {
      matchId: 'match1',
      playerName: 'Player2',
      playerHero: 'Reinhardt',
      playerEventType: 'heroSpawn',
      playerEventTime: 325,
      matchTime: 325,
    }
  ];

  it('should calculate playtime for each hero correctly', () => {
    const result = heroPlaytimeAtomFn(mockPlayerEvents, mockRoundTimes);
    
    expect(result.categoryKeys).toEqual(['playerName', 'matchId', 'roundNumber', 'hero']);
    expect(result.numericalKeys).toEqual(['playtime']);
    expect(result.rows).toHaveLength(3);
    
    // Find specific playtime entries
    const anaPlaytime = result.rows.find(row => 
      row.playerName === 'Player1' && row.hero === 'Ana' && row.roundNumber === 1
    );
    const mercyPlaytime = result.rows.find(row => 
      row.playerName === 'Player1' && row.hero === 'Mercy' && row.roundNumber === 1
    );
    const reinhardtPlaytime = result.rows.find(row => 
      row.playerName === 'Player2' && row.hero === 'Reinhardt' && row.roundNumber === 2
    );
    
    expect(anaPlaytime?.playtime).toBe(25); // 150 - 125
    expect(mercyPlaytime?.playtime).toBe(50); // 200 - 150
    expect(reinhardtPlaytime?.playtime).toBe(75); // 400 - 325
  });

  it('should handle empty player events', () => {
    const result = heroPlaytimeAtomFn([], mockRoundTimes);
    
    expect(result.categoryKeys).toEqual(['playerName', 'matchId', 'roundNumber', 'hero']);
    expect(result.numericalKeys).toEqual(['playtime']);
    expect(result.rows).toHaveLength(0);
  });

  it('should handle empty round times', () => {
    const result = heroPlaytimeAtomFn(mockPlayerEvents, []);
    
    expect(result.categoryKeys).toEqual(['playerName', 'matchId', 'roundNumber', 'hero']);
    expect(result.numericalKeys).toEqual(['playtime']);
    expect(result.rows).toHaveLength(0);
  });

  it('should skip events outside of known rounds', () => {
    const eventsOutsideRounds: PlayerEventForPlaytime[] = [
      {
        matchId: 'match1',
        playerName: 'Player1',
        playerHero: 'Ana',
        playerEventType: 'heroSpawn',
        playerEventTime: 50, // Before round start
        matchTime: 50,
      },
      {
        matchId: 'match1',
        playerName: 'Player1',
        playerHero: 'Mercy',
        playerEventType: 'heroSwap',
        playerEventTime: 500, // After round end
        matchTime: 500,
      }
    ];

    const result = heroPlaytimeAtomFn(eventsOutsideRounds, mockRoundTimes);
    expect(result.rows).toHaveLength(0);
  });

  it('should handle multiple hero swaps in same round', () => {
    const multipleSwapEvents: PlayerEventForPlaytime[] = [
      {
        matchId: 'match1',
        playerName: 'Player1',
        playerHero: 'Ana',
        playerEventType: 'heroSpawn',
        playerEventTime: 125,
        matchTime: 125,
      },
      {
        matchId: 'match1',
        playerName: 'Player1',
        playerHero: 'Mercy',
        playerEventType: 'heroSwap',
        playerEventTime: 150,
        matchTime: 150,
      },
      {
        matchId: 'match1',
        playerName: 'Player1',
        playerHero: 'Genji',
        playerEventType: 'heroSwap',
        playerEventTime: 175,
        matchTime: 175,
      }
    ];

    const result = heroPlaytimeAtomFn(multipleSwapEvents, mockRoundTimes);
    
    const anaPlaytime = result.rows.find(row => row.hero === 'Ana');
    const mercyPlaytime = result.rows.find(row => row.hero === 'Mercy');
    const genjiPlaytime = result.rows.find(row => row.hero === 'Genji');
    
    expect(anaPlaytime?.playtime).toBe(25); // 150 - 125
    expect(mercyPlaytime?.playtime).toBe(25); // 175 - 150
    expect(genjiPlaytime?.playtime).toBe(25); // 200 - 175
  });
});