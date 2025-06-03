import { atom } from 'jotai'; // Import atom
import { atomFamily } from 'jotai/utils';
import { Getter } from 'jotai';
import { matchData } from '@atoms';
import { heroSpawn } from '@atoms';
import { HeroSpawnLogEvent, DetailedComposition, CompositionMatchup } from '@atoms'; // Type import from index
import { heroSwap } from '@atoms';
import { HeroSwapLogEvent } from '@atoms';   // Type import from index
import { mapTimes } from '@atoms';

type HeroEvent = HeroSpawnLogEvent | HeroSwapLogEvent;

// Intermediate structure for aggregation
interface AggregatedMatchupStats { // Renamed and adjusted for matchups
  opponentCompositionKey: string;
  opponentHeroes: string[];
  playtimeSecondsAgainst: number;
  winsAgainst: number;
  lossesAgainst: number;
  drawsAgainst: number;
}

interface AggregatedCompStats {
  compositionKey: string; // Comma-separated sorted heroes
  heroes: string[];
  playtimeSeconds: number; // Total playtime for this friendly comp
  wins: number; // Overall wins attributed to this comp (match-based)
  losses: number; // Overall losses attributed to this comp (match-based)
  draws: number; // Overall draws attributed to this comp (match-based)
  matchesSeen: Set<string>; // Track distinct matches this friendly comp appeared in
  matchups: Map<string, AggregatedMatchupStats>; // Key: opponent comp key
}

