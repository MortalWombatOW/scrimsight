import { type ReactNode } from "react";
// Removed useStats import
import { useAtomValue } from "jotai";
import { MatchData, matchDataAtom } from "../../../atoms/matchDataAtom";
import { useParams } from "react-router-dom"; // Removed unused Link
import { MatchCard } from "../../../components/Card/MatchCard";
import { formatTime } from "../../../lib/format";

export const PlayerMatches = (): ReactNode => {
  const { playerName } = useParams<{ playerName: string }>();
  const allMatches = useAtomValue(matchDataAtom);

  if (!playerName) {
    return <div>Player name not found in URL.</div>;
  }

  // Filter matches where the player participated
  const playerMatches = allMatches.filter(
    (match) =>
      match.team1Players.includes(playerName) ||
      match.team2Players.includes(playerName)
  ).sort( // Sort by date descending
     (a, b) => new Date(b.dateString).getTime() - new Date(a.dateString).getTime()
  );


  return (
    <div className="space-y-4"> {/* Use space-y for consistency */}
      <h2 className="text-2xl font-semibold mb-4">Match History</h2>
       {/* Use flex layout for cards */}
       <div className="flex flex-col md:flex-row flex-wrap gap-6">
        {playerMatches.length > 0 ? (
          playerMatches.map((match: MatchData) => (
            <MatchCard
              key={match.matchId}
              title={`${match.map} (${match.mode})`}
              teamNames={[match.team1Name, match.team2Name]}
              date={match.dateString} // Assuming dateString is display-ready
              mapName={match.map}
              primaryStats={[
                { value: `${match.team1Score} - ${match.team2Score}`, label: "Score" },
              ]}
              secondaryStats={[
                { value: formatTime(match.duration), label: "Duration" },
                // Could add player's hero for this match if needed, requires fetching player stats
              ]}
              linkUrl={`/matches/${match.matchId}`}
            />
          ))
        ) : (
          <div className="w-full text-center p-6 text-base-content/70">
            No matches found for this player.
          </div>
        )}
      </div>
    </div>
  );
};
