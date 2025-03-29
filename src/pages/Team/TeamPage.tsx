import { useParams, NavLink, Outlet } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { teamNamesAtom } from "../../atoms/teamNamesAtom";
import { teamStatsAtom } from "../../atoms/teamStatsAtom";
// Removed unused imports: allPlayersForTeamAtom, matchDataAtom
// Removed unused component imports: TeamOverview, TeamPlayers, TeamMatches, TeamCompositions
import { StatCard } from "../../components/StatCard";
import { ErrorMessage } from "../../components/Common/ErrorMessage";

const NavTab = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <NavLink
    to={to}
    end // Important for the index route matching
    className={({ isActive }) =>
      `tab tab-bordered ${
        isActive ? "tab-active !border-primary !text-primary" : ""
      }`
    }
  >
    {children}
  </NavLink>
);

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Team Header - Remains the same */}
      <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-6">
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

      {/* Sub-route Navigation and Content */}
      <div className="bg-base-100 rounded-lg shadow-lg border border-base-300">
        {/* Navigation Links styled as Tabs */}
        <div role="tablist" className="tabs tabs-bordered">
          <NavTab to=".">Overview</NavTab>
          <NavTab to="players">Players</NavTab>
          <NavTab to="matches">Matches</NavTab>
          <NavTab to="compositions">Compositions</NavTab>
        </div>

        {/* Outlet for rendering sub-route components */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
