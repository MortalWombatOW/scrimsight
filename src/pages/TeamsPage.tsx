import { useState, useMemo } from "react";
import { TeamsSummaryStats, TeamsFilter, TeamsList, Page, Card } from "@components";
import { useMatches } from "../hooks/useRepository";

type SortOption = "name" | "wins" | "players";

export const TeamsPage = () => {
  const matches = useMatches();

  const teamSummaries = useMemo(() => {
    const teamMap = new Map<string, { wins: number; losses: number; draws: number; playerCount: number }>();

    for (const match of matches) {
      const { team1Name, team2Name, winner, team1Players, team2Players } = match.metadata;

      if (!teamMap.has(team1Name)) {
        teamMap.set(team1Name, { wins: 0, losses: 0, draws: 0, playerCount: team1Players.length });
      }
      if (!teamMap.has(team2Name)) {
        teamMap.set(team2Name, { wins: 0, losses: 0, draws: 0, playerCount: team2Players.length });
      }

      const team1Data = teamMap.get(team1Name)!;
      const team2Data = teamMap.get(team2Name)!;

      if (winner === team1Name) {
        team1Data.wins++;
        team2Data.losses++;
      } else if (winner === team2Name) {
        team2Data.wins++;
        team1Data.losses++;
      } else {
        team1Data.draws++;
        team2Data.draws++;
      }
    }

    return Array.from(teamMap.entries()).map(([teamName, data]) => ({
      teamName,
      playerCount: data.playerCount,
      winRate: data.wins / (data.wins + data.losses + data.draws),
      gamesPlayed: data.wins + data.losses + data.draws,
      firstKillWinRate: 0, // TODO: Calculate from teamfight data
    }));
  }, [matches]);
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
    <Page>
      <Page.Header
        title="Teams"
        subtitle="Overview of all teams and their performance"
      />

      <Page.Content>
        <TeamsSummaryStats
          totalTeams={totalTeams}
          totalGames={totalGames}
          totalWins={totalWins}
          totalPlayers={totalPlayers}
        />
        {/* Use theme background, consistent padding/shadow */}
        <Card className="p-6 mb-6">
          <TeamsFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={(value) => setSortBy(value)}
          />
          <TeamsList teams={filteredAndSortedTeams} />
        </Card>
      </Page.Content>
    </Page>
  );
};

export default TeamsPage;
