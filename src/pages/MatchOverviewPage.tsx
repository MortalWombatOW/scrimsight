import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { matchData, contextualStatAtoms } from "@library";
import { TeamCard, TeamStatsComparison, KillsTable } from "@components";
import { formatTime, prettyFormat, mapNameToFileName } from "@library";

export const MatchOverviewPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const allMatches = useAtomValue(matchData.atom);

  if (!matchId) {
    return <div className="text-center p-4">No match ID provided.</div>;
  }

  const match = allMatches.find((m) => m.matchId === matchId);

  if (!match) {
    return <div className="text-center p-4">Match not found.</div>;
  }

  const TeamStatsDisplay = ({ teamName }: { teamName: string }) => {
    const teamStats = useAtomValue(
      contextualStatAtoms.teamStatsForMatchAtom({ matchId, teamName })
    );
    if (!teamStats) return null;
    
    return (
      <TeamCard
        teamName={teamName}
        playerNames={
          teamName === match.team1Name ? match.team1Players : match.team2Players
        }
        primaryStats={[
          { value: prettyFormat(teamStats.eliminations), label: "Elims" },
        ]}
        secondaryStats={[
          { value: prettyFormat(teamStats.deaths), label: "Deaths" },
        ]}
        linkUrl={`/teams/${teamName}`}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Section - Match Summary */}
      <div className="glass-panel rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={mapNameToFileName(match.map, false)}
            alt={match.map}
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 z-0" />
        <div className="relative z-10">
          {/* Match Title */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gradient mb-2">
              {match.map}
            </h1>
            <p className="text-base-content/70 text-lg">{match.mode}</p>
          </div>

          {/* Live Match Card - Teams & Score */}
          <div className="flex items-center justify-center gap-8 mb-6">
            {/* Team 1 */}
            <div className="flex-1 text-right">
              <h2 className="text-2xl font-bold text-white mb-2">
                {match.team1Name}
              </h2>
              <div className="text-sm text-base-content/70">
                {match.team1Players.length} Players
              </div>
            </div>

            {/* Score */}
            <div className="glass-card px-8 py-6 rounded-xl">
              <div className="text-5xl font-bold text-center">
                <span className={match.team1Score > match.team2Score ? "text-primary" : "text-white"}>
                  {match.team1Score}
                </span>
                <span className="text-base-content/50 mx-3">:</span>
                <span className={match.team2Score > match.team1Score ? "text-primary" : "text-white"}>
                  {match.team2Score}
                </span>
              </div>
            </div>

            {/* Team 2 */}
            <div className="flex-1 text-left">
              <h2 className="text-2xl font-bold text-white mb-2">
                {match.team2Name}
              </h2>
              <div className="text-sm text-base-content/70">
                {match.team2Players.length} Players
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="flex justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-base-content/70">Duration:</span>
              <span className="font-semibold text-white">{formatTime(match.duration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base-content/70">Date:</span>
              <span className="font-semibold text-white">{match.dateString}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Statistics Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <TeamStatsDisplay teamName={match.team1Name} />
        <TeamStatsDisplay teamName={match.team2Name} />
      </div>

      {/* Team Stats Comparison */}
      <div className="glass-panel rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-white">Team Comparison</h2>
        <TeamStatsComparison matchId={matchId} />
      </div>

      {/* Kills Matrix */}
      <div className="glass-panel rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-white">Kill Matrix</h2>
        <KillsTable matchId={matchId} />
      </div>
    </div>
  );
};

export default MatchOverviewPage;
