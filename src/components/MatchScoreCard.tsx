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
    // Apply consistent card styling to the main container
    <div className="bg-base-200 border border-gray-700 border-gray-700 shadow-md rounded-lg p-6 w-fit">
      {" "}
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
                {/* Use slightly darker background for inner card, consistent rounding */}
                <div className="bg-base-300 p-2 rounded-md">
                  <span className="text-center text-sm text-base-content">
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
          {/* Use slightly darker background for inner card, consistent rounding */}
            <div className="bg-base-300 rounded-lg w-full p-4">
              <div className="flex items-center gap-2 justify-center mb-4">
                <GoTrophy className="text-base-content/70" size={18} />
              <span className="text-lg font-bold">
                {matchData.team1Score > matchData.team2Score
                  ? matchData.team1Name
                  : matchData.team2Score > matchData.team1Score
                    ? matchData.team2Name
                    : "Draw"}
              </span>
            </div>
            {/* Ensure stats component uses theme colors and rounding */}
            <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 text-base-content rounded-lg">
              <div className="stat">
                <div className="stat-title text-base-content/70">
                  {matchData.team1Name}
                </div>
                <div className="stat-value text-2xl">
                  {matchData.team1Score}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title text-base-content/70">
                  {matchData.team2Name}
                </div>
                <div className="stat-value text-2xl">
                  {matchData.team2Score}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
