import { atom } from 'jotai';
import { Getter } from 'jotai';
import {
  playerStatsBase,
  PlayerStatsBase,
  PlayerStatsBaseNumericalKeys,
  heroPlaytime,
  HeroPlaytime,
  HeroPlaytimeCategoryKeys,
  HeroPlaytimeNumericalKeys,
  PlayerListSummary,
  playerFirstKillDeathRate,
  PlayerFirstKillDeathRateStats,
} from '@atoms';
import { groupByAtom, Grouped, Metric } from '@library';
import { OverwatchRole, getRoleFromHero } from '@library';

export const playerListSummaryFn = async (get: Getter): Promise<PlayerListSummary[]> => {
  // Helper atoms defined inside the function to avoid variableExpression at root
  const playerStatsGroupedByPlayerAtom = groupByAtom(playerStatsBase.atom, ['playerName']);
  const playtimeByPlayerHeroAtom = groupByAtom(heroPlaytime.atom, ['playerName', 'hero']);
  
  const playtimeByPlayerRoleAtom = atom(async (get: Getter) => {
    const playtimeData: Metric<HeroPlaytime, HeroPlaytimeCategoryKeys, HeroPlaytimeNumericalKeys> = await get(heroPlaytime.atom);
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
    let topRole: OverwatchRole = 'tank';
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

export default atom(async (get): Promise<PlayerListSummary[]> => {
  return playerListSummaryFn(get);
});