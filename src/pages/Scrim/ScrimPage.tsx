import { useAtomValue } from "jotai";
import { scrimAtom, matchDataAtom } from "../../atoms";
import { formatTime, mapNameToFileName } from "../../lib";
import { CiMap } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { TbTournament } from "react-icons/tb";
import { Link, useParams } from "react-router-dom"; // Import the Link component
import { TeamCard } from "../../components/Card/TeamCard";

export const ScrimPage = () => {
  const { scrimId } = useParams<{ scrimId: string }>();
  const scrims = useAtomValue(scrimAtom);
  const matchData = useAtomValue(matchDataAtom);

  if (!scrimId) return null;

  const [team1Name, team2Name, dateString] = scrimId.split("--");
  const scrim = scrims.find(
    (s) =>
      s.team1Name === team1Name &&
      s.team2Name === team2Name &&
      s.dateString === dateString
  );

  if (!scrim) return null;

  return (
    <div className="container mx-auto px-4  max-w-6xl">
      {/* Header Section */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <TbTournament className="text-2xl" />
                Scrim Details
              </h1>
              <p className="text-base-content/70 mt-1">{dateString}</p>
            </div>
            <div className="stats shadow">
              <div className="stat place-items-center">
                <div className="stat-title">Duration</div>
                <div className="stat-value text-xl flex items-center gap-2">
                  <IoTimeOutline />
                  {formatTime(scrim.duration)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
        <TeamCard
          teamName={team1Name}
          playerNames={scrim.team1Players}
          primaryStats={[
            { value: scrim.team1Wins.toString(), label: "Match Wins" },
          ]}
        />
        <TeamCard
          teamName={team2Name}
          playerNames={scrim.team2Players}
          primaryStats={[
            { value: scrim.team2Wins.toString(), label: "Match Wins" },
          ]}
        />
      </div>

      {/* Overall Stats */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title mb-4">Match Summary</h2>
          <div className="stats stats-horizontal shadow w-full">
            <div className="stat">
              <div className="stat-title">Total Matches</div>
              <div className="stat-value text-xl">{scrim.matchIds.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Score</div>
              <div className="stat-value text-xl">
                {scrim.team1Wins} - {scrim.team2Wins}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Avg. Match Duration</div>
              <div className="stat-value text-xl">
                {formatTime(Math.round(scrim.duration / scrim.matchIds.length))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matches Timeline */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Matches Timeline</h2>
          <div className="space-y-4">
            {scrim.matchIds.map((matchId, index) => {
              const match = matchData.find((m) => m.matchId === matchId);
              if (!match) return null;

              const isTeam1Winner = match.team1Score > match.team2Score;
              const isTeam2Winner = match.team2Score > match.team1Score;
              const isDraw = match.team1Score === match.team2Score;

              return (
                <Link // Wrap the card in a Link
                  key={matchId}
                  to={`/matches/${matchId}`} // Link to the match page
                  className={`card bg-base-200 hover:bg-base-300 transition-colors block border-l-4 ${
                    isDraw
                      ? "border-transparent" // Or use a neutral color like border-base-300
                      : isTeam1Winner
                      ? "border-success"
                      : "border-error"
                  }`}
                >
                  <div className="card-body p-3">
                    {" "}
                    {/* Changed p-4 to p-3 */}
                    <div className="flex flex-col lg:flex-row gap-3">
                      {" "}
                      {/* Changed gap-4 to gap-3 */}
                      {/* Map Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-40 h-24 overflow-hidden rounded-lg">
                          {" "}
                          {/* Changed w-48 h-28 to w-40 h-24 */}
                          <img
                            src={mapNameToFileName(match.map, false)}
                            alt={match.map}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <div className="flex items-center gap-2 text-white">
                              <CiMap className="text-xl" />
                              <span className="font-medium text-sm">
                                {match.map}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Match Details */}
                      <div className="flex flex-col flex-grow gap-2">
                        {/* Top Row: Match #, Mode, Duration */}
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-semibold">{`Match ${
                            index + 1
                          }`}</span>
                          <div className="badge badge-sm badge-outline">
                            {match.mode}
                          </div>
                          <div className="flex items-center gap-1 text-base-content/70 ml-auto">
                            <IoTimeOutline />
                            {formatTime(match.duration)}
                          </div>
                        </div>

                        {/* Score & Teams */}
                        <div className="flex items-center justify-between gap-4 py-2">
                          {/* Team 1 */}
                          <div
                            className={`flex items-center gap-3 ${
                              isTeam1Winner
                                ? "font-bold"
                                : "text-base-content/70"
                            }`}
                          >
                            <span className="text-lg">{match.team1Name}</span>
                          </div>
                          {/* Score */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-2xl font-semibold ${
                                isTeam1Winner ? "text-primary" : ""
                              }`}
                            >
                              {match.team1Score}
                            </span>
                            <span className="text-base-content/50">vs</span>
                            <span
                              className={`text-2xl font-semibold ${
                                isTeam2Winner ? "text-primary" : ""
                              }`}
                            >
                              {match.team2Score}
                            </span>
                          </div>
                          {/* Team 2 */}
                          <div
                            className={`flex items-center gap-3 justify-end ${
                              isTeam2Winner
                                ? "font-bold"
                                : "text-base-content/70"
                            }`}
                          >
                            <span className="text-lg text-right">
                              {match.team2Name}
                            </span>
                          </div>
                        </div>

                        {/* Removed Match Result Indicator Badge */}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
