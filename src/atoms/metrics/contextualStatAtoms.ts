import { atom } from 'jotai'; // Removed unused Atom type
import { atomFamily } from 'jotai/utils';
import {
  PlayerStats,
  // Removed unused: PlayerStatsCategoryKeys,
  PlayerStatsNumericalKeys,
  getStatsAtom,
} from './playerMetricsAtoms';
import { Grouped, Metric } from './metricUtils'; // Removed unused MetricAtom
import { Scrim, scrimAtom } from '../scrimAtom';
import { MatchData, matchDataAtom } from '../matchDataAtom';

// --- Player Stats for Match ---

// Define the parameter type for the atom family
interface PlayerMatchParams {
  matchId: string;
  playerId: string;
}

// Atom family to get stats for a specific player in a specific match
export const playerStatsForMatchAtom = atomFamily(
  (params: PlayerMatchParams) =>
    atom(async (get) => {
      // Use getStatsAtom (or replicate logic) with filters
      // Note: getStatsAtom needs to be accessible here, might need export or refactor
      const statsAtom = getStatsAtom(
        ['playerName', 'playerHero'], // Group by player and hero within the match
        {
          matchId: [params.matchId],
          playerName: [params.playerId],
        }
      );
      // Explicitly type the resolved value from get(statsAtom)
      const statsData = await get(statsAtom) as Metric<Grouped<PlayerStats, ('playerName' | 'playerHero'), PlayerStatsNumericalKeys>, ('playerName' | 'playerHero'), PlayerStatsNumericalKeys>;

      // Return the rows with the correct type assertion
      return statsData.rows as Grouped<
        PlayerStats,
        'playerName' | 'playerHero',
        PlayerStatsNumericalKeys
      >[];
    }),
  // Add types for equality check parameters
  (a: PlayerMatchParams, b: PlayerMatchParams) => a.matchId === b.matchId && a.playerId === b.playerId
);

// --- Team Stats for Match ---

// Define the parameter type
interface TeamMatchParams {
  matchId: string;
  teamName: string;
}

// Atom family to get stats for a specific team in a specific match
export const teamStatsForMatchAtom = atomFamily(
  (params: TeamMatchParams) =>
    atom(async (get) => {
      const statsAtom = getStatsAtom(
        ['playerTeam'], // Group by team only to aggregate stats
        {
          matchId: [params.matchId],
          playerTeam: [params.teamName],
        }
      );
      const statsData = await get(statsAtom) as Metric<Grouped<PlayerStats, 'playerTeam', PlayerStatsNumericalKeys>, 'playerTeam', PlayerStatsNumericalKeys>;

      // Return the single row for the specified team
      return statsData.rows[0] as Grouped<
        PlayerStats,
        'playerTeam',
        PlayerStatsNumericalKeys
      > | undefined; // Return undefined if no data found
    }),
  (a: TeamMatchParams, b: TeamMatchParams) => a.matchId === b.matchId && a.teamName === b.teamName
);


// --- Player Stats for Scrim ---

// Define the parameter type
interface PlayerScrimParams {
  scrimId: string; // Derived from date/teams, e.g., "2023-08-28-Team A-vs-Team B"
  playerId: string;
}

// Atom family to get aggregated stats for a player across all matches in a scrim
export const playerStatsForScrimAtom = atomFamily(
  (params: PlayerScrimParams) =>
    atom(async (get) => {
      // Find the relevant scrim to get match IDs
      const allScrims = await get(scrimAtom); // Now imported
      const targetScrim = allScrims.find((scrim: Scrim) => // Add type for scrim parameter
        `${scrim.dateString}-${scrim.team1Name}-vs-${scrim.team2Name}` === params.scrimId
      );

      if (!targetScrim) {
        return undefined; // Scrim not found
      }

      const statsAtom = getStatsAtom(
        ['playerName'], // Aggregate all stats for the player across the scrim matches
        {
          matchId: targetScrim.matchIds, // Filter by matches in this scrim
          playerName: [params.playerId],
        }
      );
      const statsData = await get(statsAtom) as Metric<Grouped<PlayerStats, 'playerName', PlayerStatsNumericalKeys>, 'playerName', PlayerStatsNumericalKeys>;

      // Return the single aggregated row for the player
      return statsData.rows[0] as Grouped<
        PlayerStats,
        'playerName',
        PlayerStatsNumericalKeys
      > | undefined;
    }),
  (a: PlayerScrimParams, b: PlayerScrimParams) => a.scrimId === b.scrimId && a.playerId === b.playerId
);