export const detailedTeamCompositionsAtom = atomFamily((friendlyTeamId: string) => // Renamed param for clarity
  atom(async (get: Getter): Promise<DetailedComposition[]> => {
    const [allMatches, heroSpawns, heroSwaps, allMapTimes] = await Promise.all([
      get(matchData.atom),
      get(heroSpawn.atom),
      get(heroSwap.atom),
      get(mapTimes.atom),
    ]);

    // 1. Create Match Result Lookup & Identify Opponent Team
    const matchResults = new Map<string, { result: 'win' | 'loss' | 'draw'; opponentTeamId: string | null }>();
    for (const match of allMatches) {
      let opponentTeamId: string | null = null;
      if (match.team1Name === friendlyTeamId) {
        opponentTeamId = match.team2Name;
      } else if (match.team2Name === friendlyTeamId) {
        opponentTeamId = match.team1Name;
      } else {
        continue; // Skip matches not involving the friendlyTeamId
      }

      const isTeam1 = match.team1Name === friendlyTeamId;
      const teamScore = isTeam1 ? match.team1Score : match.team2Score;
      const opposingScore = isTeam1 ? match.team2Score : match.team1Score;
      const result: 'win' | 'loss' | 'draw' = teamScore > opposingScore ? 'win' : teamScore < opposingScore ? 'loss' : 'draw';
      matchResults.set(match.matchId, { result, opponentTeamId });
    }

    // 2. Filter and Group Events by Match for BOTH teams
    const allTeamEvents = [...heroSpawns, ...heroSwaps];
    const eventsByMatch = new Map<string, { friendly: HeroEvent[]; opponent: HeroEvent[] }>();

    for (const event of allTeamEvents) {
      const matchInfo = matchResults.get(event.matchId);
      if (!matchInfo) continue; // Skip events from matches not involving the friendly team

      let matchEventGroups = eventsByMatch.get(event.matchId);
      if (!matchEventGroups) {
        matchEventGroups = { friendly: [], opponent: [] };
        eventsByMatch.set(event.matchId, matchEventGroups);
      }

      if (event.playerTeam === friendlyTeamId) {
        matchEventGroups.friendly.push(event);
      } else if (event.playerTeam === matchInfo.opponentTeamId) {
        matchEventGroups.opponent.push(event);
      }
    }


    // 3. Process Events per Match and Aggregate Stats
    const aggregatedComps = new Map<string, AggregatedCompStats>();

    // Iterate through matches that involve the friendly team
    for (const [matchId, matchEventGroups] of eventsByMatch) {
      const matchTime = allMapTimes.find((mt) => mt.matchId === matchId);
      const matchInfo = matchResults.get(matchId);
      // Ensure matchTime and matchInfo (including opponentTeamId) are valid
      if (!matchTime || !matchInfo || !matchInfo.opponentTeamId) continue;
      const matchResult = matchInfo.result;

      // --- State Tracking for Both Teams ---
      const friendlyPlayerHeroes = new Map<string, string>();
      const opponentPlayerHeroes = new Map<string, string>();
      let currentFriendlyCompHeroes: string[] = [];
      let currentOpponentCompHeroes: string[] = [];
      let segmentStartTime = matchTime.startTime;

      // Combine and sort all events for this match chronologically
      const allSortedEvents = [...matchEventGroups.friendly, ...matchEventGroups.opponent].sort(
        (a, b) => a.matchTime - b.matchTime
      );

      // --- Iterate through combined events ---
      for (const event of allSortedEvents) {
        const isFriendlyEvent = event.playerTeam === friendlyTeamId;
        const playerHeroesMap = isFriendlyEvent ? friendlyPlayerHeroes : opponentPlayerHeroes;

        // Update the relevant player hero map
        playerHeroesMap.set(event.playerName, event.playerHero);

        // Get new sorted hero lists
        const newFriendlyCompHeroes = Array.from(friendlyPlayerHeroes.values()).sort();
        const newOpponentCompHeroes = Array.from(opponentPlayerHeroes.values()).sort();

        // Check if either composition changed significantly
        const friendlyCompChanged = newFriendlyCompHeroes.join(',') !== currentFriendlyCompHeroes.join(',');
        const opponentCompChanged = newOpponentCompHeroes.join(',') !== currentOpponentCompHeroes.join(',');

        // If neither comp changed, continue
        if (!friendlyCompChanged && !opponentCompChanged) continue;

        // --- Calculate duration and update stats for the *previous* segment ---
        // Both compositions must have been valid (5 players) during the previous segment
        if (currentFriendlyCompHeroes.length === 5 && currentOpponentCompHeroes.length === 5) {
          const duration = event.matchTime - segmentStartTime;
          if (duration > 0) {
            const friendlyCompKey = currentFriendlyCompHeroes.join(',');
            const opponentCompKey = currentOpponentCompHeroes.join(',');

            // Get or initialize friendly composition stats
            let friendlyStats = aggregatedComps.get(friendlyCompKey);
            if (!friendlyStats) {
              friendlyStats = {
                compositionKey: friendlyCompKey,
                heroes: [...currentFriendlyCompHeroes],
                playtimeSeconds: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                matchesSeen: new Set(),
                matchups: new Map(), // Initialize matchups map
              };
              aggregatedComps.set(friendlyCompKey, friendlyStats);
            }

            // Update overall friendly comp playtime
            friendlyStats.playtimeSeconds += duration;

            // Get or initialize matchup stats within the friendly composition
            let matchupStats = friendlyStats.matchups.get(opponentCompKey);
            if (!matchupStats) {
              matchupStats = {
                opponentCompositionKey: opponentCompKey,
                opponentHeroes: [...currentOpponentCompHeroes],
                playtimeSecondsAgainst: 0,
                winsAgainst: 0,
                lossesAgainst: 0,
                drawsAgainst: 0,
              };
              friendlyStats.matchups.set(opponentCompKey, matchupStats);
            }

            // Update matchup-specific stats
            matchupStats.playtimeSecondsAgainst += duration;
            // Increment matchup result based on *match* outcome (approximation)
            if (matchResult === 'win') matchupStats.winsAgainst++;
            else if (matchResult === 'loss') matchupStats.lossesAgainst++;
            else matchupStats.drawsAgainst++;

            // Update overall friendly comp wins/losses/draws based on match outcome
            // only if this is the first time seeing this match for this comp
            const seenMatchBefore = friendlyStats.matchesSeen.has(matchId);
            friendlyStats.matchesSeen.add(matchId); // Add match ID *after* checking
            if (!seenMatchBefore) {
              if (matchResult === 'win') friendlyStats.wins++;
              else if (matchResult === 'loss') friendlyStats.losses++;
              else friendlyStats.draws++;
            }
          }
        }

        // Update tracking variables for the new segment
        currentFriendlyCompHeroes = newFriendlyCompHeroes;
        currentOpponentCompHeroes = newOpponentCompHeroes;
        segmentStartTime = event.matchTime;
      }

      // --- Add final segment duration for the match ---
      if (currentFriendlyCompHeroes.length === 5 && currentOpponentCompHeroes.length === 5) {
        const duration = matchTime.endTime - segmentStartTime;
        if (duration > 0) {
          const friendlyCompKey = currentFriendlyCompHeroes.join(',');
          const opponentCompKey = currentOpponentCompHeroes.join(',');

          let friendlyStats = aggregatedComps.get(friendlyCompKey);
          if (!friendlyStats) {
            friendlyStats = {
              compositionKey: friendlyCompKey,
              heroes: [...currentFriendlyCompHeroes],
              playtimeSeconds: 0,
              wins: 0,
              losses: 0,
              draws: 0,
              matchesSeen: new Set(),
              matchups: new Map(),
            };
            aggregatedComps.set(friendlyCompKey, friendlyStats);
          }

          friendlyStats.playtimeSeconds += duration;

          let matchupStats = friendlyStats.matchups.get(opponentCompKey);
          if (!matchupStats) {
            matchupStats = {
              opponentCompositionKey: opponentCompKey,
              opponentHeroes: [...currentOpponentCompHeroes],
              playtimeSecondsAgainst: 0,
              winsAgainst: 0,
              lossesAgainst: 0,
              drawsAgainst: 0,
            };
            friendlyStats.matchups.set(opponentCompKey, matchupStats);
          }

          matchupStats.playtimeSecondsAgainst += duration;
          if (matchResult === 'win') matchupStats.winsAgainst++;
          else if (matchResult === 'loss') matchupStats.lossesAgainst++;
          else matchupStats.drawsAgainst++;

          const seenMatchBefore = friendlyStats.matchesSeen.has(matchId);
          friendlyStats.matchesSeen.add(matchId); // Add match regardless
          if (!seenMatchBefore) {
            if (matchResult === 'win') friendlyStats.wins++;
            else if (matchResult === 'loss') friendlyStats.losses++;
            else friendlyStats.draws++;
          }
        }
      }
    }


    // 4. Calculate Final Win Rates and Format Output
    const finalDetailedComps: DetailedComposition[] = [];
    for (const friendlyStats of aggregatedComps.values()) {
      // Calculate overall win rate for the friendly composition
      const overallGamesPlayed = friendlyStats.wins + friendlyStats.losses;
      const overallWinRate = overallGamesPlayed > 0 ? (friendlyStats.wins / overallGamesPlayed) * 100 : 0;

      // Process matchups
      const finalMatchups: CompositionMatchup[] = [];
      for (const matchupStats of friendlyStats.matchups.values()) {
        const matchupGamesPlayed = matchupStats.winsAgainst + matchupStats.lossesAgainst;
        const matchupWinRate = matchupGamesPlayed > 0 ? (matchupStats.winsAgainst / matchupGamesPlayed) * 100 : 0;
        finalMatchups.push({
          opponentComposition: matchupStats.opponentHeroes,
          playtimeSecondsAgainst: matchupStats.playtimeSecondsAgainst,
          winsAgainst: matchupStats.winsAgainst,
          lossesAgainst: matchupStats.lossesAgainst,
          drawsAgainst: matchupStats.drawsAgainst,
          winRateAgainst: isNaN(matchupWinRate) ? 0 : matchupWinRate,
        });
      }
      // Sort matchups, e.g., by playtime against
      finalMatchups.sort((a, b) => b.playtimeSecondsAgainst - a.playtimeSecondsAgainst);


      finalDetailedComps.push({
        composition: friendlyStats.heroes,
        playtimeSeconds: friendlyStats.playtimeSeconds,
        wins: friendlyStats.wins,
        losses: friendlyStats.losses,
        draws: friendlyStats.draws,
        winRate: isNaN(overallWinRate) ? 0 : overallWinRate,
        frequency: friendlyStats.matchesSeen.size,
        matchups: finalMatchups, // Add the processed matchups
      });
    }

    // Optional: Sort final results, e.g., by playtime
    finalDetailedComps.sort((a, b) => b.playtimeSeconds - a.playtimeSeconds);

    return finalDetailedComps;
  })
);
