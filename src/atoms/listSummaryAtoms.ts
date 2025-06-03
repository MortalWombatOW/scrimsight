import { atom, Atom, Getter } from 'jotai';
import {
  playerStatsBase, // Use the registered atom
  PlayerStatsBase, // Import PlayerStatsBase for typing
  PlayerStatsBaseNumericalKeys, // Import for base stats
} from '@atoms'; // Removed PlayerStatsNumericalKeys as it's unused
// Note: heroPlaytimeAtom is not yet registered in @atoms index, using direct import for now
import { heroPlaytimeAtom } from '@atoms/heroPlaytimeAtom';
import {
  HeroPlaytime, // Import HeroPlaytime type
  HeroPlaytimeCategoryKeys, // Import for heroPlaytime
  HeroPlaytimeNumericalKeys, // Import for heroPlaytime
} from '@atoms/heroPlaytimeAtom';
import { groupByAtom, Grouped, Metric } from '@library'; // Import Metric
import { OverwatchRole, getRoleFromHero } from '@library'; // Removed getRankForRole as it's unused
import { playerFirstKillDeathRate, PlayerFirstKillDeathRateStats } from '@atoms'; // Use registered atom and type
import { scrims } from '@atoms';
import { teamStats } from '@atoms';
import { firstKillImpact } from '@atoms';
import { Scrim, TeamStats } from '@atoms'; // Import types from index

export const latestScrimSummaryFn = async (get: Getter): Promise<ScrimListSummary | undefined> => {
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
    } catch { // Removed unused 'error' variable
      // Fallback to string comparison if parsing fails
      return b.dateString.localeCompare(a.dateString);
    }
  });

  return sortedScrims[0]; // Return the most recent one
};

// Helper atom to group player stats by player name
export const playerListSummaryFn = async (get: Getter): Promise<PlayerListSummary[]> => {
  const groupedStats: Metric<Grouped<PlayerStatsBase, 'playerName', PlayerStatsBaseNumericalKeys>, 'playerName', PlayerStatsBaseNumericalKeys> = await get(playerStatsGroupedByPlayerAtom);
  const playtimeByHero: Metric<Grouped<HeroPlaytime, 'playerName' | 'hero', HeroPlaytimeNumericalKeys>, 'playerName' | 'hero', HeroPlaytimeNumericalKeys> = await get(playtimeByPlayerHeroAtom);
  const playtimeByRole = await get(playtimeByPlayerRoleAtom);
  const primaryTeamMap = await get(primaryTeamByPlayerAtom);
  const firstKillRateData: Record<string, PlayerFirstKillDeathRateStats> = await get(playerFirstKillDeathRate.atom);


  const summaries: PlayerListSummary[] = [];

  const statsRows = groupedStats.rows;


  for (const playerStat of statsRows) {
    const playerName = playerStat.playerName;

    const playerHeroPlaytimes = playtimeByHero.rows.filter(
      (pt) => pt.playerName === playerName
    );
    const topHeroData = playerHeroPlaytimes.reduce(
      (top, current) => (current.playtime > top.playtime ? current : top),
      { playerName: '', hero: 'Unknown', playtime: -1 } as Grouped<HeroPlaytime, 'playerName' | 'hero', HeroPlaytimeNumericalKeys>
    );
    const topHero = topHeroData.hero;


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
      firstKillRate: firstKillRateData[playerName]?.firstKillRate ?? 0,
    });
  }

  return summaries;
};

// Helper atom to group playtime by player name and hero
export const scrimListSummaryFn = async (get: Getter): Promise<ScrimListSummary[]> => {
  const allScrims = await get(scrims.atom);

  return allScrims.map((scrim: Scrim) => ({
    scrimId: `${scrim.dateString}-${scrim.team1Name}-vs-${scrim.team2Name}`, // Create a unique ID
    teamNames: [scrim.team1Name, scrim.team2Name],
    dateString: scrim.dateString,
    mapCount: scrim.matchIds.length,
    score: `${scrim.team1Wins}-${scrim.team2Wins}-${scrim.draws}`,
    duration: scrim.duration,
  }));
};

// Helper atom to group playtime by player name and role
export const teamListSummaryFn = async (get: Getter): Promise<TeamListSummary[]> => {
  const allTeamStats = await get(teamStats.atom);
  const firstKillImpactData = await get(firstKillImpact.atom); // Get first kill impact data

  return allTeamStats.map((team: TeamStats) => {
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
};


// Helper atom to determine primary team based on playtime
const primaryTeamByPlayerAtom = atom(async (get) => {
  const { rows: playerStatsRows } = await get(playerStatsBase.atom);
  const teamPlaytimeMap = new Map<string, Map<string, number>>();

  for (const row of playerStatsRows) {
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


const playerStatsGroupedByPlayerAtom = groupByAtom(playerStatsBase.atom, [
  'playerName',
]);

export default atom(async (get): Promise<PlayerListSummary[]> => {
  return playerListSummaryFn(get);
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

const playtimeByPlayerHeroAtom = groupByAtom(heroPlaytimeAtom, [
  'playerName',
  'hero',
]);

export const scrimListSummaryAtom: Atom<
  Promise<ScrimListSummary[]>
> = atom(async (get) => {
  return scrimListSummaryFn(get);
});

// --- Team List Summary ---

export interface TeamListSummary {
  teamName: string;
  playerCount: number;
  winRate: number; // Calculated as wins / (wins + losses)
  gamesPlayed: number;
  firstKillWinRate: number; // Added: Win rate in teamfights where this team got the first kill
}

const playtimeByPlayerRoleAtom = atom(async (get: Getter) => {
  const playtimeData: Metric<HeroPlaytime, HeroPlaytimeCategoryKeys, HeroPlaytimeNumericalKeys> = await get(heroPlaytimeAtom);
  const rolePlaytimeMap = new Map<string, Map<OverwatchRole, number>>();

  for (const row of playtimeData.rows) {
    const role: OverwatchRole = getRoleFromHero(row.hero);
    if (!rolePlaytimeMap.has(row.playerName)) {
      rolePlaytimeMap.set(row.playerName, new Map());
    }
    const playerRoleMap = rolePlaytimeMap.get(row.playerName)!;
    playerRoleMap.set(role, (playerRoleMap.get(role) || 0) + row.playtime);
  }
  return rolePlaytimeMap;
});

export const teamListSummaryAtom: Atom<Promise<TeamListSummary[]>> = atom(
  async (get) => {
    return teamListSummaryFn(get);
  }
);

// --- Latest Scrim Summary ---

// Helper to find the latest scrim based on dateString
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

export const latestScrimSummaryAtom: Atom<Promise<ScrimListSummary | undefined>> = atom(async (get) => {
  return latestScrimSummaryFn(get);
});
