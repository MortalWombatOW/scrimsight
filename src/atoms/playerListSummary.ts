import { atom } from 'jotai';
import { Getter } from 'jotai';
import {
  playerStatsBase, // Use the registered atom
  PlayerStatsBase, // Import PlayerStatsBase for typing
  PlayerStatsBaseNumericalKeys, // Import for base stats
} from '@atoms';
import {
  heroPlaytimeAtom, // Use the registered atom
  HeroPlaytime, // Import HeroPlaytime type
  HeroPlaytimeCategoryKeys, // Import for heroPlaytime
  HeroPlaytimeNumericalKeys, // Import for heroPlaytime
} from '@atoms/heroPlaytimeAtom'; // Use path alias
import { groupByAtom, Grouped, Metric } from '@library'; // Import Metric
import { OverwatchRole, getRoleFromHero } from '@library'; // Removed getRankForRole as it's unused
import { playerFirstKillDeathRate, PlayerFirstKillDeathRateStats } from '@atoms'; // Use registered atom and type

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
    let maxRolePlaytime = -1; // Declare outside loop if needed for wider scope, but here it's fine
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

// Helper atom to group player stats by player name
const playerStatsGroupedByPlayerAtom = groupByAtom(playerStatsBase.atom, [
  'playerName',
]);

// Helper atom to group playtime by player name and hero
const playtimeByPlayerHeroAtom = groupByAtom(heroPlaytimeAtom, [
  'playerName',
  'hero',
]);

// Helper atom to group playtime by player name and role
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

export default atom(async (get): Promise<PlayerListSummary[]> => {
  return playerListSummaryFn(get);
});
