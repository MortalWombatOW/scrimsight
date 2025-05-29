import { atom, Atom } from 'jotai';
import {
  // Removed unused: PlayerStatsCategoryKeys,
  playerStatsBaseAtom,
  // Removed unused: playerStatsBaseNumericalKeys,
  PlayerStatsNumericalKeys,
} from '~/atoms/metrics/playerMetricsAtoms';
import {
  // Removed unused: HeroPlaytime,
  // Removed unused: HeroPlaytimeCategoryKeys,
  // Removed unused: HeroPlaytimeNumericalKeys,
  heroPlaytimeAtom,
} from '~/atoms/metrics/heroPlaytimeAtom';
// Removed unused: import { allPlayersForTeamAtom } from '../allPlayersForTeamAtom';
import { scrimAtom } from '~/atoms/scrimAtom'; // Removed unused Scrim type
import { teamStatsAtom } from '~/atoms/teamStatsAtom'; // Removed unused TeamStats type
import { groupByAtom, Grouped } from '~/atoms/metrics/metricUtils'; // Removed unused MetricAtom
import { OverwatchRole, getRankForRole } from '~/lib/hero';
import { playerFirstKillDeathRateAtom } from '~/atoms/derived_stats/playerFirstKillDeathRateAtom'; // Import the new atom
import { firstKillImpactAtom } from '~/atoms/derived_stats/firstKillImpactAtom'; // Import first kill impact atom

// --- Player List Summary ---

export interface PlayerListSummary {
  playerName: string;
  teamName: string; // Primary team (most playtime)
  topHero: string; // Hero with most playtime
  eliminations: number;
  deaths: number;
  assists: number; // Calculated as offensive + defensive assists
  role: OverwatchRole; // Role with most playtime
  firstKillRate: number; // Added: Percentage of teamfights participated in where player got first kill
}

// Helper atom to group player stats by player name
const playerStatsGroupedByPlayerAtom = groupByAtom(playerStatsBaseAtom, [
  'playerName',
]);

// Helper atom to group playtime by player name and hero
const playtimeByPlayerHeroAtom = groupByAtom(heroPlaytimeAtom, [
  'playerName',
  'hero', // Corrected key from 'playerHero' to 'hero'
]);

// Helper atom to group playtime by player name and role
const playtimeByPlayerRoleAtom = atom(async (get) => {
  const playtimeData = await get(heroPlaytimeAtom);
  const rolePlaytimeMap = new Map<string, Map<OverwatchRole, number>>();

  for (const row of playtimeData.rows) {
    // Use lowercase roles to match OverwatchRole type
    const role = getRankForRole(row.hero as OverwatchRole) === 0 ? 'tank' :
      getRankForRole(row.hero as OverwatchRole) === 1 ? 'damage' : 'support';
    if (!rolePlaytimeMap.has(row.playerName)) {
      rolePlaytimeMap.set(row.playerName, new Map());
    }
    const playerRoleMap = rolePlaytimeMap.get(row.playerName)!;
    playerRoleMap.set(role, (playerRoleMap.get(role) || 0) + row.playtime);
  }
  return rolePlaytimeMap;
});


// Helper atom to determine primary team based on playtime
const primaryTeamByPlayerAtom = atom(async (get) => {
  const { rows: playerStatsRows } = await get(playerStatsBaseAtom); // Correctly await and destructure rows
  const teamPlaytimeMap = new Map<string, Map<string, number>>();

  for (const row of playerStatsRows) { // Use destructured rows
    if (!teamPlaytimeMap.has(row.playerName)) {
      teamPlaytimeMap.set(row.playerName, new Map());
    }
    const playerTeamMap = teamPlaytimeMap.get(row.playerName)!;
    playerTeamMap.set(row.playerTeam, (playerTeamMap.get(row.playerTeam) || 0) + row.playtime);
  }

  const primaryTeamMap = new Map<string, string>();
  teamPlaytimeMap.forEach((teams, player) => {
    let maxPlaytime = -1;
    let primaryTeam = 'Unknown';
    teams.forEach((playtime, team) => {
      if (playtime > maxPlaytime) {
        maxPlaytime = playtime;
        primaryTeam = team;
      }
    });
    primaryTeamMap.set(player, primaryTeam);
  });
  return primaryTeamMap;
});


