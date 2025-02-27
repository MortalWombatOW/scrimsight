import { useAtomValue } from "jotai";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { matchDataAtom, useStats } from "../../../../atoms";
import { camelCaseToWords, prettyFormat } from "../../../../lib";

interface TeamStatsComparisonProps {
  matchId: string;
}

export const TeamStatsComparison = ({ matchId }: TeamStatsComparisonProps) => {
  const matchData = useAtomValue(matchDataAtom).find(
    (match) => match.matchId === matchId
  );
  if (!matchData) {
    throw new Error("No match data");
  }

  const teamStats = useStats(["playerTeam"], { matchId: [matchId] });

  const statsToShow = [
    "finalBlows",
    "allDamageDealt",
    "healingDealt",
    "ultimatesUsed",
  ];

  const data: Record<string, number | string>[] = statsToShow.map((stat) => {
    const label = camelCaseToWords(stat);
    const row: Record<string, number | string> = {
      stat: label,
    };

    for (const teamStat of teamStats.rows) {
      row[teamStat.playerTeam] = teamStat[stat];
    }

    return row;
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 w-full p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Team Stats
        </h2>

        {data.map((stat) => (
          <div key={stat.stat.toString()} className="h-[50px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[stat]}
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="stat"
                  width={120}
                  tickLine={false}
                />
                <Bar
                  dataKey={matchData.team1Name}
                  fill="#1971c2"
                  radius={5}
                  label={{
                    position: "center",
                    formatter: (value: number) => prettyFormat(value),
                    fill: "white",
                  }}
                />
                <Bar
                  dataKey={matchData.team2Name}
                  fill="#e03131"
                  radius={5}
                  label={{
                    position: "center",
                    formatter: (value: number) => prettyFormat(value),
                    fill: "white",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}

        <div className="flex justify-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-blue-600"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {matchData.team1Name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-red-600"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {matchData.team2Name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
