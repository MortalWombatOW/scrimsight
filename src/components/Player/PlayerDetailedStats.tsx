import { Whatshot } from "@mui/icons-material";
import { useAtomValue } from "jotai";
import { playerStatsByPlayerAtom } from "../../atoms/metrics/playerMetricsAtoms";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  // Map Material UI color to Tailwind CSS classes
  const getColorClass = () => {
    switch (color) {
      case "primary.main":
        return "text-primary-500 dark:text-primary-400";
      case "secondary.main":
        return "text-secondary-500 dark:text-secondary-400";
      case "error.main":
        return "text-red-500 dark:text-red-400";
      case "warning.main":
        return "text-amber-500 dark:text-amber-400";
      case "info.main":
        return "text-blue-500 dark:text-blue-400";
      case "success.main":
        return "text-green-500 dark:text-green-400";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
      <div className="mb-2 flex items-center">
        <span className={`mr-2 ${getColorClass()}`}>{icon}</span>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      </div>
      <p className="text-lg font-semibold text-gray-900 dark:text-white">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
};

interface PlayerDetailedStatsProps {
  playerName: string;
}

export const PlayerDetailedStats = ({
  playerName,
}: PlayerDetailedStatsProps) => {
  const { numericalKeys, rows } = useAtomValue(playerStatsByPlayerAtom);
  const playerStats = rows.find((stats) => stats.playerName === playerName);

  if (!playerStats) {
    return (
      <div className="text-gray-700 dark:text-gray-300">Player not found</div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Detailed Statistics
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {numericalKeys.map((key) => (
          <StatCard
            key={key}
            title={key}
            value={playerStats[key]}
            icon={<Whatshot />}
            color="primary.main"
          />
        ))}
      </div>
    </div>
  );
};