export const playerListSummaryAtom: Atom<Promise<PlayerListSummary[]>> = atom(async (get) => { // Added Atom type
  const groupedStats = await get(playerStatsGroupedByPlayerAtom);
  const playtimeByHero = await get(playtimeByPlayerHeroAtom);
  const playtimeByRole = await get(playtimeByPlayerRoleAtom);
  const primaryTeamMap = await get(primaryTeamByPlayerAtom);
  const firstKillRateData = await get(playerFirstKillDeathRateAtom); // Get first kill rate data (returns a Record)


  const summaries: PlayerListSummary[] = [];

  // Ensure groupedStats.rows is correctly typed or cast if necessary
  // Use the exported PlayerStatsNumericalKeys type for the assertion
  const statsRows = groupedStats.rows as Grouped<any, 'playerName', PlayerStatsNumericalKeys>[];


  for (const playerStat of statsRows) {
    const playerName = playerStat.playerName;

    // Find top hero
    const playerHeroPlaytimes = playtimeByHero.rows.filter(
      (pt) => pt.playerName === playerName
    );
    // Correct initial value for reduce to match Grouped<HeroPlaytime, 'playerName' | 'hero', 'playtime'>
    const topHeroData = playerHeroPlaytimes.reduce(
      (top, current) => (current.playtime > top.playtime ? current : top),
      { playerName: '', hero: 'Unknown', playtime: -1 } // Use 'hero' key
    );
    const topHero = topHeroData.hero; // Access the correct property


    // Find top role
    const playerRolePlaytimes = playtimeByRole.get(playerName);
    let topRole: OverwatchRole = 'tank'; // Default to lowercase
    let maxRolePlaytime = -1;
    if (playerRolePlaytimes) {
      playerRolePlaytimes.forEach((playtime, role) => {
        if (playtime > maxRolePlaytime) {
          maxRolePlaytime = playtime;
          topRole = role;
        }
      });
    }


    summaries.push({
      playerName: playerName,
      teamName: primaryTeamMap.get(playerName) || 'Unknown',
      topHero: topHero,
      eliminations: playerStat.eliminations,
      deaths: playerStat.deaths,
      assists: playerStat.offensiveAssists + playerStat.defensiveAssists,
      role: topRole,
      firstKillRate: firstKillRateData[playerName]?.firstKillRate ?? 0, // Access rate from record, default to 0
    });
  }

  return summaries;
});

// --- Scrim List Summary ---

export interface ScrimListSummary {
  scrimId: string; // Unique ID derived from date and teams
  teamNames: string[];
  dateString: string;
  mapCount: number;
  score: string; // e.g., "3-2-1" (W-L-D for team1)
  duration: number; // Total duration in seconds
}

export const scrimListSummaryAtom: Atom<
  Promise<ScrimListSummary[]>
> = atom(async (get) => { // Added Atom type
  const scrims = await get(scrimAtom);

  return scrims.map((scrim) => ({
    scrimId: `${scrim.dateString}-${scrim.team1Name}-vs-${scrim.team2Name}`, // Create a unique ID
    teamNames: [scrim.team1Name, scrim.team2Name],
    dateString: scrim.dateString,
    mapCount: scrim.matchIds.length,
    score: `${scrim.team1Wins}-${scrim.team2Wins}-${scrim.draws}`,
    duration: scrim.duration,
  }));
});

// --- Team List Summary ---

export interface TeamListSummary {
  teamName: string;
  playerCount: number;
  winRate: number; // Calculated as wins / (wins + losses)
  gamesPlayed: number;
  firstKillWinRate: number; // Added: Win rate in teamfights where this team got the first kill
}

export const teamListSummaryAtom: Atom<Promise<TeamListSummary[]>> = atom( // Added Atom type
  async (get) => {
    const teamStats = await get(teamStatsAtom);
    const firstKillImpactData = await get(firstKillImpactAtom); // Get first kill impact data

    return teamStats.map((team) => {
      const gamesPlayed = team.wins + team.losses; // Exclude draws for win rate calculation
      const winRate = gamesPlayed > 0 ? team.wins / gamesPlayed : 0;
      // Access the team-specific stats from the record
      const teamFirstKillStats = firstKillImpactData.teamStats[team.teamName];
      const firstKillWinRate = teamFirstKillStats?.firstKillWinRate ?? 0; // Get rate, default 0

      return {
        teamName: team.teamName,
        playerCount: team.players.length,
        winRate: winRate,
        gamesPlayed: team.gamesPlayed, // Include draws here
        firstKillWinRate: firstKillWinRate, // Add the rate
      };
    });
  }
);

// --- Latest Scrim Summary ---

// Helper to find the latest scrim based on dateString
export const latestScrimSummaryAtom: Atom<Promise<ScrimListSummary | undefined>> = atom(async (get) => {
  const allScrims = await get(scrimListSummaryAtom); // Use the already summarized scrims

  if (allScrims.length === 0) {
    return undefined;
  }

  // Sort by date descending (assuming dateString is sortable, e.g., YYYY-MM-DD)
  // If dateString format isn't reliable, parsing to Date objects is needed
  const sortedScrims = [...allScrims].sort((a, b) => {
    try {
      // Attempt to parse dates for robust sorting
      return new Date(b.dateString).getTime() - new Date(a.dateString).getTime();
    } catch (e) {
      // Fallback to string comparison if parsing fails
      return b.dateString.localeCompare(a.dateString);
    }
  });

  return sortedScrims[0]; // Return the most recent one
});
