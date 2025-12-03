import { useParams, Outlet } from "react-router-dom";
import { useMemo } from "react";
import { StatCard, ErrorMessage, SubPageNavigation } from "@components";
import { Container } from "@components";
import { useMatches } from "../hooks/useRepository";

export const TeamPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const matches = useMatches();

  const teamRecord = useMemo(() => {
    if (!teamId) return null;

    const stats = {
      teamName: teamId,
      wins: 0,
      losses: 0,
      draws: 0,
      gamesPlayed: 0,
    };

    for (const match of matches) {
      const { team1Name, team2Name, winner } = match.metadata;

      if (team1Name === teamId) {
        stats.gamesPlayed++;
        if (winner === teamId) {
          stats.wins++;
        } else if (winner === team2Name) {
          stats.losses++;
        } else {
          stats.draws++;
        }
      } else if (team2Name === teamId) {
        stats.gamesPlayed++;
        if (winner === teamId) {
          stats.wins++;
        } else if (winner === team1Name) {
          stats.losses++;
        } else {
          stats.draws++;
        }
      }
    }

    return stats.gamesPlayed > 0 ? stats : null;
  }, [teamId, matches]);

  if (!teamId) {
    return <ErrorMessage message="Team ID not provided" />;
  }

  if (!teamRecord) {
    return <ErrorMessage message="Team not found" />;
  }

  const teamNameDisplay = teamId;
  const winRate = (teamRecord.wins / teamRecord.gamesPlayed) * 100 || 0;

  const teamNavItems = [
    { path: `/teams/${teamId}`, label: "Overview", end: true },
    { path: `/teams/${teamId}/players`, label: "Players" },
    { path: `/teams/${teamId}/matches`, label: "Matches" },
    { path: `/teams/${teamId}/compositions`, label: "Compositions" },
  ];

  return (
    <Container>
      {" "}
      {/* Added Container */}
      {/* Team Header - Apply consistent card styling */}
      <div className="bg-base-200 border border-gray-700 border-gray-700 shadow-md rounded-lg p-6 mb-6">
        {" "}
        {/* Updated classes */}
        <h1 className="text-4xl font-bold mb-4 text-primary">
          {teamNameDisplay}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Win Rate" value={`${winRate.toFixed(1)}%`} />
          <StatCard title="Wins" value={teamRecord.wins.toString()} />
          <StatCard title="Losses" value={teamRecord.losses.toString()} />
          <StatCard title="Draws" value={teamRecord.draws.toString()} />
        </div>
      </div>
      {/* Sub-route Navigation and Content - Apply consistent card styling */}
      <div className="bg-base-200 border border-gray-700 border-gray-700 shadow-md rounded-lg">
        {" "}
        {/* Updated classes */}
        {/* Navigation Links using SubPageNavigation */}
        {/* Note: Removed border border-gray-700 class from outer div as tabs-boxed includes padding */}
        <SubPageNavigation navItems={teamNavItems} />
        {/* Outlet for rendering sub-route components */}
        <div className="p-6 pt-0">
          {" "}
          {/* Adjusted padding top */}
          <Outlet />
        </div>
      </div>
    </Container> // Added closing Container
  );
};

export default TeamPage;
