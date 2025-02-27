import { useAtomValue } from "jotai";
import { useState } from "react";
import { uniquePlayerNamesAtom } from "../../atoms/uniquePlayerNamesAtom";
import { PlayerStatsGrid } from "./components/PlayerStatsGrid";
import { TopPlayersSection } from "./components/TopPlayersSection";
import { HeroDistributionChart } from "./components/HeroDistributionChart";
import { HeroPoolAnalysis } from "./components/HeroPoolAnalysis";
import { PlayerPerformanceMetrics } from "./components/PlayerPerformanceMetrics";
import { StatCard } from "../../components/StatCard";
import {
  People as PeopleIcon,
  Security as TankIcon,
  Whatshot as DamageIcon,
  Support as SupportIcon,
} from "@mui/icons-material";

export const PlayersPage = () => {
  const players = useAtomValue(uniquePlayerNamesAtom);
  const [selectedTab, setSelectedTab] = useState(0);

  // Calculate overall statistics
  const totalPlayers = players?.length || 0;

  // Role distribution (mock data for now, should be replaced with actual data)
  const roleDistribution = {
    tank: Math.round(totalPlayers * 0.2),
    damage: Math.round(totalPlayers * 0.5),
    support: Math.round(totalPlayers * 0.3),
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Players
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Comprehensive player statistics and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div>
          <StatCard
            title="Total Players"
            value={totalPlayers.toString()}
            icon={<PeopleIcon />}
            color="primary.main"
          />
        </div>
        <div>
          <StatCard
            title="Tank Players"
            value={roleDistribution.tank.toString()}
            icon={<TankIcon />}
            color="info.main"
          />
        </div>
        <div>
          <StatCard
            title="Damage Players"
            value={roleDistribution.damage.toString()}
            icon={<DamageIcon />}
            color="error.main"
          />
        </div>
        <div>
          <StatCard
            title="Support Players"
            value={roleDistribution.support.toString()}
            icon={<SupportIcon />}
            color="success.main"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md dark:bg-gray-800 mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex">
            <button
              className={`mr-2 inline-block px-4 py-2 ${
                selectedTab === 0
                  ? "border-b-2 border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
              }`}
              onClick={() => setSelectedTab(0)}
            >
              Overview
            </button>
            <button
              className={`mr-2 inline-block px-4 py-2 ${
                selectedTab === 1
                  ? "border-b-2 border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
              }`}
              onClick={() => setSelectedTab(1)}
            >
              Performance
            </button>
            <button
              className={`mr-2 inline-block px-4 py-2 ${
                selectedTab === 2
                  ? "border-b-2 border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
              }`}
              onClick={() => setSelectedTab(2)}
            >
              Heroes
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 0 && (
            <div className="grid grid-cols-1 gap-6">
              <div>
                <TopPlayersSection />
              </div>
              <div>
                <PlayerStatsGrid />
              </div>
            </div>
          )}

          {selectedTab === 1 && (
            <div className="grid grid-cols-1 gap-6">
              <div>
                <PlayerPerformanceMetrics />
              </div>
            </div>
          )}

          {selectedTab === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <HeroDistributionChart />
              </div>
              <div>
                <HeroPoolAnalysis />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
