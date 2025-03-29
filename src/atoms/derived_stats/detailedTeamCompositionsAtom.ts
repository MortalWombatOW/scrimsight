import { atom } from 'jotai'; // Import atom
import { atomFamily } from 'jotai/utils';
import { Getter } from 'jotai';
import { matchDataAtom } from '../matchDataAtom';
import { heroSpawnExtractorAtom, type HeroSpawnLogEvent } from '../event_extractors/heroSpawnExtractorAtom';
import { heroSwapExtractorAtom, type HeroSwapLogEvent } from '../event_extractors/heroSwapExtractorAtom';
import { mapTimesAtom } from '../mapTimesAtom';

type HeroEvent = HeroSpawnLogEvent | HeroSwapLogEvent;

// Define the output shape
export interface DetailedComposition {
  composition: string[]; // Sorted list of hero names
  playtimeSeconds: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number; // Calculated as wins / (wins + losses)
  frequency: number; // Number of distinct matches the composition appeared in
}

// Intermediate structure for aggregation
interface AggregatedCompStats {
  compositionKey: string; // Comma-separated sorted heroes
  heroes: string[];
  playtimeSeconds: number;
  wins: number;
  losses: number;
  draws: number;
  matchesSeen: Set<string>; // Track distinct matches
}

export const detailedTeamCompositionsAtom = atomFamily((teamId: string) =>
  atom(async (get: Getter): Promise<DetailedComposition[]> => {
    const [allMatches, heroSpawns, heroSwaps, mapTimes] = await Promise.all([
      get(matchDataAtom),
      get(heroSpawnExtractorAtom),
      get(heroSwapExtractorAtom),
      get(mapTimesAtom),
    ]);

    // 1. Create Match Result Lookup
    const matchResults = new Map<string, 'win' | 'loss' | 'draw'>();
    for (const match of allMatches) {
      if (match.team1Name === teamId || match.team2Name === teamId) {
        const isTeam1 = match.team1Name === teamId;
        const teamScore = isTeam1 ? match.team1Score : match.team2Score;
        const opposingScore = isTeam1 ? match.team2Score : match.team1Score;
        const result = teamScore > opposingScore ? 'win' : teamScore < opposingScore ? 'loss' : 'draw';
        matchResults.set(match.matchId, result);
      }
    }

    // 2. Filter and Group Events by Match for the specific team
    const teamEvents = [...heroSpawns, ...heroSwaps].filter(
      (event) => event.playerTeam === teamId
    );
    const eventsByMatch = new Map<string, HeroEvent[]>();
    for (const event of teamEvents) {
      const matchEvents = eventsByMatch.get(event.matchId) || [];
      matchEvents.push(event);
      eventsByMatch.set(event.matchId, matchEvents);
    }

    // 3. Process Events per Match and Aggregate Stats
    const aggregatedComps = new Map<string, AggregatedCompStats>();

    for (const [matchId, events] of eventsByMatch) {
      const matchTime = mapTimes.find((mt) => mt.matchId === matchId);
      const matchResult = matchResults.get(matchId);
      if (!matchTime || !matchResult) continue; // Skip if match time or result is missing

      const playerHeroes = new Map<string, string>();
      let currentCompositionHeroes: string[] = [];
      let compositionStart = matchTime.startTime;

      // Sort events chronologically
      const sortedEvents = events.sort((a, b) => a.matchTime - b.matchTime);

      for (const event of sortedEvents) {
        // Update player's current hero
        playerHeroes.set(event.playerName, event.playerHero);

        // Get sorted hero list for current composition
        const newCompositionHeroes = Array.from(playerHeroes.values()).sort();

        // Skip if composition hasn't changed
        if (
          newCompositionHeroes.join(',') === currentCompositionHeroes.join(',')
        ) continue;

        // Calculate duration and update stats for the *previous* composition if it was valid (5 players)
        if (currentCompositionHeroes.length === 5) {
          const duration = event.matchTime - compositionStart;
          if (duration > 0) { // Only record if duration is positive
            const compositionKey = currentCompositionHeroes.join(',');
            let stats = aggregatedComps.get(compositionKey);
            if (!stats) {
              stats = {
                compositionKey,
                heroes: [...currentCompositionHeroes],
                playtimeSeconds: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                matchesSeen: new Set(),
              };
              aggregatedComps.set(compositionKey, stats);
            }
            stats.playtimeSeconds += duration;
            stats.matchesSeen.add(matchId); // Track match occurrence
            // Increment result count
            if (matchResult === 'win') stats.wins++;
            else if (matchResult === 'loss') stats.losses++;
            else stats.draws++;
          }
        }

        // Update tracking variables for the new composition
        currentCompositionHeroes = newCompositionHeroes;
        compositionStart = event.matchTime;
      }

      // Add final composition duration for the match
      if (currentCompositionHeroes.length === 5) {
        const duration = matchTime.endTime - compositionStart;
         if (duration > 0) {
            const compositionKey = currentCompositionHeroes.join(',');
            let stats = aggregatedComps.get(compositionKey);
             if (!stats) {
               stats = {
                 compositionKey,
                 heroes: [...currentCompositionHeroes],
                 playtimeSeconds: 0,
                 wins: 0,
                 losses: 0,
                 draws: 0,
                 matchesSeen: new Set(),
               };
               aggregatedComps.set(compositionKey, stats);
             }
            stats.playtimeSeconds += duration;
            stats.matchesSeen.add(matchId);
            if (matchResult === 'win') stats.wins++;
            else if (matchResult === 'loss') stats.losses++;
            else stats.draws++;
         }
      }
    }

    // 4. Calculate Final Win Rates and Frequency
    const finalDetailedComps: DetailedComposition[] = [];
    for (const stats of aggregatedComps.values()) {
      const gamesPlayed = stats.wins + stats.losses; // Exclude draws for win rate calculation
      const winRate = gamesPlayed > 0 ? (stats.wins / gamesPlayed) * 100 : 0;
      finalDetailedComps.push({
        composition: stats.heroes,
        playtimeSeconds: stats.playtimeSeconds,
        wins: stats.wins,
        losses: stats.losses,
        draws: stats.draws,
        winRate: isNaN(winRate) ? 0 : winRate,
        frequency: stats.matchesSeen.size, // Frequency is the count of distinct matches
      });
    }

    // Optional: Sort final results, e.g., by playtime
    finalDetailedComps.sort((a, b) => b.playtimeSeconds - a.playtimeSeconds);

    return finalDetailedComps;
  })
);
