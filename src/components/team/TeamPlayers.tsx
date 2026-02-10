import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { PlayerCard } from "../player/PlayerCard";
import { ErrorMessage } from "../ui/ErrorMessage";
import { formatStat } from "@library";
import { useMatches } from "../../hooks/useRepository";

// Component to render a single player card
const PlayerCardLoader = ({
  teamName,
  playerId,
  matches,
}: {
  teamName: string;
  playerId: string;
  matches: ReturnType<typeof useMatches>;
}) => {
  const playerStats = useMemo(() => {
    let eliminations = 0;
    let deaths = 0;
    let offensiveAssists = 0;
    let defensiveAssists = 0;
    let totalPlaytime = 0;

    for (const match of matches) {
      for (const stat of match.playerStats.rows) {
        if (stat.playerName === playerId && stat.playerTeam === teamName) {
          eliminations += stat.eliminations;
          deaths += stat.deaths;
          offensiveAssists += stat.offensiveAssists;
          defensiveAssists += stat.defensiveAssists;
          totalPlaytime += stat.playtime;
        }
      }
    }

    const playtimeMinutes = totalPlaytime / 60;
    const eliminationsPer10 = playtimeMinutes > 0 ? (eliminations / playtimeMinutes) * 10 : 0;

    return {
      eliminations,
      deaths,
      offensiveAssists,
      defensiveAssists,
      eliminationsPer10Minutes: eliminationsPer10,
    };
  }, [playerId, teamName, matches]);

  const kda =
    playerStats.deaths === 0
      ? formatStat('eliminations',
        playerStats.eliminations +
            (playerStats.offensiveAssists + playerStats.defensiveAssists)
      )
      : formatStat('eliminations',
        (playerStats.eliminations +
            (playerStats.offensiveAssists + playerStats.defensiveAssists)) /
            playerStats.deaths
      );

  return (
    <Link to={`/player/${playerId}`} className="block">
      <PlayerCard
        playerName={playerId}
        teamNames={[teamName]}
        heroes={["Overall"]}
        primaryStats={[{ value: kda, label: "Team KDA" }]}
        secondaryStats={[
          {
            value: formatStat('eliminationsPer10Minutes', playerStats.eliminationsPer10Minutes),
            label: "Elims/10",
          },
        ]}
      />
    </Link>
  );
};

export const TeamPlayers = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const matches = useMatches();

  const playerIds = useMemo(() => {
    const playersSet = new Set<string>();

    for (const match of matches) {
      for (const stat of match.playerStats.rows) {
        if (stat.playerTeam === teamId) {
          playersSet.add(stat.playerName);
        }
      }
    }

    return Array.from(playersSet).sort();
  }, [teamId, matches]);

  if (!teamId) {
    return <ErrorMessage message="Team ID not found in URL." />;
  }

  if (playerIds.length === 0) {
    return (
      <ErrorMessage message={`No players found for team ${teamId}.`} />
    );
  }

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
            matches={matches}
          />
        ))}
      </div>
    </div>
  );
};
