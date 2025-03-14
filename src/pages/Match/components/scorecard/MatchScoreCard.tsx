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
    <div className="bg-white rounded-lg border border-base-200 p-6 shadow-sm dark:bg-base-800 dark:border-base-700 w-fit">
      <div className="flex flex-row flex-wrap gap-4 justify-center">
        <div className="flex flex-col gap-1 min-w-[300px]">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 border-base-200 dark:border-base-700 pb-3">
            <div className="col-span-4 flex items-center justify-center">
              <span className="font-medium text-sm text-base-600 dark:text-base-400">
                Round
              </span>
            </div>
            <div className="col-span-8 flex items-center justify-center">
              <span className="font-medium text-sm text-base-600 dark:text-base-400">
                Winner
              </span>
            </div>
          </div>

          {/* Round Results */}
          {matchData.roundWinners.map((winner, index) => (
            <div key={index} className="grid grid-cols-12 gap-2">
              <div className="col-span-4 flex items-center justify-center">
                <span className="text-base-800 dark:text-base-200 font-medium">
                  {index + 1}
                </span>
              </div>
              <div className="col-span-8">
                <div
                  className={`
                  p-2 text-center rounded border
                  ${
                    winner === "team1"
                      ? "bg-base-100 border-base-300 dark:bg-base-700 dark:border-base-600"
                      : winner === "team2"
                      ? "bg-base-200 border-base-300 dark:bg-base-700 dark:border-base-600"
                      : "bg-base-50 border-base-300 dark:bg-base-700 dark:border-base-600"
                  }
                `}
                >
                  <span className="text-base-800 dark:text-base-200 font-medium">
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
        <div className="min-w-[300px]">
          {/* Final Result */}
          <div className="grid grid-cols-12 gap-2 pt-4 mt-2 border-base-200 dark:border-base-700">
            <div className="col-span-12">
              <div
                className={`
                p-2 text-center rounded border border-base-300 bg-base-50 
                dark:bg-base-700 dark:border-base-600
              `}
              >
                <div className="flex items-center gap-2 justify-center">
                  <GoTrophy
                    size={18}
                    className="text-base-700 dark:text-base-300"
                  />
                  <span className="font-bold text-base-900 dark:text-base-100 block mb-2">
                    {matchData.team1Score > matchData.team2Score
                      ? matchData.team1Name
                      : matchData.team2Score > matchData.team1Score
                      ? matchData.team2Name
                      : "Draw"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-base-300 bg-white p-1 rounded shadow-sm dark:bg-base-800 dark:border-base-600">
                    <h2 className="text-xl font-bold text-base-800 dark:text-base-200 text-center">
                      {matchData.team1Score}
                    </h2>
                    <p className="text-xs text-base-500 dark:text-base-400 mt-1 text-center">
                      {matchData.team1Name}
                    </p>
                  </div>
                  <div className="border border-base-300 bg-white p-1 rounded shadow-sm dark:bg-base-800 dark:border-base-600">
                    <h2 className="text-xl font-bold text-base-800 dark:text-base-200 text-center">
                      {matchData.team2Score}
                    </h2>
                    <p className="text-xs text-base-500 dark:text-base-400 mt-1 text-center">
                      {matchData.team2Name}
                    </p>
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
