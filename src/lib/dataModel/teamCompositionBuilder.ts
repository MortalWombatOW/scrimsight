
import * as ScrimsightDataModel from "../ScrimsightDataModel";
import { getRoleFromHero } from "../hero";
import * as R from "remeda";

const getRoundIndexForTime = (dataModel: ScrimsightDataModel.ScrimsightDataModel, matchId: string, time: number): ScrimsightDataModel.RoundNumber => {
  const roundStarts = R.pipe(
    dataModel.roundStart,
    R.filter(r => r.matchId === matchId),
    R.sortBy(r => r.matchTime)
  );
  
  const activeRound = R.findLast(roundStarts, r => r.matchTime <= time);
  return (activeRound?.roundNumber || 1) as ScrimsightDataModel.RoundNumber;
};

const createCompositionSegment = (
  matchId: string,
  roundIndex: ScrimsightDataModel.RoundNumber,
  teamName: string,
  startTime: number,
  endTime: number,
  playerHeroPairs: [string, ScrimsightDataModel.Hero][]
): ScrimsightDataModel.TeamCompositionSegment => {
  const playerHeroes = playerHeroPairs.map(([playerName, playerHero]) => ({
    playerName,
    playerHero
  }));

  // Group heroes by role
  const heroesByRole = R.pipe(
    playerHeroes,
    R.groupBy(ph => getRoleFromHero(ph.playerHero)),
    R.entries(),
    R.map(([role, phs]) => ({
      role: role as ScrimsightDataModel.Role,
      heroes: phs.map(ph => ph.playerHero)
    }))
  );

  // Create composition object
  const composition: ScrimsightDataModel.TeamComposition = {
    tank: heroesByRole.find(h => h.role === 'tank')?.heroes || [],
    damage: heroesByRole.find(h => h.role === 'damage')?.heroes || [],
    support: heroesByRole.find(h => h.role === 'support')?.heroes || []
  };

  return {
    matchId,
    roundIndex,
    startTime,
    endTime,
    duration: endTime - startTime,
    team: teamName,
    composition,
    playerHeroes,
    heroesByRole
  };
};

export const buildTeamCompositions = (dataModel: ScrimsightDataModel.ScrimsightDataModel): ScrimsightDataModel.TeamCompositionSegment[] => {
  const compositions: ScrimsightDataModel.TeamCompositionSegment[] = [];

  // Process each match to track team compositions over time
  dataModel.matches.forEach(match => {
    const matchId = match.match;
    const teams = match.teams;

    teams.forEach(teamName => {
      // Find all hero spawn and swap events for this team in this match
      const heroEvents = [
        ...R.pipe(
          dataModel.heroSpawn,
          R.filter(e => e.matchId === matchId && e.playerTeam === teamName),
          R.map(e => ({ ...e, type: 'spawn' as const }))
        ),
        ...R.pipe(
          dataModel.heroSwap,
          R.filter(e => e.matchId === matchId && e.playerTeam === teamName),
          R.map(e => ({ ...e, type: 'swap' as const }))
        )
      ].sort((a, b) => a.matchTime - b.matchTime);

      // Group events by round
      const eventsByRound = R.groupBy(heroEvents, e => getRoundIndexForTime(dataModel, matchId, e.matchTime));

      // Process each round
      Object.entries(eventsByRound).forEach(([roundStr, roundEvents]) => {
        const roundNumber = parseInt(roundStr) as ScrimsightDataModel.RoundNumber;
        
        // Find round boundaries
        const roundStart = dataModel.roundStart.find(r => 
          r.matchId === matchId && r.roundNumber === roundNumber
        );
        const roundEnd = dataModel.roundEnd.find(r => 
          r.matchId === matchId && r.roundNumber === roundNumber
        );

        if (!roundStart || !roundEnd) return;

        // Track composition changes throughout the round
        let currentTime = roundStart.matchTime;
        const activeComposition = new Map<string, ScrimsightDataModel.Hero>(); // player -> hero

        // Initialize with spawn events at round start
        const initialSpawns = roundEvents.filter(e => e.type === 'spawn');
        initialSpawns.forEach(spawn => {
          activeComposition.set(spawn.playerName, spawn.playerHero);
        });

        // Process each composition change
        const compositionChanges = roundEvents.filter(e => e.type === 'swap');
        
        // Create composition segment for initial state
        if (activeComposition.size > 0) {
          const endTime = compositionChanges.length > 0 ? compositionChanges[0].matchTime : roundEnd.matchTime;
          // Only create segment if there's actual duration (avoid zero-duration segments)
          if (endTime > currentTime) {
            const compositionSegment = createCompositionSegment(
              matchId, 
              roundNumber, 
              teamName, 
              currentTime, 
              endTime, 
              Array.from(activeComposition.entries())
            );
            compositions.push(compositionSegment);
          }
          currentTime = endTime;
        }

        // Process each swap event
        compositionChanges.forEach((swapEvent, index) => {
          // Update composition
          activeComposition.set(swapEvent.playerName, swapEvent.playerHero);
          
          // Determine end time for this segment
          const nextSwap = compositionChanges[index + 1];
          const endTime = nextSwap ? nextSwap.matchTime : roundEnd.matchTime;
          
          // Only create segment if there's actual duration (avoid zero-duration segments)
          if (endTime > swapEvent.matchTime) {
            const compositionSegment = createCompositionSegment(
              matchId, 
              roundNumber, 
              teamName, 
              swapEvent.matchTime, 
              endTime, 
              Array.from(activeComposition.entries())
            );
            compositions.push(compositionSegment);
          }
          currentTime = endTime;
        });
      });
    });
  });

  return compositions.sort((a, b) => {
    if (a.matchId !== b.matchId) return a.matchId.localeCompare(b.matchId);
    if (a.roundIndex !== b.roundIndex) return a.roundIndex - b.roundIndex;
    return a.startTime - b.startTime;
  });
};