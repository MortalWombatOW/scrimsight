import { atom } from "jotai";
import {
  playerEvents,
  playerInteractionEvents,
  roundTimes,
  PlayerLife,
  PlayerInteractionEvent,
  RoundTimesType,
  PlayerEventForLives,
} from '@atoms';

export const playerLivesAtomFn = (
  playerInteractionEventsData: PlayerInteractionEvent[],
  playerEventsData: PlayerEventForLives[],
  roundTimesData: RoundTimesType
): PlayerLife[] => {
  const lives: PlayerLife[] = [];
  const activeLifeByPlayer: Map<string, PlayerLife> = new Map();

  // Helper function to create a unique player key
  const getPlayerKey = (matchId: string, playerName: string) => `${matchId}-${playerName}`;

  // Helper function to end a player's current life
  const endPlayerLife = (matchId: string, playerName: string, endTime: number) => {
    const playerKey = getPlayerKey(matchId, playerName);
    const currentLife = activeLifeByPlayer.get(playerKey);
    if (currentLife) {
      currentLife.endTime = endTime;
      lives.push(currentLife);
      activeLifeByPlayer.delete(playerKey);
    }
  };

  // Process all events in chronological order
  const allEvents = [
    ...playerEventsData.map((e: PlayerEventForLives) => ({
      ...e,
      time: e.playerEventTime || e.matchTime,
      type: e.playerEventType || e.eventType,
    })),
    ...playerInteractionEventsData
      .filter(e => e.playerInteractionEventType === 'Died' && e.direction === 'incoming')
      .map(e => ({
        matchId: e.matchId,
        playerName: e.playerName,
        playerHero: e.playerHero,
        time: e.playerInteractionEventTime,
        type: 'death',
      }))
  ].sort((a, b) => a.time - b.time);

  // Process each event
  for (const event of allEvents) {
    const playerKey = getPlayerKey(event.matchId, event.playerName);

    switch (event.type) {
      case 'heroSpawn':
        // End any existing life
        endPlayerLife(event.matchId, event.playerName, event.time);
        // Start a new life
        activeLifeByPlayer.set(playerKey, {
          matchId: event.matchId,
          playerName: event.playerName,
          playerHero: event.playerHero,
          startTime: event.time,
          endTime: Infinity, // Will be updated when the life ends
        });
        break;

      case 'heroSwap':
        // End current life and start a new one with the new hero
        endPlayerLife(event.matchId, event.playerName, event.time);
        activeLifeByPlayer.set(playerKey, {
          matchId: event.matchId,
          playerName: event.playerName,
          playerHero: event.playerHero,
          startTime: event.time,
          endTime: Infinity,
        });
        break;

      case 'death':
        // End the current life
        endPlayerLife(event.matchId, event.playerName, event.time);
        break;
    }
  }

  // End any remaining active lives at their round end times
  for (const [_, life] of activeLifeByPlayer.entries()) {
    const roundEnd = roundTimesData
      .filter((r) => r.matchId === life.matchId)
      .sort((a, b) => b.roundEndTime - a.roundEndTime)
      .find((r) => r.roundEndTime > life.startTime);

    if (roundEnd) {
      life.endTime = roundEnd.roundEndTime;
      lives.push(life);
    }
  }

  return lives.sort((a, b) => 
    a.matchId !== b.matchId 
      ? a.matchId.localeCompare(b.matchId)
      : a.startTime - b.startTime
  );
};

export default atom(async (get): Promise<PlayerLife[]> => {
  const playerInteractionEventsData = await get(playerInteractionEvents.atom);
  const playerEventsData: PlayerEventForLives[] = await get(playerEvents.atom);
  const roundTimesData = await get(roundTimes.atom);

  return playerLivesAtomFn(playerInteractionEventsData, playerEventsData, roundTimesData);
});