import { useState, useMemo, type ReactNode } from "react";
import { useParams } from "react-router-dom"; // Removed unused Link
import { useAtomValue } from "jotai";
import { MatchData, matchDataAtom } from "~/atoms/matchDataAtom";
// Removed unused: import { formatDate } from "../../../lib/date";
import { formatTime } from "~/lib/format";
import { ErrorMessage } from "~/components/Common/ErrorMessage";
import { MatchCard } from "~/components/Card/MatchCard"; // Import MatchCard

// Define a type for keys of MatchData that hold string values
type StringMatchDataKeys = {
  [K in keyof MatchData]: MatchData[K] extends string ? K : never;
}[keyof MatchData];

// Refined helper to get unique string values for filters
const getUniqueValues = (
  matches: MatchData[],
  key: StringMatchDataKeys
): string[] => [
  ...new Set(matches.map((m) => m[key])), // Now guaranteed to be string
];

const getUniqueOpponents = (matches: MatchData[], teamId: string) => [
  ...new Set(
    matches.map((m) => (m.team1Name === teamId ? m.team2Name : m.team1Name))
  ),
];

export const TeamMatches = (): ReactNode => {
  const { teamId } = useParams<{ teamId: string }>(); // Get teamId from URL
  const allMatches = useAtomValue(matchDataAtom); // Get all matches

  const [opponentFilter, setOpponentFilter] = useState<string>("");
  const [mapFilter, setMapFilter] = useState<string>("");
  const [modeFilter, setModeFilter] = useState<string>("");
  const [resultFilter, setResultFilter] = useState<string>(""); // 'win', 'loss', 'draw', ''

  // Filter matches for the current team first
  const teamMatches = useMemo(
    () =>
      allMatches.filter(
        (match) => match.team1Name === teamId || match.team2Name === teamId
      ),
    [allMatches, teamId]
  );

  // Sort the team's matches
  const sortedMatches = useMemo(
    () =>
      [...teamMatches].sort(
        (a, b) =>
          new Date(b.dateString).getTime() - new Date(a.dateString).getTime()
      ),
    [teamMatches]
  );

  // Calculate unique values based on the team's matches
  const uniqueOpponents = useMemo(() => {
    if (!teamId) return []; // Explicit check for teamId
    return getUniqueOpponents(teamMatches, teamId);
  }, [teamMatches, teamId]);
  const uniqueMaps = useMemo(() => getUniqueValues(teamMatches, "map"), [
    teamMatches,
  ]);
  const uniqueModes = useMemo(() => getUniqueValues(teamMatches, "mode"), [
    teamMatches,
  ]);

  // Filter the sorted team matches based on UI filters
  const filteredMatches = useMemo(() => {
    return sortedMatches.filter((match) => {
      const isTeam1 = match.team1Name === teamId;
      const teamScore = isTeam1 ? match.team1Score : match.team2Score;
      const opposingScore = isTeam1 ? match.team2Score : match.team1Score;
      const opposingTeam = isTeam1 ? match.team2Name : match.team1Name;
      const result =
        teamScore > opposingScore
          ? "win"
          : teamScore < opposingScore
            ? "loss"
            : "draw";

      if (opponentFilter && opposingTeam !== opponentFilter) return false;
      if (mapFilter && match.map !== mapFilter) return false;
      if (modeFilter && match.mode !== modeFilter) return false;
      if (resultFilter && result !== resultFilter) return false;
      return true;
    });
  }, [
    sortedMatches,
    opponentFilter,
    mapFilter,
    modeFilter,
    resultFilter,
    teamId, // Use teamId here
  ]);

  if (!teamId) {
    // Handle case where teamId is not available
    return <ErrorMessage message="Team ID not found in URL." />;
  }

  // Removed unused getResultBgClass function

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Match History</h2>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-base-200 rounded-lg">
        {/* Opponent Filter */}
        <div>
          <label className="label pb-1">
            <span className="label-text">Opponent</span>
          </label>
          <select
            className="select select-bordered select-sm w-full"
            value={opponentFilter}
            onChange={(e) => setOpponentFilter(e.target.value)}
          >
            <option value="">All</option>
            {uniqueOpponents.map((opp) => (
              <option key={opp} value={opp}>
                {opp}
              </option>
            ))}
          </select>
        </div>
        {/* Map Filter */}
        <div>
          <label className="label pb-1">
            <span className="label-text">Map</span>
          </label>
          <select
            className="select select-bordered select-sm w-full"
            value={mapFilter}
            onChange={(e) => setMapFilter(e.target.value)}
          >
            <option value="">All</option>
            {/* Use index as key */}
            {uniqueMaps.map((map, index) => (
              <option key={`map-filter-${index}`} value={map}>
                {map}
              </option>
            ))}
          </select>
        </div>
        {/* Mode Filter */}
        <div>
          <label className="label pb-1">
            <span className="label-text">Mode</span>
          </label>
          <select
            className="select select-bordered select-sm w-full"
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
          >
            <option value="">All</option>
            {/* Use index as key */}
            {uniqueModes.map((mode, index) => (
              <option key={`mode-filter-${index}`} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
        {/* Result Filter */}
        <div>
          <label className="label pb-1">
            <span className="label-text">Result</span>
          </label>
          <select
            className="select select-bordered select-sm w-full"
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="win">Win</option>
            <option value="loss">Loss</option>
            <option value="draw">Draw</option>
          </select>
        </div>
      </div>

      {/* Match Card List */}
      <div className="flex flex-col md:flex-row flex-wrap gap-6">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
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
                // Add opponent if needed, requires knowing which team is 'us' vs 'them'
                // { value: match.team1Name === teamId ? match.team2Name : match.team1Name, label: "Opponent"}
              ]}
              linkUrl={`/matches/${match.matchId}`}
            />
          ))
        ) : (
          <div className="w-full text-center p-6 text-base-content/70">
            No matches found matching the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};
