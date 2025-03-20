import { useParams } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { teamNamesAtom } from "../../atoms/teamNamesAtom";
import { teamStatsAtom } from "../../atoms/teamStatsAtom";
import { allPlayersForTeamAtom } from "../../atoms/allPlayersForTeamAtom";
import { matchDataAtom } from "../../atoms/matchDataAtom";
import { teamCompositionsAtom } from "../../atoms/teamCompositionsAtom";
import { StatCard } from "../../components/StatCard";
import { TeamOverview } from "./components/TeamOverview";
import { TeamPlayers } from "./components/TeamPlayers";
import { TeamMatches } from "./components/TeamMatches";
import { TeamCompositions } from "./components/TeamCompositions";
import { ErrorMessage } from "../../components/Common/ErrorMessage";

export const TeamPage = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const [teamNames] = useAtom(teamNamesAtom);
  const teamStats = useAtomValue(teamStatsAtom);
  const players = useAtomValue(allPlayersForTeamAtom);
  const matches = useAtomValue(matchDataAtom);
  const compositions = useAtomValue(teamCompositionsAtom);

  if (!teamName) {
    return <ErrorMessage message="Team name not provided" />;
  }

  const teamRecord = teamStats.find((stat) => stat.teamName === teamName);
  const teamPlayers = players.find((team) => team.teamName === teamName);
  const teamMatches = matches.filter(
    (match) => match.team1Name === teamName || match.team2Name === teamName
  );

  if (!teamRecord || !teamPlayers) {
    return <ErrorMessage message="Team not found" />;
  }

  const teamNameDisplay = String(
    teamNames[teamName as keyof typeof teamNames] || teamName
  );

  const winRate = (teamRecord.wins / teamRecord.gamesPlayed) * 100 || 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header Section */}
      <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-4xl font-bold mb-4 text-primary">
          {teamNameDisplay}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Win Rate"
            value={`${winRate.toFixed(1)}%`}
            color="primary"
            trend="neutral"
          />
          <StatCard
            title="Wins"
            value={teamRecord.wins.toString()}
            color="success"
            trend="positive"
          />
          <StatCard
            title="Losses"
            value={teamRecord.losses.toString()}
            color="error"
            trend="negative"
          />
          <StatCard
            title="Draws"
            value={teamRecord.draws.toString()}
            color="warning"
            trend="neutral"
          />
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-base-100 rounded-lg shadow-lg">
        <div role="tablist" className="tabs tabs-bordered">
          <input
            type="radio"
            name="team_tabs"
            role="tab"
            className="tab"
            aria-label="Overview"
            defaultChecked
          />
          <div role="tabpanel" className="p-6">
            <TeamOverview teamStats={teamRecord} />
          </div>

          <input
            type="radio"
            name="team_tabs"
            role="tab"
            className="tab"
            aria-label="Players"
          />
          <div role="tabpanel" className="p-6">
            <TeamPlayers players={teamPlayers.players} teamName={teamName} />
          </div>

          <input
            type="radio"
            name="team_tabs"
            role="tab"
            className="tab"
            aria-label="Matches"
          />
          <div role="tabpanel" className="p-6">
            <TeamMatches matches={teamMatches} teamName={teamName} />
          </div>

          <input
            type="radio"
            name="team_tabs"
            role="tab"
            className="tab"
            aria-label="Compositions"
          />
          <div role="tabpanel" className="p-6">
            <TeamCompositions
              compositions={compositions.filter(
                (comp) => comp.teamName === teamName
              )}
              teamName={teamName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
