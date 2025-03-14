import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts";
import { useState } from "react";
import { useAtomValue } from "jotai";
import {
  playerStatsByPlayerAtom,
  playerStatsByPlayerAndHeroAtom,
  playerStatsByPlayerAndRoleAtom,
  playerStatsByMatchIdAndPlayerNameAtom,
} from "../../atoms/metrics/playerMetricsAtoms";
import { StatCard } from "../StatCard";

interface MetricSectionProps {
  title: string;
  data: Array<{ name: string; value: number }>;
  colors: string[];
  chartType?: "bar" | "pie" | "line";
}

const MetricSection = ({
  title,
  data,
  colors,
  chartType = "bar",
}: MetricSectionProps) => (
  <div className="mb-6 rounded-lg bg-white p-4 shadow-md dark:bg-base-800">
    <h3 className="mb-3 text-lg font-semibold text-base-900 dark:text-white">
      {title}
    </h3>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div
        className={`h-[300px] ${
          chartType === "line" ? "col-span-1 md:col-span-2" : ""
        }`}
      >
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={colors[0]} />
            </BarChart>
          ) : chartType === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill={colors[1]}
                label
              />
              <Tooltip />
            </PieChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={colors[0]} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export const PlayerMetricsDashboard = ({
  playerName,
}: {
  playerName: string;
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const overallStats = useAtomValue(playerStatsByPlayerAtom);
  const heroStats = useAtomValue(playerStatsByPlayerAndHeroAtom);
  const roleStats = useAtomValue(playerStatsByPlayerAndRoleAtom);
  const matchStats = useAtomValue(playerStatsByMatchIdAndPlayerNameAtom);

  const playerOverallStats = overallStats.rows.find(
    (stat) => stat.playerName === playerName
  );
  const playerHeroStats = heroStats.rows.filter(
    (stat) => stat.playerName === playerName
  );
  const playerRoleStats = roleStats.rows.filter(
    (stat) => stat.playerName === playerName
  );
  const playerMatchStats = matchStats.rows
    .filter((stat) => stat.playerName === playerName)
    .sort((a, b) => a.matchId.localeCompare(b.matchId));

  if (!playerOverallStats) {
    return (
      <p className="text-base-700 dark:text-base-300">
        No data available for {playerName}
      </p>
    );
  }

  const overallMetrics = [
    { title: "Eliminations", value: playerOverallStats.eliminations },
    { title: "Deaths", value: playerOverallStats.deaths },
    { title: "Healing", value: playerOverallStats.healingDealt },
    { title: "Damage", value: playerOverallStats.heroDamageDealt },
  ];

  const heroData = playerHeroStats.map((stat) => ({
    name: stat.playerHero,
    value: stat.eliminations,
  }));

  const roleData = playerRoleStats.map((stat) => ({
    name: stat.playerRole,
    value: stat.eliminations,
  }));

  const matchHistoryData = playerMatchStats.map((stat) => ({
    name: stat.matchId.slice(-8),
    value: stat.eliminations,
  }));

  return (
    <div className="mt-6">
      <h2 className="mb-4 text-2xl font-bold text-base-900 dark:text-white">
        Performance Metrics
      </h2>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {overallMetrics.map((metric, index) => (
          <StatCard
            key={index}
            title={metric.title}
            value={metric.value.toString()}
            color={index % 2 === 0 ? "primary.main" : "secondary.main"}
          />
        ))}
      </div>

      <div className="mb-4 border-b border-base-200 dark:border-base-700">
        <nav className="-mb-px flex">
          <button
            className={`mr-2 inline-block px-4 py-2 ${
              selectedTab === 0
                ? "border-b-2 border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "text-base-500 hover:border-base-300 hover:text-base-700 dark:text-base-400 dark:hover:border-base-600 dark:hover:text-base-300"
            }`}
            onClick={() => setSelectedTab(0)}
          >
            By Hero
          </button>
          <button
            className={`mr-2 inline-block px-4 py-2 ${
              selectedTab === 1
                ? "border-b-2 border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "text-base-500 hover:border-base-300 hover:text-base-700 dark:text-base-400 dark:hover:border-base-600 dark:hover:text-base-300"
            }`}
            onClick={() => setSelectedTab(1)}
          >
            By Role
          </button>
          <button
            className={`mr-2 inline-block px-4 py-2 ${
              selectedTab === 2
                ? "border-b-2 border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                : "text-base-500 hover:border-base-300 hover:text-base-700 dark:text-base-400 dark:hover:border-base-600 dark:hover:text-base-300"
            }`}
            onClick={() => setSelectedTab(2)}
          >
            Match History
          </button>
        </nav>
      </div>

      {selectedTab === 0 && (
        <MetricSection
          title="Performance by Hero"
          data={heroData}
          colors={["#8884d8", "#82ca9d"]}
          chartType="bar"
        />
      )}

      {selectedTab === 1 && (
        <MetricSection
          title="Performance by Role"
          data={roleData}
          colors={["#8884d8", "#82ca9d"]}
          chartType="pie"
        />
      )}

      {selectedTab === 2 && (
        <MetricSection
          title="Match History Trends"
          data={matchHistoryData}
          colors={["#8884d8", "#82ca9d"]}
          chartType="line"
        />
      )}
    </div>
  );
};
