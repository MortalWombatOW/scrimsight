import { useParams, Outlet } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { teamNamesAtom } from "../../atoms/teamNamesAtom";
import { teamStatsAtom } from "../../atoms/teamStatsAtom";
// Removed unused imports: allPlayersForTeamAtom, matchDataAtom
// Removed unused component imports: TeamOverview, TeamPlayers, TeamMatches, TeamCompositions
import { StatCard } from "../../components/StatCard";
import { ErrorMessage } from "../../components/Common/ErrorMessage";
import { SubPageNavigation } from "../../components/Layout/SubPageNavigation";
import Container from "~/components/Container/Container"; // Added import

export const TeamPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [teamNames] = useAtom(teamNamesAtom);
  const teamStats = useAtomValue(teamStatsAtom);

  if (!teamId) {
    return <ErrorMessage message="Team ID not provided" />;
  }

  const teamRecord = teamStats.find((stat) => stat.teamName === teamId);

  // Basic check if team exists based on stats
  if (!teamRecord) {
    return <ErrorMessage message="Team not found" />;
  }

  const teamNameDisplay = String(
    teamNames[teamId as keyof typeof teamNames] || teamId
  );

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
