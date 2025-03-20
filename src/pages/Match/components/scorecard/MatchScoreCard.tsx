import { GoTrophy } from "react-icons/go";

interface MatchScoreCardProps {
  matchData: {
    team1Name: string;
    team2Name: string;
    team1Score: number;
    team2Score: number;
    roundWinners: ("team1" | "team2" | "draw")[];
  };
}

export const MatchScoreCard = ({ matchData }: MatchScoreCardProps) => {
  return (
    <div className="card bg-base-100 w-fit">
      <div className="card-body p-6">
        <div className="flex flex-row flex-wrap gap-6 justify-center">
          {/* Round Results Section */}
          <div className="flex flex-col gap-2 min-w-[300px]">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4 text-center">
                <span className="text-sm text-base-500">Round</span>
              </div>
              <div className="col-span-8 text-center">
                <span className="text-sm text-base-500">Winner</span>
              </div>
            </div>

            <div className="divider my-0"></div>

            {matchData.roundWinners.map((winner, index) => (
              <div key={index} className="grid grid-cols-12 gap-2">
                <div className="col-span-4 flex justify-center items-center">
                  <div className="badge badge-sm">{index + 1}</div>
                </div>
                <div className="col-span-8">
                  <div className="card bg-base-200 p-2">
                    <span className="text-center text-sm">
                      {winner === "team1"
                        ? matchData.team1Name
                        : winner === "team2"
                        ? matchData.team2Name
                        : "Draw"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final Result Section */}
          <div className="min-w-[300px] flex items-start">
            <div className="card bg-base-200 w-full">
              <div className="card-body p-4">
                <div className="flex items-center gap-2 justify-center mb-4">
                  <GoTrophy className="text-base-500" size={18} />
                  <span className="text-lg font-bold">
                    {matchData.team1Score > matchData.team2Score
                      ? matchData.team1Name
                      : matchData.team2Score > matchData.team1Score
                      ? matchData.team2Name
                      : "Draw"}
                  </span>
                </div>

                <div className="stats stats-vertical lg:stats-horizontal shadow">
                  <div className="stat">
                    <div className="stat-title">{matchData.team1Name}</div>
                    <div className="stat-value text-2xl">
                      {matchData.team1Score}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">{matchData.team2Name}</div>
                    <div className="stat-value text-2xl">
                      {matchData.team2Score}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
