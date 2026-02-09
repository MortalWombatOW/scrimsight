import { StatCard } from "@components";

interface TeamsSummaryStatsProps {
  totalTeams: number;
  totalGames: number;
  totalWins: number;
  totalPlayers: number;
}

export const TeamsSummaryStats = ({
  totalTeams,
  totalGames,
  totalWins,
  totalPlayers,
}: TeamsSummaryStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 bg-base-100 rounded-lg p-6">
      <div>
        <StatCard title="Total Teams" value={totalTeams.toString()} />
      </div>
      <div>
        <StatCard title="Total Games" value={totalGames.toString()} />
      </div>
      <div>
        <StatCard title="Total Wins" value={totalWins.toString()} />
      </div>
      <div>
        <StatCard title="Total Players" value={totalPlayers.toString()} />
      </div>
    </div>
  );
};
