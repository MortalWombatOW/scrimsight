import { useParams } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { teamNamesAtom } from "../../atoms/teamNamesAtom";
import { teamStatsAtom } from "../../atoms/teamStatsAtom";
import { allPlayersForTeamAtom } from "../../atoms/allPlayersForTeamAtom";
import { matchDataAtom } from "../../atoms/matchDataAtom";
import { StatCard } from "../../components/StatCard";
import { TeamOverview } from "./components/TeamOverview";
import { TeamPlayers } from "./components/TeamPlayers";
import { TeamMatches } from "./components/TeamMatches";
import { TeamCompositions } from "./components/TeamCompositions";
import { ErrorMessage } from "../../components/Common/ErrorMessage";

export const TeamPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [teamNames] = useAtom(teamNamesAtom);
  const teamStats = useAtomValue(teamStatsAtom);
  const players = useAtomValue(allPlayersForTeamAtom);
  const matches = useAtomValue(matchDataAtom);

  if (!teamId) {
    return <ErrorMessage message="Team ID not provided" />;
  }

  const teamRecord = teamStats.find((stat) => stat.teamName === teamId);
  const teamPlayers = players.find((team) => team.teamName === teamId);
  const teamMatches = matches.filter(
    (match) => match.team1Name === teamId || match.team2Name === teamId
  );

  if (!teamRecord || !teamPlayers) {
    return <ErrorMessage message="Team not found" />;
  }

  const teamNameDisplay = String(
    teamNames[teamId as keyof typeof teamNames] || teamId
  );

  const winRate = (teamRecord.wins / teamRecord.gamesPlayed) * 100 || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
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

      <div className="bg-base-100 rounded-lg shadow-lg border border-base-300">
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
            <TeamPlayers teamName={teamId} />
          </div>

          <input
            type="radio"
            name="team_tabs"
            role="tab"
            className="tab"
            aria-label="Matches"
          />
          <div role="tabpanel" className="p-6">
            <TeamMatches matches={teamMatches} teamName={teamId} />
          </div>

          <input
            type="radio"
            name="team_tabs"
            role="tab"
            className="tab"
            aria-label="Compositions"
          />
          <div role="tabpanel" className="p-6">
            <TeamCompositions teamName={teamId} />
          </div>
        </div>
      </div>
    </div>
  );
};
