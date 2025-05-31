import { useAtomValue } from "jotai";
import { scrimAtom } from "@atoms/scrimAtom"; // Keep scrimAtom for finding the scrim
// Removed matchDataAtom import
// Removed duplicate imports below
import { formatTime, prettyFormat } from "@lib";
import { IoTimeOutline } from "react-icons/io5";
import { TbTournament } from "react-icons/tb";
import { useParams } from "react-router-dom"; // Removed unused Link
import { TeamCard } from "@components/Card/TeamCard";
import { PlayerCard } from "@components/Card/PlayerCard";
import { MatchCard } from "@components/Card/MatchCard"; // Import MatchCard
import {
  teamStatsForScrimAtom,
  playerStatsForScrimAtom,
  matchStatsForScrimAtom,
} from "@atoms/contextualStatAtoms"; // Import contextual atoms
import { MatchData } from "@atoms/matchDataAtom"; // Import MatchData type for matchStatsForScrimAtom
import Container from "@components/Container/Container"; // Added import

export const ScrimPage = () => {
  const { scrimId } = useParams<{ scrimId: string }>(); // Use the constructed scrimId
  const scrims = useAtomValue(scrimAtom);

  if (!scrimId)
    return <div className="text-center p-4">No Scrim ID provided.</div>;

  // Find the scrim using the constructed scrimId format
  const scrim = scrims.find(
    (s) => `${s.dateString}-${s.team1Name}-vs-${s.team2Name}` === scrimId
  );

  if (!scrim) return <div className="text-center p-4">Scrim not found.</div>;

  const {
    team1Name,
    team2Name,
    dateString,
    duration,
    team1Players,
    team2Players,
  } = scrim;
  const allPlayerIds = [...team1Players, ...team2Players];

  // Display components for contextual data
  const TeamStatsDisplay = ({ teamName }: { teamName: string }) => {
    const teamStats = useAtomValue(
      teamStatsForScrimAtom({ scrimId, teamName })
    );
    if (!teamStats)
      return (
        <div className="card bg-base-200 shadow">
          <div className="card-body p-4">Loading {teamName} stats...</div>
        </div>
      ); // Loading/Error state

    return (
      <TeamCard
        teamName={teamName}
        playerNames={teamName === team1Name ? team1Players : team2Players}
        primaryStats={[
          { value: prettyFormat(teamStats.eliminations), label: "Total Elims" },
        ]} // Example stat
        secondaryStats={[
          { value: prettyFormat(teamStats.deaths), label: "Total Deaths" },
        ]} // Example stat
        linkUrl={`/teams/${teamName}`}
      />
    );
  };

  const PlayerStatsDisplay = ({ playerId }: { playerId: string }) => {
    const playerStats = useAtomValue(
      playerStatsForScrimAtom({ scrimId, playerId })
    );
    if (!playerStats) return null; // Loading handled elsewhere or skip card

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
      <PlayerCard
        playerName={playerId}
        teamNames={[team1Players.includes(playerId) ? team1Name : team2Name]}
        heroes={["Overall"]} // Scrim-level stats don't have per-hero breakdown easily here
        primaryStats={[{ value: kda, label: "Scrim KDA" }]} // Example stat
        secondaryStats={[
          {
            value: prettyFormat(playerStats.heroDamageDealt),
            label: "Total Hero Dmg",
          },
        ]} // Example stat
        // Add linkUrl if PlayerCard supports it or wrap in Link
      />
    );
  };

  const MatchListDisplay = () => {
    const matches = useAtomValue(matchStatsForScrimAtom({ scrimId }));
    if (!matches || matches.length === 0)
      return <p>No match data found for this scrim.</p>;

    return (
      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        {matches.map((match: MatchData) => (
          <MatchCard
            key={match.matchId}
            title={`${match.map} (${match.mode})`}
            teamNames={[match.team1Name, match.team2Name]}
            date={match.dateString} // Or format differently if needed
            mapName={match.map}
            primaryStats={[
              {
                value: `${match.team1Score} - ${match.team2Score}`,
                label: "Score",
              },
            ]}
            secondaryStats={[
              { value: formatTime(match.duration), label: "Duration" },
            ]}
            linkUrl={`/matches/${match.matchId}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Container>
      {" "}
      {/* Added Container */}
      {/* Header Section - Apply consistent card styling */}
      <div className="bg-base-200 border border-gray-700 border-gray-700 shadow-md rounded-lg mb-6 p-6">
        {" "}
        {/* Changed div classes */}
        {/* Removed card-body, padding applied directly */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <TbTournament className="text-2xl" />
              Scrim: {team1Name} vs {team2Name}
            </h1>
            <p className="text-base-content/70 mt-1">{dateString}</p>
          </div>
          {/* Ensure stats component uses theme background/text */}
          <div className="stats shadow bg-base-100 text-base-content rounded-lg">
            {" "}
            {/* Added bg/text/radius */}
            <div className="stat place-items-center">
              <div className="stat-title text-base-content/70">
                Total Duration
              </div>{" "}
              {/* Adjusted text opacity */}
              <div className="stat-value text-xl flex items-center gap-2">
                <IoTimeOutline />
                {formatTime(duration)}
              </div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title text-base-content/70">
                Overall Score
              </div>{" "}
              {/* Adjusted text opacity */}
              <div className="stat-value text-xl">
                {scrim.team1Wins} - {scrim.team2Wins}{" "}
                {/* Ensure team1Wins/team2Wins exist on scrim object */}
              </div>
            </div>
          </div>
        </div>
        {/* Removed extra closing div here */}
      </div>
      {/* Team Cards with Scrim Stats */}
      <h2 className="text-2xl font-semibold mb-4">Team Performance</h2>
      <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
        <TeamStatsDisplay teamName={team1Name} />
        <TeamStatsDisplay teamName={team2Name} />
      </div>
      {/* Player Cards with Scrim Stats */}
      <h2 className="text-2xl font-semibold mb-4">Player Performance</h2>
      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6">
        {allPlayerIds.map((playerId) => (
          <PlayerStatsDisplay key={playerId} playerId={playerId} />
        ))}
      </div>
      {/* Match Cards */}
      <h2 className="text-2xl font-semibold mb-4">Matches</h2>
      <MatchListDisplay />
      {/* Removed Overall Stats Card and Matches Timeline */}
    </Container> // Added closing Container
  );
};
