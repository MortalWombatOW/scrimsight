import { useState } from "react";
import { useAtom } from "jotai";
import { teamStatsAtom } from "../../atoms/teamStatsAtom";
import { TeamsSummaryStats } from "./components/TeamsSummaryStats";
import { TeamsFilter, SortOption } from "./components/TeamsFilter";
import { TeamsList } from "./components/TeamsList";

export const TeamsPage = () => {
  const [teamStats] = useAtom(teamStatsAtom);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  // Calculate summary statistics
  const totalTeams = teamStats.length;
  const totalGames = teamStats.reduce((sum, team) => sum + team.gamesPlayed, 0);
  const totalWins = teamStats.reduce((sum, team) => sum + team.wins, 0);
  const totalPlayers = new Set(teamStats.flatMap((team) => team.players)).size;

  // Filter and sort teams
  const filteredAndSortedTeams = teamStats
    .filter((team) =>
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "wins":
          return b.wins - a.wins;
        case "recent":
          return (
            (b.mostRecentGameDate?.getTime() || 0) -
            (a.mostRecentGameDate?.getTime() || 0)
          );
        case "players":
          return b.players.length - a.players.length;
        default:
          return a.teamName.localeCompare(b.teamName);
      }
    });

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="mb-8 bg-base-100 rounded-lg p-6  dark:bg-base-800">
        <h1 className="text-3xl font-bold mb-2 text-base-900 dark:text-white">
          Teams
        </h1>
        <p className="text-lg text-base-600 dark:text-base-400">
          Overview of all teams and their performance
        </p>
      </div>

      <TeamsSummaryStats
        totalTeams={totalTeams}
        totalGames={totalGames}
        totalWins={totalWins}
        totalPlayers={totalPlayers}
      />

      <div className="bg-base-100 rounded-lg p-6 shadow-md mb-6 dark:bg-base-800">
        <TeamsFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={(value) => setSortBy(value)}
        />

        <TeamsList teams={filteredAndSortedTeams} />
      </div>
    </div>
  );
};
