import { useAtomValue } from "jotai";
import { matchDataAtom } from "../../atoms";
import { scrimAtom } from "../../atoms/scrimAtom";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../../lib";
import { CiMap } from "react-icons/ci";

interface Scrim {
  id: string;
  matchIds: string[];
  // Add other properties as needed
}

export const ScrimsPage = () => {
  const navigate = useNavigate();
  const scrims = useAtomValue(scrimAtom);
  const matchData = useAtomValue(matchDataAtom);

  if (scrims.length === 0) {
    console.log("No scrims found, redirecting to home");
    navigate("/");
    return null;
  }

  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Scrims</h1>

      <div className="space-y-6">
        {scrims.map((scrim: Scrim) => (
          <div
            key={`${scrim.team1Name}-${scrim.team2Name}-${scrim.dateString}`}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body p-6">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {scrim.team1Name} vs {scrim.team2Name}
                </h2>
                <div className="badge badge-lg">{scrim.dateString}</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="stat bg-base-200 rounded-lg p-4">
                  <div className="stat-title">Duration</div>
                  <div className="stat-value text-xl">
                    {formatTime(scrim.duration)}
                  </div>
                </div>
                <div className="stat bg-base-200 rounded-lg p-4">
                  <div className="stat-title">Match Score</div>
                  <div className="stat-value text-xl">
                    {scrim.team1Wins} - {scrim.team2Wins}
                    {scrim.draws > 0 && ` (${scrim.draws} draws)`}
                  </div>
                </div>
                <div className="stat bg-base-200 rounded-lg p-4">
                  <div className="stat-title">Total Matches</div>
                  <div className="stat-value text-xl">
                    {scrim.matchIds.length}
                  </div>
                </div>
              </div>

              {/* Matches Section */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium mb-3">Matches</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scrim.matchIds.map((matchId) => {
                    const match = matchData.find((m) => m.matchId === matchId);
                    if (!match) return null;

                    const isTeam1Winner = match.team1Score > match.team2Score;
                    const isTeam2Winner = match.team2Score > match.team1Score;

                    return (
                      <div
                        key={matchId}
                        className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
                        onClick={() => navigate(`/matches/${matchId}`)}
                      >
                        <div className="card-body p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CiMap className="text-xl" />
                            <span className="font-medium">{match.map}</span>
                            <div className="badge badge-outline">
                              {match.mode}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div
                              className={`text-base ${
                                isTeam1Winner ? "font-bold" : ""
                              }`}
                            >
                              {match.team1Name}
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`${
                                  isTeam1Winner ? "font-bold" : ""
                                }`}
                              >
                                {match.team1Score}
                              </span>
                              <span>-</span>
                              <span
                                className={`${
                                  isTeam2Winner ? "font-bold" : ""
                                }`}
                              >
                                {match.team2Score}
                              </span>
                            </div>
                            <div
                              className={`text-base ${
                                isTeam2Winner ? "font-bold" : ""
                              }`}
                            >
                              {match.team2Name}
                            </div>
                          </div>
                          <div className="text-sm text-base-content/70 mt-2">
                            Duration: {formatTime(match.duration)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(
                      `/scrims/${scrim.team1Name}--${scrim.team2Name}--${scrim.dateString}`
                    )
                  }
                >
                  View Full Scrim Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
