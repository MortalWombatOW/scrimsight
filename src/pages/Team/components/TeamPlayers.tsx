import { useParams, Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { allPlayersForTeamAtom } from "~/atoms/allPlayersForTeamAtom";
import { playerStatsForTeamAtom } from "~/atoms/metrics/contextualStatAtoms";
import { PlayerCard } from "~/components/Card/PlayerCard";
import { prettyFormat } from "~/lib/format";
import { ErrorMessage } from "~/components/Common/ErrorMessage";

// Component to render a single player card using the atom family
const PlayerCardLoader = ({
  teamName,
  playerId,
}: {
  teamName: string;
  playerId: string;
}) => {
  const playerStats = useAtomValue(
    playerStatsForTeamAtom({ teamName, playerId })
  );

  if (!playerStats) {
    // Optional: Add a loading state specific to the card
    return (
      <div className="card bg-base-200 shadow-md">
        <div className="card-body p-4">Loading {playerId}...</div>
      </div>
    );
  }

  const kda =
    playerStats.deaths === 0
      ? prettyFormat(
        playerStats.eliminations +
            (playerStats.offensiveAssists + playerStats.defensiveAssists)
      )
      : prettyFormat(
        (playerStats.eliminations +
            (playerStats.offensiveAssists + playerStats.defensiveAssists)) /
            playerStats.deaths
      );

  return (
    <Link to={`/players/${playerId}`} className="block">
      {" "}
      {/* Wrap card in Link */}
      <PlayerCard
        playerName={playerId}
        teamNames={[teamName]} // Team context is known
        heroes={["Overall"]} // Team-level stats don't have per-hero easily
        primaryStats={[{ value: kda, label: "Team KDA" }]} // Example stat for team performance
        secondaryStats={[
          {
            value: prettyFormat(playerStats.eliminationsPer10Minutes),
            label: "Elims/10",
          },
        ]} // Example stat
      />
    </Link>
  );
};

export const TeamPlayers = () => {
  const { teamId } = useParams<{ teamId: string }>(); // teamId is the teamName
  const allTeamPlayers = useAtomValue(allPlayersForTeamAtom);

  if (!teamId) {
    return <ErrorMessage message="Team ID not found in URL." />;
  }

  const teamData = allTeamPlayers.find((t) => t.teamName === teamId);

  if (!teamData) {
    return (
      <ErrorMessage message={`Player data not found for team ${teamId}.`} />
    );
  }

  const playerIds = teamData.players;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">
        Team Roster ({playerIds.length})
      </h2>
      {/* Use flex layout for cards */}
      <div className="flex flex-col md:flex-row flex-wrap gap-6">
        {playerIds.map((playerId) => (
          <PlayerCardLoader
            key={playerId}
            teamName={teamId}
            playerId={playerId}
          />
        ))}
      </div>
    </div>
  );
};
