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
    <div className="bg-white rounded-lg border border-gray-200 w-full p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col gap-2 min-w-[300px]">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4 flex items-center justify-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Round
            </span>
          </div>
          <div className="col-span-8 flex items-center justify-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Winner
            </span>
          </div>
        </div>

        {matchData.roundWinners.map((winner, index) => (
          <div key={index} className="grid grid-cols-12 gap-2">
            <div className="col-span-4 flex items-center justify-center">
              <span className="text-gray-800 dark:text-gray-200">
                {index + 1}
              </span>
            </div>
            <div className="col-span-8">
              <div
                className={`
                  p-2 text-center rounded 
                  ${
                    winner === "team1"
                      ? "bg-blue-700 text-white"
                      : winner === "team2"
                      ? "bg-red-700 text-white"
                      : "bg-gray-700 text-white"
                  }
                `}
              >
                <span>
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

        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-4 flex items-center justify-center">
            <div className="flex items-center gap-1">
              <GoTrophy
                size={16}
                className="text-gray-800 dark:text-gray-200"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Winner
              </span>
            </div>
          </div>
          <div className="col-span-8">
            <div
              className={`
                p-2 text-center rounded 
                ${
                  matchData.team1Score > matchData.team2Score
                    ? "bg-blue-700 text-white"
                    : matchData.team2Score > matchData.team1Score
                    ? "bg-red-700 text-white"
                    : "bg-gray-700 text-white"
                }
              `}
            >
              <span className="font-bold block mb-2">
                {matchData.team1Score > matchData.team2Score
                  ? matchData.team1Name
                  : matchData.team2Score > matchData.team1Score
                  ? matchData.team2Name
                  : "Draw"}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-white bg-blue-700 p-2 rounded">
                  <h2 className="text-xl font-bold text-white text-center">
                    {matchData.team1Score}
                  </h2>
                </div>
                <div className="border border-white bg-red-800 p-2 rounded">
                  <h2 className="text-xl font-bold text-white text-center">
                    {matchData.team2Score}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
