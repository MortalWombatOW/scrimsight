import { useAtomValue } from "jotai";
import {
  playerStatsByPlayerAtom,
  PlayerStats,
  PlayerStatsNumericalKeys,
} from "../../../atoms/metrics/playerMetricsAtoms";
import { Link } from "react-router-dom";
import { Grouped } from "../../../atoms/metrics/metricUtils";

interface TopPlayerCardProps {
  title: string;
  player: Grouped<PlayerStats, "playerName", PlayerStatsNumericalKeys>;
  metric: string;
  value: number;
  color: string;
}

const TopPlayerCard = ({
  title,
  player,
  metric,
  value,
  color,
}: TopPlayerCardProps) => {
  // Map Material UI color props to Tailwind CSS classes
  const getColorClass = () => {
    switch (color) {
      case "primary.main":
        return "text-primary-600 dark:text-primary-400";
      case "secondary.main":
        return "text-secondary-600 dark:text-secondary-400";
      case "error.main":
        return "text-red-600 dark:text-red-400";
      case "warning.main":
        return "text-amber-600 dark:text-amber-400";
      case "info.main":
        return "text-blue-600 dark:text-blue-400";
      case "success.main":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-base-600 dark:text-base-400";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full transition-transform duration-200 hover:-translate-y-1 dark:bg-base-800">
      <h3 className={`text-lg font-semibold mb-2 ${getColorClass()}`}>
        {title}
      </h3>
      <Link
        to={`/players/${encodeURIComponent(player.playerName)}`}
        className="block no-underline text-inherit"
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center mr-3 text-lg font-medium">
            {player.playerName[0]}
          </div>
          <div>
            <p className="text-base font-medium text-base-900 dark:text-white">
              {player.playerName}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-base-500 dark:text-base-400">{metric}</p>
          <p className={`text-lg font-semibold ${getColorClass()}`}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
      </Link>
    </div>
  );
};

export const TopPlayersSection = () => {
  const playerStats = useAtomValue(playerStatsByPlayerAtom);
  const players = playerStats?.rows || [];

  if (players.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 dark:bg-base-800">
        <p className="text-base-700 dark:text-base-300">
          No player data available
        </p>
      </div>
    );
  }

  // Find top players in different categories
  const topDamage = players.reduce((prev, current) =>
    prev.heroDamageDealt > current.heroDamageDealt ? prev : current
  );

  const topHealing = players.reduce((prev, current) =>
    prev.healingDealt > current.healingDealt ? prev : current
  );

  const topEliminations = players.reduce((prev, current) =>
    prev.eliminations > current.eliminations ? prev : current
  );

  const topAccuracy = players.reduce((prev, current) =>
    prev.weaponAccuracy > current.weaponAccuracy ? prev : current
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-base-900 dark:text-white">
        Top Performers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <TopPlayerCard
            title="Top Damage"
            player={topDamage}
            metric="Hero Damage"
            value={topDamage.heroDamageDealt}
            color="error.main"
          />
        </div>
        <div>
          <TopPlayerCard
            title="Top Healing"
            player={topHealing}
            metric="Healing Done"
            value={topHealing.healingDealt}
            color="success.main"
          />
        </div>
        <div>
          <TopPlayerCard
            title="Most Eliminations"
            player={topEliminations}
            metric="Eliminations"
            value={topEliminations.eliminations}
            color="primary.main"
          />
        </div>
        <div>
          <TopPlayerCard
            title="Best Accuracy"
            player={topAccuracy}
            metric="Weapon Accuracy"
            value={Math.round(topAccuracy.weaponAccuracy * 100)}
            color="warning.main"
          />
        </div>
      </div>
    </div>
  );
};
