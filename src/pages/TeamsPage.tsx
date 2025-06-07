import { useState } from "react";
// Removed duplicate import: import { useState } from "react";
import { useAtomValue } from "jotai"; // Use useAtomValue for read-only atoms
// Import the new summary atom and type
// Removed unused import: import { teamStatsAtom } from "../../atoms/teamStatsAtom";
import {
  teamListSummaryAtom,
  // Removed unused: TeamListSummary,
} from "@atoms";
import { TeamsSummaryStats, TeamsFilter, TeamsList, Container } from "@components"; // Combined imports

export const TeamsPage = () => {
  // Use the new summary atom
  const teamSummaries = useAtomValue(teamListSummaryAtom);
  const [searchQuery, setSearchQuery] = useState("");
  // Update default sort if 'recent' was default, or adjust SortOption type
  const [sortBy, setSortBy] = useState<SortOption>("name");

  // Calculate summary statistics using new data structure
  const totalTeams = teamSummaries.length;
  const totalGames = teamSummaries.reduce(
    (sum, team) => sum + team.gamesPlayed,
    0
  );
  // Simplified totalWins calculation (estimate based on winRate and gamesPlayed)
  const totalWins = teamSummaries.reduce((sum, team) => {
    const estimatedWins = team.winRate * team.gamesPlayed;
    return sum + (isNaN(estimatedWins) ? 0 : estimatedWins);
  }, 0);
  const totalPlayers = teamSummaries.reduce(
    (sum, team) => sum + team.playerCount,
    0
  ); // Sum player counts

  // Filter and sort teams using new data structure
  const filteredAndSortedTeams = teamSummaries
    .filter((team) =>
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "wins": // Sort by winRate now
          return b.winRate - a.winRate;
        // case "recent": // Removed this option
        //   return (
        //     (b.mostRecentGameDate?.getTime() || 0) -
        //     (a.mostRecentGameDate?.getTime() || 0)
        //   );
        case "players": // Sort by playerCount
          return b.playerCount - a.playerCount;
        default:
          // name
          return a.teamName.localeCompare(b.teamName);
      }
    });

  return (
    <Container>
      {/* Use theme background, consistent padding/margin */}
      <div className="mb-8 bg-base-200 rounded-lg p-6 shadow-md">
        {" "}
        {/* Adjusted background to base-200 for header */}
        <h1 className="text-3xl font-bold mb-2 text-base-content">
          {" "}
          {/* Use theme text color */}
          Teams
        </h1>
        <p className="text-lg text-base-content/70">
          {" "}
          {/* Use theme text color with opacity */}
          Overview of all teams and their performance
        </p>
      </div>
      <TeamsSummaryStats
        totalTeams={totalTeams}
        totalGames={totalGames}
        totalWins={totalWins}
        totalPlayers={totalPlayers}
      />
      {/* Use theme background, consistent padding/shadow */}
      <div className="bg-base-200 rounded-lg p-6 shadow-md mb-6">
        {" "}
        {/* Adjusted background to base-200 */}
        <TeamsFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={(value) => setSortBy(value)}
        />
        <TeamsList teams={filteredAndSortedTeams} />
      </div>
    </Container> // Added closing Container
  );
};
