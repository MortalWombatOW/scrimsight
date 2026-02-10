import { type ReactNode, useState, useMemo } from "react";
import { RoleIcon } from "@icons";
import { getRoleFromHero, OverwatchRole } from "@library";
import { PlayerList } from "./PlayerList";
import { useMatches } from "../../hooks/useRepository";

// Define sort options for players
type PlayerSortOption = "name" | "kda" | "elims" | "role";

export const PlayersOverview = (): ReactNode => {
  const matches = useMatches();

  const playerSummaries = useMemo(() => {
    const playerMap = new Map<string, {
      eliminations: number;
      deaths: number;
      assists: number;
      teamName: string;
      topHero: string;
      heroPlaytime: Map<string, number>;
      role: OverwatchRole;
    }>();

    for (const match of matches) {
      for (const stat of match.playerStats.rows) {
        if (!playerMap.has(stat.playerName)) {
          playerMap.set(stat.playerName, {
            eliminations: 0,
            deaths: 0,
            assists: 0,
            teamName: stat.playerTeam,
            topHero: stat.playerHero,
            heroPlaytime: new Map(),
            role: stat.playerRole as OverwatchRole,
          });
        }

        const playerData = playerMap.get(stat.playerName)!;
        playerData.eliminations += stat.eliminations;
        playerData.deaths += stat.deaths;
        playerData.assists += stat.defensiveAssists + stat.offensiveAssists;
        playerData.role = stat.playerRole as OverwatchRole;

        const currentPlaytime = playerData.heroPlaytime.get(stat.playerHero) || 0;
        playerData.heroPlaytime.set(stat.playerHero, currentPlaytime + stat.playtime);
      }
    }

    return Array.from(playerMap.entries()).map(([playerName, data]) => {
      let topHero = '';
      let maxPlaytime = 0;
      data.heroPlaytime.forEach((playtime, hero) => {
        if (playtime > maxPlaytime) {
          maxPlaytime = playtime;
          topHero = hero;
        }
      });

      return {
        playerName,
        teamName: data.teamName,
        topHero: topHero || data.topHero,
        eliminations: data.eliminations,
        deaths: data.deaths,
        assists: data.assists,
        role: data.role,
        firstKillRate: 0, // TODO: Calculate from teamfight data
      };
    });
  }, [matches]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<PlayerSortOption>("name"); // Default sort

  // Calculate top-level stats from summaries
  const mostPlayedHeroStat = playerSummaries.reduce(
    (top, current) => {
      // This requires playtime per hero, which isn't in the summary.
      // For now, we'll just show the most frequent topHero.
      // A more accurate calculation would need playtimeByPlayerHeroAtom here.
      // Let's count occurrences for simplicity for now.
      const heroCount = playerSummaries.filter(p => p.topHero === current.topHero).length;
      if (heroCount > top.count) {
        return { hero: current.topHero, count: heroCount };
      }
      return top;
    },
    { hero: "N/A", count: 0 }
  );

  const mostPlayedRole = mostPlayedHeroStat.hero !== "N/A"
    ? getRoleFromHero(mostPlayedHeroStat.hero)
    : "unknown";

  // Filter and sort players
  const filteredAndSortedPlayers = playerSummaries
    .filter((player) =>
      player.playerName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "kda":
          const kdaA = a.deaths === 0 ? a.eliminations + a.assists : (a.eliminations + a.assists) / a.deaths;
          const kdaB = b.deaths === 0 ? b.eliminations + b.assists : (b.eliminations + b.assists) / b.deaths;
          return kdaB - kdaA; // Higher KDA first
        case "elims":
          return b.eliminations - a.eliminations; // Higher elims first
        case "role":
          // Basic role sorting (Tank > Damage > Support) - adjust if needed
          const roleRank = (role: OverwatchRole) => role === 'tank' ? 0 : role === 'damage' ? 1 : 2;
          return roleRank(a.role) - roleRank(b.role);
        case "name":
        default:
          return a.playerName.localeCompare(b.playerName);
      }
    });


  return (
    <div className="space-y-8">
      {/* Simplified Top Stats */}
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Most Frequent Top Hero</div>
          <div className="stat-value flex items-center gap-2">
            {mostPlayedHeroStat.hero}
            {mostPlayedRole !== "unknown" && <RoleIcon role={mostPlayedRole} />}
          </div>
          <div className="stat-desc">
            Appeared most often as top hero
          </div>
        </div>
        {/* Add other summary stats if needed */}
      </div>

      {/* TODO: Add PlayersFilter component here */}
      <div className="p-4 bg-base-200 rounded-box shadow"> {/* Placeholder for filter UI */}
        <input
          type="text"
          placeholder="Search Players..."
          className="input input-bordered w-full max-w-xs mr-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="select select-bordered w-full max-w-xs"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as PlayerSortOption)}
        >
          <option value="name">Name</option>
          <option value="kda">KDA</option>
          <option value="elims">Eliminations</option>
          <option value="role">Role</option>
        </select>
      </div>

      {/* Top Players - This might need adjustment based on available summary data */}
      {/* <TopPlayersList /> */}

      {/* Player List - Pass filtered and sorted data */}
      <PlayerList players={filteredAndSortedPlayers} />
    </div>
  );
};
