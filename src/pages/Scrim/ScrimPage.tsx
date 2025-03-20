import { useAtomValue } from "jotai";
import { scrimAtom, matchDataAtom } from "../../atoms";
import { formatTime, mapNameToFileName } from "../../lib";
import { CiMap } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { TbTournament } from "react-icons/tb";
import { Link, useParams } from "react-router-dom"; // Import the Link component

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

  // Calculate additional stats
  const team1WinRate = (
    (scrim.team1Wins / scrim.matchIds.length) *
    100
  ).toFixed(1);
  const team2WinRate = (
    (scrim.team2Wins / scrim.matchIds.length) *
    100
  ).toFixed(1);
  const drawRate = ((scrim.draws / scrim.matchIds.length) * 100).toFixed(1);

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

      {/* Teams Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Team 1 Stats */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl">{team1Name}</h2>
            <div className="stats stats-vertical shadow">
              <div className="stat">
                <div className="stat-title">Wins</div>
                <div className="stat-value text-xl">{scrim.team1Wins}</div>
                <div className="stat-desc">{team1WinRate}% win rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Team 2 Stats */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl">{team2Name}</h2>
            <div className="stats stats-vertical shadow">
              <div className="stat">
                <div className="stat-title">Wins</div>
                <div className="stat-value text-xl">{scrim.team2Wins}</div>
                <div className="stat-desc">{team2WinRate}% win rate</div>
              </div>
            </div>
          </div>
        </div>
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
              {scrim.draws > 0 && (
                <div className="stat-desc">
                  {scrim.draws} draws ({drawRate}%)
                </div>
              )}
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
                  className="card bg-base-200 hover:bg-base-300 transition-colors block" // Added 'block' to make the entire card clickable
                >
                  <div className="card-body p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Map Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-48 h-28 overflow-hidden rounded-lg">
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
                      <div className="flex flex-col flex-grow gap-3">
                        <div className="flex items-center gap-3">
                          <div className="badge badge-lg">{`Match ${
                            index + 1
                          }`}</div>
                          <div className="badge badge-outline">
                            {match.mode}
                          </div>
                          <div className="flex items-center gap-2 text-base-content/70 ml-auto">
                            <IoTimeOutline />
                            {formatTime(match.duration)}
                          </div>
                        </div>

                        {/* Score Section */}
                        <div className="flex items-center justify-center gap-8 bg-base-300 p-4 rounded-lg">
                          <div
                            className={`text-center ${
                              isTeam1Winner ? "font-bold" : ""
                            }`}
                          >
                            <div className="text-xl font-bold">
                              {match.team1Name}
                            </div>
                            <div className="text-3xl font-mono mt-1">
                              {match.team1Score}
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-base-content/30">
                            VS
                          </div>
                          <div
                            className={`text-center ${
                              isTeam2Winner ? "font-bold" : ""
                            }`}
                          >
                            <div className="text-xl font-bold">
                              {match.team2Name}
                            </div>
                            <div className="text-3xl font-mono mt-1">
                              {match.team2Score}
                            </div>
                          </div>
                        </div>

                        {/* Match Result */}
                        <div className="text-center">
                          {isDraw ? (
                            <span className="text-base-content/70">Draw</span>
                          ) : (
                            <span className="text-primary font-medium">
                              {isTeam1Winner
                                ? match.team1Name
                                : match.team2Name}{" "}
                              Victory
                            </span>
                          )}
                        </div>
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
