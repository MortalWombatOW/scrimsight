import {
  PersonOutline,
  EmojiEvents,
  Timeline,
  Bolt,
  Stars,
} from "@mui/icons-material";
import { useAtomValue } from "jotai";
import {
  playerStatsByPlayerAtom,
  playerStatsByPlayerAndHeroAtom,
} from "../../atoms/metrics/playerMetricsAtoms";
import { getHeroImage } from "../../lib";

interface PlayerOverviewCardProps {
  playerName: string;
}

export const PlayerOverviewCard = ({ playerName }: PlayerOverviewCardProps) => {
  const { rows: playerStats } = useAtomValue(playerStatsByPlayerAtom);
  const { rows: heroStats } = useAtomValue(playerStatsByPlayerAndHeroAtom);

  const playerOverallStats = playerStats.find(
    (stat) => stat.playerName === playerName
  );
  const playerHeroStats = heroStats.filter(
    (stat) => stat.playerName === playerName
  );

  if (!playerOverallStats) {
    return null;
  }

  // Calculate top heroes by eliminations
  const topHeroes = playerHeroStats
    .sort((a, b) => b.eliminations - a.eliminations)
    .slice(0, 3)
    .map((stat) => stat.playerHero);

  // Calculate win rate (this would need to be added to the metrics)
  const winRate = "50.0"; // Placeholder until we add win/loss tracking

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-base-800">
      <div className="mb-6 flex items-center">
        <PersonOutline className="mr-3 text-4xl text-primary-500 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-base-900 dark:text-white">
          {playerName}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {/* Win Rate */}
        <div className="flex items-center">
          <EmojiEvents className="mr-3 text-green-500 dark:text-green-400" />
          <div>
            <p className="text-sm text-base-500 dark:text-base-400">Win Rate</p>
            <p className="text-lg font-semibold">{winRate}%</p>
          </div>
        </div>

        {/* K/D Ratio */}
        <div className="flex items-center">
          <Timeline className="mr-3 text-amber-500 dark:text-amber-400" />
          <div>
            <p className="text-sm text-base-500 dark:text-base-400">
              K/D Ratio
            </p>
            <p className="text-lg font-semibold">
              {playerOverallStats.deaths > 0
                ? (
                    playerOverallStats.eliminations / playerOverallStats.deaths
                  ).toFixed(2)
                : playerOverallStats.eliminations.toString()}
            </p>
          </div>
        </div>

        {/* Final Blows */}
        <div className="flex items-center">
          <Stars className="mr-3 text-secondary-500 dark:text-secondary-400" />
          <div>
            <p className="text-sm text-base-500 dark:text-base-400">
              Final Blows
            </p>
            <p className="text-lg font-semibold">
              {playerOverallStats.finalBlows}
            </p>
          </div>
        </div>

        {/* Eliminations */}
        <div className="flex items-center">
          <Bolt className="mr-3 text-red-500 dark:text-red-400" />
          <div>
            <p className="text-sm text-base-500 dark:text-base-400">
              Eliminations
            </p>
            <p className="text-lg font-semibold">
              {playerOverallStats.eliminations}
            </p>
          </div>
        </div>

        {/* Top Heroes */}
        <div>
          <p className="mb-2 text-sm text-base-500 dark:text-base-400">
            Top Heroes
          </p>
          <div className="flex flex-wrap gap-2">
            {topHeroes.map((hero) => (
              <div
                key={hero}
                className="inline-flex items-center rounded-full border border-primary-500 px-2 py-1 text-xs dark:border-primary-400"
              >
                <img
                  src={getHeroImage(hero)}
                  alt={hero}
                  className="mr-1 h-5 w-5 rounded-full object-cover"
                />
                <span>{hero}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
