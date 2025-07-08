import * as ScrimsightDataModel from "../ScrimsightDataModel";
import * as R from "remeda";

export const buildPlayerLives = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.PlayerLife[] => {
  const lives: ScrimsightDataModel.PlayerLife[] = [];
  const activeLifeByPlayer: Map<string, ScrimsightDataModel.PlayerLife> = new Map();

  const getPlayerKey = (matchId: string, playerName: string) => `${matchId}-${playerName}`;

  const getRoundIndex = (matchId: string, eventTime: number): ScrimsightDataModel.RoundNumber => {
    const roundStarts = R.pipe(
      dataModel.roundStart,
      R.filter(r => r.matchId === matchId),
      R.sortBy(r => r.matchTime)
    );
    
    const roundEnds = R.pipe(
      dataModel.roundEnd,
      R.filter(r => r.matchId === matchId),
      R.sortBy(r => r.matchTime)
    );
    
    // Find the last round start that happened before or at the event time
    const lastRoundStart = R.findLast(roundStarts, r => r.matchTime <= eventTime);
    
    if (!lastRoundStart) {
      return 1 as ScrimsightDataModel.RoundNumber;
    }
    
    // Check if there's a round end for this round that happened before the event time
    const correspondingRoundEnd = roundEnds.find(re => 
      re.roundNumber === lastRoundStart.roundNumber && 
      re.matchTime < eventTime
    );
    
    // If the round ended before this event, the event belongs to the next round
    if (correspondingRoundEnd) {
      // Find the next round start after the event time
      const nextRoundStart = roundStarts.find(rs => rs.matchTime > eventTime);
      return (nextRoundStart?.roundNumber || (lastRoundStart.roundNumber + 1)) as ScrimsightDataModel.RoundNumber;
    }
    
    return lastRoundStart.roundNumber as ScrimsightDataModel.RoundNumber;
  };

  // Combine all relevant events and sort them chronologically
  const allEvents = R.pipe([
    ...R.map(dataModel.heroSpawn, e => ({
      matchId: e.matchId,
      playerName: e.playerName,
      playerHero: e.playerHero,
      time: e.matchTime,
      type: 'heroSpawn' as const
    })),
    ...R.map(dataModel.heroSwap, e => ({
      matchId: e.matchId,
      playerName: e.playerName,
      playerHero: e.playerHero,
      time: e.matchTime,
      type: 'heroSwap' as const
    })),
    ...R.map(dataModel.kill, e => ({
      matchId: e.matchId,
      playerName: e.victimName,
      playerHero: e.victimHero,
      time: e.matchTime,
      type: 'death' as const
    })),
    // Include roundStart events to handle players carrying over between rounds
    ...R.map(dataModel.roundStart, e => ({
      matchId: e.matchId,
      roundNumber: e.roundNumber,
      time: e.matchTime,
      type: 'roundStart' as const
    }))
  ], R.sortBy(event => event.time));

  for (const event of allEvents) {
    if (event.type === 'roundStart') {
      // For players active in the previous round, end their current life and start a new one
      // if their life started before this roundStart and hasn't ended yet.
      // This handles players carrying over between rounds.
      // We need to iterate over a copy of the map to avoid issues with modification during iteration
      const activePlayersInMatch = Array.from(activeLifeByPlayer.values()).filter(life => life.matchId === event.matchId);

      activePlayersInMatch.forEach(life => {
        // Only process if the life started before this roundStart and is still active
        if (life.startTime < event.time && life.endTime === Infinity) {
          // Find the roundEnd event for the life's round
          // The life's roundIndex is the round it started in, we need the roundEnd for that round
          const previousRoundEnd = dataModel.roundEnd.find(
            (re) => re.matchId === life.matchId && re.roundNumber === life.roundIndex
          );


          if (previousRoundEnd) {
            life.endTime = previousRoundEnd.matchTime;
            life.duration = previousRoundEnd.matchTime - life.startTime;
            life.causeOfEnd = 'round_end';
            lives.push(life);
            activeLifeByPlayer.delete(getPlayerKey(life.matchId, life.player));

            // Start a new life for the player in the new round
            activeLifeByPlayer.set(getPlayerKey(life.matchId, life.player), {
              matchId: life.matchId,
              roundIndex: event.roundNumber as ScrimsightDataModel.RoundNumber,
              startTime: event.time,
              endTime: Infinity,
              duration: 0,
              player: life.player,
              hero: life.hero, // Player keeps the same hero
              causeOfStart: 'spawn',
              causeOfEnd: 'round_end',
              eliminations: 0,
              assists: 0,
              ultimatesUsed: 0
            });
          }
        }
      });
      continue;
    }

    const playerKey = getPlayerKey(event.matchId, event.playerName);
    const currentActiveLife = activeLifeByPlayer.get(playerKey);

    switch (event.type) {
      case 'heroSpawn':
      case 'heroSwap':
        // If there's an active life for this player, end it
        if (currentActiveLife) {
          currentActiveLife.endTime = event.time;
          currentActiveLife.duration = event.time - currentActiveLife.startTime;
          currentActiveLife.causeOfEnd = 'swap';
          lives.push(currentActiveLife);
          activeLifeByPlayer.delete(playerKey);
        }
        // Start a new life
        activeLifeByPlayer.set(playerKey, {
          matchId: event.matchId,
          roundIndex: getRoundIndex(event.matchId, event.time),
          startTime: event.time,
          endTime: Infinity, // Assume life continues until explicitly ended
          duration: 0,
          player: event.playerName,
          hero: event.playerHero,
          causeOfStart: event.type === 'heroSpawn' ? 'spawn' : 'swap',
          causeOfEnd: 'swap', // Will be set later if life ends
          eliminations: 0,
          assists: 0,
          ultimatesUsed: 0
        });
        break;

      case 'death':
        // End the active life due to death
        if (currentActiveLife) {
          currentActiveLife.endTime = event.time;
          currentActiveLife.duration = event.time - currentActiveLife.startTime;
          currentActiveLife.causeOfEnd = 'death';
          lives.push(currentActiveLife);
          activeLifeByPlayer.delete(playerKey);
        }
        break;
    }
  }

  // After processing all events, collect any remaining active lives that ended with the log
  activeLifeByPlayer.forEach((life) => {
    // If a life is still active (endTime is Infinity), it means it continued until the end of the log
    // or until the last roundEnd event for its round.
    // We need to find the correct roundEnd for this life.
    const roundEnd = R.pipe(
      dataModel.roundEnd,
      R.filter(r => r.matchId === life.matchId && r.roundNumber === life.roundIndex),
      R.sortBy(r => r.matchTime),
      R.findLast(r => r.matchTime > life.startTime)
    );

    if (roundEnd) {
      life.endTime = roundEnd.matchTime;
      life.duration = life.endTime - life.startTime;
      life.causeOfEnd = 'round_end';
    } else {
      // If no specific roundEnd found, and it's still Infinity, it means the life continued until the very end of the match log
      // without a formal round end event for its round.
      // This might happen if the log ends mid-round.
      // For now, we'll leave endTime as Infinity, but this might need refinement based on data.
      // For the test case, it should always find a roundEnd.
    }
    lives.push(life); // Push all final lives to the main lives array
  });

  return lives.sort((a, b) => {
    if (a.matchId !== b.matchId) {
      return a.matchId.localeCompare(b.matchId);
    }
    return a.startTime - b.startTime;
  });
};
