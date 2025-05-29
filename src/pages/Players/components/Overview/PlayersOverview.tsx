import { type ReactNode, useState } from "react";
// Removed useStats import
import { useAtomValue } from "jotai";
// Removed duplicate imports below
import { playerListSummaryAtom } from "@atoms/listSummaryAtoms";
import RoleIcon from "@components/Common/RoleIcon";
import { getRoleFromHero, OverwatchRole } from "@library/hero";
// Removed unused: import { TopPlayersList } from "./TopPlayersList";
import { PlayerList } from "@pages/Players/components/Overview/PlayerList";
// TODO: Create or import a PlayersFilter component similar to TeamsFilter
// import { PlayersFilter, PlayerSortOption } from "./PlayersFilter";

// Define sort options for players
type PlayerSortOption = "name" | "kda" | "elims" | "role"; // Example sort options

export const PlayersOverview = (): ReactNode => {
  const playerSummaries = useAtomValue(playerListSummaryAtom);
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