// --- Team Stats for Scrim ---

// Define the parameter type
interface TeamScrimParams {
  scrimId: string; // Derived from date/teams
  teamName: string;
}

// Atom family to get aggregated stats for a team across all matches in a scrim
export const teamStatsForScrimAtom = atomFamily(
  (params: TeamScrimParams) =>
    atom(async (get) => {
      // Find the relevant scrim to get match IDs
      const allScrims = await get(scrimAtom);
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
        ['playerTeam'], // Aggregate all stats for the team across the scrim matches
        {
          matchId: targetScrim.matchIds, // Filter by matches in this scrim
          playerTeam: [params.teamName], // Filter by the specific team
        }
      );
      const statsData = await get(statsAtom) as Metric<Grouped<PlayerStats, 'playerTeam', PlayerStatsNumericalKeys>, 'playerTeam', PlayerStatsNumericalKeys>;

      // Return the single aggregated row for the team
      return statsData.rows[0] as Grouped<
        PlayerStats,
        'playerTeam',
        PlayerStatsNumericalKeys
      > | undefined;
    }),
  (a: TeamScrimParams, b: TeamScrimParams) => a.scrimId === b.scrimId && a.teamName === b.teamName
);


// --- Player Stats for Team ---

// Define the parameter type
interface PlayerTeamParams {
  teamName: string;
  playerId: string;
}

// Atom family to get aggregated stats for a player specifically for matches played on a given team
export const playerStatsForTeamAtom = atomFamily(
  (params: PlayerTeamParams) =>
    atom(async (get) => {
      // Find all matches the team participated in
      const allMatches = await get(matchDataAtom); // Now imported
      const teamMatchIds = allMatches
        .filter((match: MatchData) => match.team1Name === params.teamName || match.team2Name === params.teamName) // Add type for match
        .map((match: MatchData) => match.matchId); // Add type for match

      if (teamMatchIds.length === 0) {
        return undefined; // Team hasn't played any matches or matchData is empty
      }

      const statsAtom = getStatsAtom(
        ['playerName'], // Aggregate all stats for the player across the team's matches
        {
          matchId: teamMatchIds, // Filter by matches the team played
          playerName: [params.playerId],
          // We might also want to filter by playerTeam here, but a player could theoretically
          // play against their own tagged team if data is messy. Filtering by match participation is safer.
        }
      );
      const statsData = await get(statsAtom) as Metric<Grouped<PlayerStats, 'playerName', PlayerStatsNumericalKeys>, 'playerName', PlayerStatsNumericalKeys>;

      // Return the single aggregated row for the player's performance in team matches
      return statsData.rows[0] as Grouped<
        PlayerStats,
        'playerName',
        PlayerStatsNumericalKeys
      > | undefined;
    }),
  (a: PlayerTeamParams, b: PlayerTeamParams) => a.teamName === b.teamName && a.playerId === b.playerId
);


// --- Match Stats for Scrim ---

// Define the parameter type
interface MatchScrimParams {
  scrimId: string; // Derived from date/teams
}

// Atom family to get the list of MatchData objects for a specific scrim
export const matchStatsForScrimAtom = atomFamily(
  (params: MatchScrimParams) =>
    atom(async (get) => {
      // Find the relevant scrim to get match IDs
      const allScrims = await get(scrimAtom);
      const targetScrim = allScrims.find((scrim: Scrim) =>
        `${scrim.dateString}-${scrim.team1Name}-vs-${scrim.team2Name}` === params.scrimId
      );

      if (!targetScrim) {
        return []; // Scrim not found, return empty array
      }

      // Filter the main matchDataAtom for matches belonging to this scrim
      const allMatches = await get(matchDataAtom);
      const scrimMatches = allMatches.filter((match: MatchData) =>
        targetScrim.matchIds.includes(match.matchId)
      );

      return scrimMatches;
    }),
  (a: MatchScrimParams, b: MatchScrimParams) => a.scrimId === b.scrimId
);
