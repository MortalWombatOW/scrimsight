import { atomFamily } from 'jotai/utils';
import { atom } from 'jotai';
import {
  PlayerStats,
  PlayerStatsNumericalKeys,
  MatchData,
  Scrim,
  PlayerMatchParams,
  TeamMatchParams,
  PlayerScrimParams,
  TeamScrimParams,
  PlayerTeamParams,
  MatchScrimParams,
} from '@atoms';
import { getStatsAtom, Grouped, Metric } from '@library';
import { scrims, matchData } from '@atoms';

export const contextualStatAtomsFn = () => {
  // Player Stats for Match
  const playerStatsForMatchAtom = atomFamily(
    (params: PlayerMatchParams) =>
      atom(async (get) => {
      // Use getStatsAtom (or replicate logic) with filters
      // Note: getStatsAtom needs to be accessible here, might need export or refactor
        const statsAtom = getStatsAtom(
          ['matchId', 'playerName', 'playerHero'], // Added matchId to groupBy
          {
            matchId: [params.matchId],
            playerName: [params.playerId],
          }
        );
        // Explicitly type the resolved value from get(statsAtom)
        const statsData = await get(statsAtom) as Metric<Grouped<PlayerStats, ('matchId' | 'playerName' | 'playerHero'), PlayerStatsNumericalKeys>, ('matchId' | 'playerName' | 'playerHero'), PlayerStatsNumericalKeys>;

        // Return the rows with the correct type assertion
        return statsData.rows as Grouped<
          PlayerStats,
          ('matchId' | 'playerName' | 'playerHero'),
          PlayerStatsNumericalKeys
        >[];
      }),
    // Add types for equality check parameters
    (a: PlayerMatchParams, b: PlayerMatchParams) => a.matchId === b.matchId && a.playerId === b.playerId
  );

  // Team Stats for Match
  const teamStatsForMatchAtom = atomFamily(
    (params: TeamMatchParams) =>
      atom(async (get) => {
        const statsAtom = getStatsAtom(
          ['matchId', 'playerTeam'], // Added matchId to groupBy
          {
            matchId: [params.matchId],
            playerTeam: [params.teamName],
          }
        );
        const statsData = await get(statsAtom) as Metric<Grouped<PlayerStats, ('matchId' | 'playerTeam'), PlayerStatsNumericalKeys>, ('matchId' | 'playerTeam'), PlayerStatsNumericalKeys>;

        // Return the single row for the specified team
        return statsData.rows[0] as Grouped<
          PlayerStats,
          ('matchId' | 'playerTeam'),
          PlayerStatsNumericalKeys
        > | undefined; // Return undefined if no data found
      }),
    (a: TeamMatchParams, b: TeamMatchParams) => a.matchId === b.matchId && a.teamName === b.teamName
  );


  // Player Stats for Scrim
  const playerStatsForScrimAtom = atomFamily(
    (params: PlayerScrimParams) =>
      atom(async (get) => {
      // Find the relevant scrim to get match IDs
        const allScrims = await get(scrims.atom); // Now imported
        const targetScrim = allScrims.find((scrim: Scrim) => // Add type for scrim parameter
          `${scrim.dateString}-${scrim.team1Name}-vs-${scrim.team2Name}` === params.scrimId
        );

        if (!targetScrim) {
          return undefined; // Scrim not found
        }

        const statsAtom = getStatsAtom(
          ['matchId', 'playerName'], // Added matchId to groupBy
          {
            matchId: targetScrim.matchIds, // Filter by matches in this scrim
            playerName: [params.playerId],
          }
        );
        const statsData = await get(statsAtom) as Metric<Grouped<PlayerStats, ('matchId' | 'playerName'), PlayerStatsNumericalKeys>, ('matchId' | 'playerName'), PlayerStatsNumericalKeys>;

        // Return the single aggregated row for the player
        return statsData.rows[0] as Grouped<
          PlayerStats,
          ('matchId' | 'playerName'),
          PlayerStatsNumericalKeys
        > | undefined;
      }),
    (a: PlayerScrimParams, b: PlayerScrimParams) => a.scrimId === b.scrimId && a.playerId === b.playerId
  );


  // Team Stats for Scrim
  const teamStatsForScrimAtom = atomFamily(
    (params: TeamScrimParams) =>
      atom(async (get) => {
      // Find the relevant scrim to get match IDs
        const allScrims = await get(scrims.atom);
        const targetScrim = allScrims.find((scrim: Scrim) =>
          `${scrim.dateString}-${scrim.team1Name}-vs-${scrim.team2Name}` === params.scrimId
        );

        if (!targetScrim) {
          return undefined; // Scrim not found
        }

        // Ensure the requested team actually participated in the scrim
        if (targetScrim.team1Name !== params.teamName && targetScrim.team2Name !== params.teamName) {
          console.warn(`Team ${params.teamName} did not participate in scrim ${params.scrimId}`);
          return undefined;
        }

        const statsAtom = getStatsAtom(
          ['matchId', 'playerTeam'], // Added matchId to groupBy
          {
            matchId: targetScrim.matchIds, // Filter by matches in this scrim
            playerTeam: [params.teamName], // Filter by the specific team
          }
        );
        const statsData = await get(statsAtom) as Metric<Grouped<PlayerStats, ('matchId' | 'playerTeam'), PlayerStatsNumericalKeys>, ('matchId' |'playerTeam'), PlayerStatsNumericalKeys>;

        // Return the single aggregated row for the team
        return statsData.rows[0] as Grouped<
          PlayerStats,
          ('matchId' | 'playerTeam'),
          PlayerStatsNumericalKeys
        > | undefined;
      }),
    (a: TeamScrimParams, b: TeamScrimParams) => a.scrimId === b.scrimId && a.teamName === b.teamName
  );


  // Player Stats for Team
  const playerStatsForTeamAtom = atomFamily(
    (params: PlayerTeamParams) =>
      atom(async (get) => {
      // Find all matches the team participated in
        const allMatches = await get(matchData.atom); // Now imported
        const teamMatchIds = allMatches
          .filter((match: MatchData) => match.team1Name === params.teamName || match.team2Name === params.teamName) // Add type for match
          .map((match: MatchData) => match.matchId); // Add type for match

        if (teamMatchIds.length === 0) {
          return undefined; // Team hasn't played any matches or matchData is empty
        }

        const statsAtom = getStatsAtom(
          ['matchId', 'playerName'], // Added matchId to groupBy
          {
            matchId: teamMatchIds, // Filter by matches the team played
            playerName: [params.playerId],
          // We might also want to filter by playerTeam here, but a player could theoretically
          // play against their own tagged team if data is messy. Filtering by match participation is safer.
          }
        );
        const statsData = await get(statsAtom) as Metric<Grouped<PlayerStats, ('matchId' | 'playerName'), PlayerStatsNumericalKeys>, ('matchId' | 'playerName'), PlayerStatsNumericalKeys>;

        // Return the single aggregated row for the player's performance in team matches
        return statsData.rows[0] as Grouped<
          PlayerStats,
          ('matchId' | 'playerName'),
          PlayerStatsNumericalKeys
        > | undefined;
      }),
    (a: PlayerTeamParams, b: PlayerTeamParams) => a.teamName === b.teamName && a.playerId === b.playerId
  );


  // Match Stats for Scrim
  const matchStatsForScrimAtom = atomFamily(
    (params: MatchScrimParams) =>
      atom(async (get) => {
      // Find the relevant scrim to get match IDs
        const allScrims = await get(scrims.atom);
        const targetScrim = allScrims.find((scrim: Scrim) =>
          `${scrim.dateString}-${scrim.team1Name}-vs-${scrim.team2Name}` === params.scrimId
        );

        if (!targetScrim) {
          return []; // Scrim not found, return empty array
        }

        // Filter the main matchDataAtom for matches belonging to this scrim
        const allMatches = await get(matchData.atom);
        const scrimMatches = allMatches.filter((match: MatchData) =>
          targetScrim.matchIds.includes(match.matchId)
        );

        return scrimMatches;
      }),
    (a: MatchScrimParams, b: MatchScrimParams) => a.scrimId === b.scrimId
  );

  return {
    playerStatsForMatchAtom,
    teamStatsForMatchAtom,
    playerStatsForScrimAtom,
    teamStatsForScrimAtom,
    playerStatsForTeamAtom,
    matchStatsForScrimAtom,
  };
};

export default contextualStatAtomsFn();
