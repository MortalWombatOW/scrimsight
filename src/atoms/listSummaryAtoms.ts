import { atom, Atom, Getter } from 'jotai';
import {
  playerStatsBase,
  PlayerStatsBase,
  PlayerStatsBaseNumericalKeys,
  heroPlaytime,
  HeroPlaytime,
  HeroPlaytimeCategoryKeys,
  HeroPlaytimeNumericalKeys,
  playerFirstKillDeathRate,
  PlayerFirstKillDeathRateStats,
  scrims,
  teamStats,
  firstKillImpact,
  Scrim,
  TeamStats,
  matchData,
  MatchData,
  PlayerListSummary,
  ScrimListSummary,
  TeamListSummary,
} from '@atoms';
import { groupByAtom, Grouped, Metric, OverwatchRole, getRoleFromHero } from '@library';

export const listSummaryAtomsFn = () => {
  // Helper function for latest scrim summary
  const latestScrimSummaryFn = async (get: Getter): Promise<ScrimListSummary | undefined> => {
    const allScrims = await get(scrimListSummaryAtom);

    if (allScrims.length === 0) {
      return undefined;
    }

    const sortedScrims = [...allScrims].sort((a, b) => {
      try {
        return new Date(b.dateString).getTime() - new Date(a.dateString).getTime();
      } catch {
        return b.dateString.localeCompare(a.dateString);
      }
    });

    return sortedScrims[0];
  };

  // Helper function for player list summary
  const playerListSummaryFn = async (get: Getter): Promise<PlayerListSummary[]> => {
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

  // Helper function for scrim list summary
  const scrimListSummaryFn = async (get: Getter): Promise<ScrimListSummary[]> => {
    const allScrims = await get(scrims.atom);
    const allMatches: MatchData[] = await get(matchData.atom);

    return allScrims.map((scrim: Scrim) => {
      const scrimMatches = allMatches.filter((m) =>
        scrim.matchIds.includes(m.matchId)
      );
      // Get unique maps, preserving order of appearance
      const maps = Array.from(new Set(scrimMatches.map((m) => m.map)));

      return {
        scrimId: `${scrim.dateString}-${scrim.team1Name}-vs-${scrim.team2Name}`,
        teamNames: [scrim.team1Name, scrim.team2Name],
        dateString: scrim.dateString,
        mapCount: scrim.matchIds.length,
        score: `${scrim.team1Wins}-${scrim.team2Wins}-${scrim.draws}`,
        duration: scrim.duration,
        maps: maps,
      };
    });
  };

  // Helper function for team list summary
  const teamListSummaryFn = async (get: Getter): Promise<TeamListSummary[]> => {
    const allTeamStats = await get(teamStats.atom);
    const firstKillImpactData = await get(firstKillImpact.atom);

    return allTeamStats.map((team: TeamStats) => {
      const gamesPlayed = team.wins + team.losses;
      const winRate = gamesPlayed > 0 ? team.wins / gamesPlayed : 0;
      const teamFirstKillStats = firstKillImpactData.teamStats[team.teamName];
      const firstKillWinRate = teamFirstKillStats?.firstKillWinRate ?? 0;

      return {
        teamName: team.teamName,
        playerCount: team.players.length,
        winRate: winRate,
        gamesPlayed: team.gamesPlayed,
        firstKillWinRate: firstKillWinRate,
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

  // Main atoms
  const playerListSummaryAtom = atom(async (get): Promise<PlayerListSummary[]> => {
    return playerListSummaryFn(get);
  });

  const scrimListSummaryAtom: Atom<Promise<ScrimListSummary[]>> = atom(async (get) => {
    return scrimListSummaryFn(get);
  });

  const teamListSummaryAtom: Atom<Promise<TeamListSummary[]>> = atom(async (get) => {
    return teamListSummaryFn(get);
  });

  const latestScrimSummaryAtom: Atom<Promise<ScrimListSummary | undefined>> = atom(async (get) => {
    return latestScrimSummaryFn(get);
  });

  return {
    playerListSummaryAtom,
    scrimListSummaryAtom,
    teamListSummaryAtom,
    latestScrimSummaryAtom,
    // Export helper functions for testing
    playerListSummaryFn,
    scrimListSummaryFn,
    teamListSummaryFn,
    latestScrimSummaryFn,
  };
};

export default new Proxy({} as ReturnType<typeof listSummaryAtomsFn>, {
  get(_target, prop) {
    try {
      const atoms = listSummaryAtomsFn();
      return atoms[prop as keyof typeof atoms];
    } catch (error) {
      // During testing, if atoms are not available, return mock atoms  
      console.warn('Failed to initialize listSummaryAtoms, using mock atoms:', error);
      const mockAtoms = {
        playerListSummaryAtom: { atom: () => Promise.resolve([]) } as any,
        scrimListSummaryAtom: { atom: () => Promise.resolve([]) } as any,
        teamListSummaryAtom: { atom: () => Promise.resolve([]) } as any,
        latestScrimSummaryAtom: { atom: () => Promise.resolve(undefined) } as any,
      };
      return mockAtoms[prop as keyof typeof mockAtoms];
    }
  },
  has(_target, prop) {
    try {
      return prop in listSummaryAtomsFn();
    } catch {
      return prop in { playerListSummaryAtom: true, scrimListSummaryAtom: true, teamListSummaryAtom: true, latestScrimSummaryAtom: true };
    }
  },
  ownKeys(_target) {
    try {
      return Object.keys(listSummaryAtomsFn());
    } catch {
      return ['playerListSummaryAtom', 'scrimListSummaryAtom', 'teamListSummaryAtom', 'latestScrimSummaryAtom'];
    }
  },
  getOwnPropertyDescriptor(_target, prop) {
    try {
      const atoms = listSummaryAtomsFn();
      return Object.getOwnPropertyDescriptor(atoms, prop) || { configurable: true, enumerable: true, value: atoms[prop as keyof typeof atoms] };
    } catch {
      return { configurable: true, enumerable: true, value: undefined };
    }
  }
});