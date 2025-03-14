import { useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { teamNamesAtom } from "../../atoms/teamNamesAtom";
import { teamStatsAtom } from "../../atoms/teamStatsAtom";
import { allPlayersForTeamAtom } from "../../atoms/allPlayersForTeamAtom";
import { matchDataAtom } from "../../atoms/matchDataAtom";
import { MatchData } from "../../atoms/matchDataAtom";
import { TeamStats } from "../../atoms/teamStatsAtom";
import { TeamPlayers } from "../../atoms/allPlayersForTeamAtom";
import { StatCard } from "../../components/StatCard";
import { TeamCompositions } from "./TeamCompositions";

export const TeamPage = () => {
  const { teamName } = useParams();
  const [teamNames] = useAtom(teamNamesAtom);
  const [teamStats] = useAtom(teamStatsAtom);
  const [players] = useAtom(allPlayersForTeamAtom);
  const [matches] = useAtom(matchDataAtom);

  const teamNameSafe = teamName || "";
  const teamRecord: TeamStats = teamStats.find(
    (stat: TeamStats) => stat.teamName === teamNameSafe
  ) || {
    teamName: "",
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    mostRecentGameDate: null,
    players: [],
  };
  const teamPlayers: TeamPlayers = players.find(
    (team: TeamPlayers) => team.teamName === teamNameSafe
  ) || { teamName: "", players: [] };
  const teamMatches = matches.filter(
    (match: MatchData) =>
      match.team1Name === teamNameSafe || match.team2Name === teamNameSafe
  );

  const teamNameDisplay: string = String(
    teamNames[teamNameSafe as keyof typeof teamNames] || teamNameSafe
  );

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 dark:bg-base-800">
        <h1 className="text-3xl font-bold mb-4 text-base-900 dark:text-white">
          {teamNameDisplay}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-fit">
          <div>
            <StatCard
              title="Wins"
              value={teamRecord.wins.toString()}
              color="success.light"
            />
          </div>
          <div>
            <StatCard
              title="Draws"
              value={teamRecord.draws.toString()}
              color="warning.light"
            />
          </div>
          <div>
            <StatCard
              title="Losses"
              value={teamRecord.losses.toString()}
              color="error.light"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6 dark:bg-base-800">
        <h2 className="text-xl font-semibold mb-4 text-base-900 dark:text-white">
          Players
        </h2>
        <ul className="divide-y divide-base-200 dark:divide-base-700">
          {teamPlayers.players.map((playerName: string) => (
            <li key={playerName} className="py-3">
              <p className="text-base-800 dark:text-base-200">{playerName}</p>
            </li>
          ))}
        </ul>
      </div>

      <TeamCompositions teamName={teamNameSafe} />

      <div className="bg-white rounded-lg shadow-md p-4 dark:bg-base-800">
        <h2 className="text-xl font-semibold mb-4 text-base-900 dark:text-white">
          Games Played
        </h2>
        <ul className="divide-y divide-base-200 dark:divide-base-700">
          {teamMatches.map((match: MatchData) => (
            <li key={match.matchId} className="py-3">
              <p className="text-base-800 dark:text-base-200">
                {`${match.team1Name} vs ${match.team2Name} - ${match.dateString}`}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
