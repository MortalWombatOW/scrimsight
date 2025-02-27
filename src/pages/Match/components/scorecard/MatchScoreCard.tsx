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
    <div className="bg-white rounded-lg border border-gray-200 w-full p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col gap-4 min-w-[300px]">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
          <div className="col-span-4 flex items-center justify-center">
            <span className="font-medium text-sm text-gray-600 dark:text-gray-400">
              Round
            </span>
          </div>
          <div className="col-span-8 flex items-center justify-center">
            <span className="font-medium text-sm text-gray-600 dark:text-gray-400">
              Winner
            </span>
          </div>
        </div>

        {/* Round Results */}
        {matchData.roundWinners.map((winner, index) => (
          <div key={index} className="grid grid-cols-12 gap-2">
            <div className="col-span-4 flex items-center justify-center">
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                {index + 1}
              </span>
            </div>
            <div className="col-span-8">
              <div
                className={`
                  p-2 text-center rounded border
                  ${
                    winner === "team1"
                      ? "bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                      : winner === "team2"
                      ? "bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                      : "bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  }
                `}
              >
                <span className="text-gray-800 dark:text-gray-200 font-medium">
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

        {/* Final Result */}
        <div className="grid grid-cols-12 gap-2 pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="col-span-4 flex items-center justify-center">
            <div className="flex items-center gap-1">
              <GoTrophy
                size={18}
                className="text-gray-700 dark:text-gray-300"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Winner
              </span>
            </div>
          </div>
          <div className="col-span-8">
            <div
              className={`
                p-4 text-center rounded border border-gray-300 bg-gray-50 
                dark:bg-gray-700 dark:border-gray-600
              `}
            >
              <span className="font-bold text-gray-900 dark:text-gray-100 block mb-3">
                {matchData.team1Score > matchData.team2Score
                  ? matchData.team1Name
                  : matchData.team2Score > matchData.team1Score
                  ? matchData.team2Name
                  : "Draw"}
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-300 bg-white p-3 rounded shadow-sm dark:bg-gray-800 dark:border-gray-600">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
                    {matchData.team1Score}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    {matchData.team1Name}
                  </p>
                </div>
                <div className="border border-gray-300 bg-white p-3 rounded shadow-sm dark:bg-gray-800 dark:border-gray-600">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
                    {matchData.team2Score}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    {matchData.team2Name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
