import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { matchDataAtom } from "@atoms/matchDataAtom"; // Removed unused MatchData type
import {
  teamStatsForMatchAtom,
  // Removed unused playerStatsForMatchAtom
} from "@atoms/metrics/contextualStatAtoms";
import { MatchCard } from "@components/Card/MatchCard";
import { TeamCard } from "@components/Card/TeamCard";
// Removed unused PlayerCard
import { formatTime, prettyFormat } from "@lib"; // Import formatters
// Removed PlayerStatsComparison import
import { TeamStatsComparison } from "@pages/Match/components/stats/TeamStatsComparison";
import KillsTable from "@components/KillsTable/KillsTable";

export const MatchOverviewPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const allMatches = useAtomValue(matchDataAtom);

  if (!matchId) {
    return <div className="text-center p-4">No match ID provided.</div>;
  }

  const match = allMatches.find((m) => m.matchId === matchId);

  if (!match) {
    return <div className="text-center p-4">Match not found.</div>;
  }

  // Fetch contextual stats using the atoms (components to handle loading/undefined states)
  const TeamStatsDisplay = ({ teamName }: { teamName: string }) => {
    const teamStats = useAtomValue(
      teamStatsForMatchAtom({ matchId, teamName })
    );
    if (!teamStats) return null; // Or loading indicator
    // TODO: Define relevant stats for TeamCard based on teamStats structure
    return (
      <TeamCard
        teamName={teamName}
        playerNames={
          teamName === match.team1Name ? match.team1Players : match.team2Players
        }
        primaryStats={[
          { value: prettyFormat(teamStats.eliminations), label: "Elims" },
        ]} // Example stat
        secondaryStats={[
          { value: prettyFormat(teamStats.deaths), label: "Deaths" },
        ]} // Example stat
        linkUrl={`/teams/${teamName}`}
      />
    );
  };

  // Removed unused PlayerStatsDisplay function
  /*
  const PlayerStatsDisplay = ({ playerId }: { playerId: string }) => {
    const playerStatsRows = useAtomValue(
      playerStatsForMatchAtom({ matchId, playerId })
    );
    if (!playerStatsRows || playerStatsRows.length === 0) return null; // Or loading

    // Aggregate stats across heroes if needed, or display per hero
    // For simplicity, aggregate here (summing stats)
    const aggregatedStats = playerStatsRows.reduce((acc, row) => {
      Object.keys(row).forEach((key) => {
        if (typeof row[key as keyof typeof row] === "number") {
          acc[key as keyof typeof acc] =
            (acc[key as keyof typeof acc] || 0) +
            (row[key as keyof typeof row] as number);
        } else {
          // Keep first value for non-numerical keys like playerName
          if (!acc[key as keyof typeof acc]) {
            acc[key as keyof typeof acc] = row[key as keyof typeof row];
          }
        }
      });
      return acc;
    }, {} as any); // Use 'any' for simplicity in aggregation, refine if needed

    const kda =
      aggregatedStats.deaths === 0
        ? prettyFormat(
            aggregatedStats.eliminations +
              (aggregatedStats.offensiveAssists +
                aggregatedStats.defensiveAssists)
          )
        : prettyFormat(
            (aggregatedStats.eliminations +
              (aggregatedStats.offensiveAssists +
                aggregatedStats.defensiveAssists)) /
              aggregatedStats.deaths
          );

    return (
      <PlayerCard
        playerName={playerId}
        teamNames={[
          match.team1Players.includes(playerId)
            ? match.team1Name
            : match.team2Name,
        ]}
        heroes={playerStatsRows.map((r) => r.playerHero)} // List heroes played
        primaryStats={[{ value: kda, label: "KDA" }]} // Example stat
        secondaryStats={[
          {
            value: prettyFormat(aggregatedStats.heroDamageDealt),
            label: "Hero Dmg",
          },
        ]} // Example stat
        // Add linkUrl if PlayerCard supports it or wrap in Link
      />
    );
  };
  */

  // Removed unused allPlayerIds variable
  // const allPlayerIds = [...match.team1Players, ...match.team2Players];

  return (
    <div className="flex flex-col gap-6">
      {/* Overall Match Card */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <MatchCard
          title={`${match.map} (${match.mode})`}
          teamNames={[match.team1Name, match.team2Name]}
          date={match.dateString} // Assuming dateString is suitable for display
          mapName={match.map}
          primaryStats={[
            {
              value: `${match.team1Score} - ${match.team2Score}`,
              label: "Score",
            },
            { value: formatTime(match.duration), label: "Duration" },
          ]}
          // No link needed if already on the page
        />

        <TeamStatsComparison matchId={matchId} />
        <KillsTable matchId={matchId} />
      </div>

      {/* Team Cards */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        <TeamStatsDisplay teamName={match.team1Name} />
        <TeamStatsDisplay teamName={match.team2Name} />
      </div>

      {/* Player Cards */}
      {/* <h2 className="text-2xl font-semibold mt-4">Player Stats</h2>
      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        {allPlayerIds.map((playerId) => (
          <PlayerStatsDisplay key={playerId} playerId={playerId} />
        ))}
      </div> */}

      <div className="flex flex-col lg:flex-row gap-4"></div>
      {/* Removed PlayerStatsComparison component */}
    </div>
  );
};
