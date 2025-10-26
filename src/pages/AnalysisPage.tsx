import { useMemo, useState } from "react";
import { Container } from "@components";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

const metricDefinitions = [
  {
    key: "impactScore",
    label: "Impact Score",
    description: "Weighted composite of eliminations, assists, and survivability.",
    valueFormatter: (value: number) => value.toFixed(1),
  },
  {
    key: "damageShare",
    label: "Damage Share",
    description: "Portion of team damage contributed by the player.",
    valueFormatter: (value: number) => `${(value * 100).toFixed(0)}%`,
  },
  {
    key: "teamfightWinRate",
    label: "Teamfight Win Rate",
    description: "Success rate in decisive engagements when the player is alive.",
    valueFormatter: (value: number) => `${(value * 100).toFixed(0)}%`,
  },
  {
    key: "econEfficiency",
    label: "Economy Efficiency",
    description: "Value generated per resource spent compared to the lobby average.",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    key: "objectiveControl",
    label: "Objective Control",
    description: "Share of neutral objectives secured while on the map.",
    valueFormatter: (value: number) => `${(value * 100).toFixed(0)}%`,
  },
] as const;

type MetricKey = (typeof metricDefinitions)[number]["key"];

type PlayerMetricRow = {
  player: string;
  team: string;
  role: string;
  metrics: Record<MetricKey, number>;
  trend: "rising" | "stable" | "cooling";
};

const playerMetrics: PlayerMetricRow[] = [
  {
    player: "Nova",
    team: "Eclipse Titans",
    role: "Duelist",
    trend: "rising",
    metrics: {
      impactScore: 92.4,
      damageShare: 0.31,
      teamfightWinRate: 0.72,
      econEfficiency: 1.24,
      objectiveControl: 0.63,
    },
  },
  {
    player: "Echo",
    team: "Aurora Forge",
    role: "Controller",
    trend: "stable",
    metrics: {
      impactScore: 84.1,
      damageShare: 0.24,
      teamfightWinRate: 0.69,
      econEfficiency: 1.18,
      objectiveControl: 0.57,
    },
  },
  {
    player: "Warden",
    team: "Iron Syndicate",
    role: "Sentinel",
    trend: "rising",
    metrics: {
      impactScore: 88.9,
      damageShare: 0.21,
      teamfightWinRate: 0.75,
      econEfficiency: 1.27,
      objectiveControl: 0.68,
    },
  },
  {
    player: "Vesper",
    team: "Nebula Rise",
    role: "Initiator",
    trend: "cooling",
    metrics: {
      impactScore: 76.5,
      damageShare: 0.26,
      teamfightWinRate: 0.62,
      econEfficiency: 1.04,
      objectiveControl: 0.48,
    },
  },
  {
    player: "Kairo",
    team: "Obsidian Pact",
    role: "Flex",
    trend: "stable",
    metrics: {
      impactScore: 81.7,
      damageShare: 0.28,
      teamfightWinRate: 0.66,
      econEfficiency: 1.11,
      objectiveControl: 0.54,
    },
  },
  {
    player: "Solace",
    team: "Crimson Assembly",
    role: "Support",
    trend: "rising",
    metrics: {
      impactScore: 79.3,
      damageShare: 0.19,
      teamfightWinRate: 0.71,
      econEfficiency: 1.32,
      objectiveControl: 0.59,
    },
  },
];

const trendCopy: Record<PlayerMetricRow["trend"], { label: string; tone: string }> = {
  rising: { label: "Momentum rising", tone: "text-success" },
  stable: { label: "Holding steady", tone: "text-base-content/70" },
  cooling: { label: "Cooling off", tone: "text-warning" },
};

const AnalysisPage = () => {
  const [sortColumn, setSortColumn] = useState<MetricKey>("impactScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const metricStats = useMemo(() => {
    return metricDefinitions.reduce(
      (accumulator, metric) => {
        const values = playerMetrics.map((row) => row.metrics[metric.key]);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const avg = values.reduce((total, value) => total + value, 0) / values.length;

        accumulator[metric.key] = { max, min, avg };
        return accumulator;
      },
      {} as Record<MetricKey, { max: number; min: number; avg: number }>,
    );
  }, []);

  const sortedRows = useMemo(() => {
    return [...playerMetrics].sort((a, b) => {
      const aValue = a.metrics[sortColumn];
      const bValue = b.metrics[sortColumn];
      const directionFactor = sortDirection === "asc" ? 1 : -1;

      if (aValue === bValue) {
        return a.player.localeCompare(b.player);
      }

      return (aValue - bValue) * directionFactor;
    });
  }, [sortColumn, sortDirection]);

  const handleSort = (metricKey: MetricKey) => {
    setSortColumn((current) => {
      if (current === metricKey) {
        setSortDirection((previous) => (previous === "asc" ? "desc" : "asc"));
        return current;
      }

      setSortDirection("desc");
      return metricKey;
    });
  };

  const getRelativeWidth = (metricKey: MetricKey, value: number) => {
    const { max, min } = metricStats[metricKey];
    if (max === min) {
      return 100;
    }

    return ((value - min) / (max - min)) * 100;
  };

  const renderDelta = (metricKey: MetricKey, value: number) => {
    const { avg } = metricStats[metricKey];
    if (avg === 0) {
      return "—";
    }

    const delta = ((value - avg) / avg) * 100;

    if (delta > 4) {
      return `+${delta.toFixed(0)}% vs avg`;
    }

    if (delta < -4) {
      return `${delta.toFixed(0)}% vs avg`;
    }

    return "≈ league avg";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Analyst Control Room</h1>
          <p className="mt-2 max-w-2xl text-base-content/70">
            Compare players across key impact metrics. Sort any column to re-rank the table and
            quickly surface who is outperforming the pack.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-box bg-base-200 p-4 shadow">
          <div className="text-sm uppercase text-base-content/70">Active sort</div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-base-content">
              {metricDefinitions.find((metric) => metric.key === sortColumn)?.label}
            </span>
            <span className="rounded-full bg-base-100 px-3 py-1 text-sm font-medium text-base-content/80">
              {sortDirection === "desc" ? "High → Low" : "Low → High"}
            </span>
          </div>
          <label className="flex items-center gap-2 text-sm text-base-content/70">
            Sort by
            <select
              className="select select-bordered select-sm"
              value={sortColumn}
              onChange={(event) => handleSort(event.target.value as MetricKey)}
            >
              {metricDefinitions.map((metric) => (
                <option key={metric.key} value={metric.key}>
                  {metric.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setSortDirection((current) => (current === "asc" ? "desc" : "asc"))}
              className="btn btn-ghost btn-xs"
              aria-label="Toggle sort direction"
            >
              {sortDirection === "asc" ? <FiArrowUp /> : <FiArrowDown />}
            </button>
          </label>
        </div>
      </header>

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        {sortedRows.slice(0, 3).map((row) => (
          <Container key={row.player} className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-base-content/60">Top performer</p>
                <h2 className="text-xl font-semibold text-base-content">{row.player}</h2>
                <p className="text-sm text-base-content/70">{row.team}</p>
              </div>
              <span className={`text-xs font-medium ${trendCopy[row.trend].tone}`}>
                {trendCopy[row.trend].label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {metricDefinitions.slice(0, 2).map((metric) => {
                const value = row.metrics[metric.key];
                return (
                  <div key={`${row.player}-${metric.key}`}>
                    <p className="text-xs uppercase text-base-content/60">{metric.label}</p>
                    <p className="text-lg font-semibold text-base-content">
                      {metric.valueFormatter(value)}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        ))}
      </section>

      <Container className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-base-200 dark:divide-base-700">
            <thead className="bg-base-200/60">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-base-content/60">
                  Player
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-base-content/60">
                  Team
                </th>
                {metricDefinitions.map((metric) => {
                  const isActive = sortColumn === metric.key;

                  return (
                    <th
                      key={metric.key}
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-base-content/60"
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(metric.key)}
                        className={`flex items-center gap-2 text-left transition hover:text-base-content ${
                          isActive ? "text-base-content" : ""
                        }`}
                      >
                        <span>{metric.label}</span>
                        {isActive && (
                          <span className="rounded-full bg-base-100 px-2 py-0.5 text-[10px] font-semibold">
                            {sortDirection === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200 dark:divide-base-700">
              {sortedRows.map((row) => (
                <tr key={row.player} className="hover:bg-base-200/40">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-base-content">
                    <div>{row.player}</div>
                    <div className="text-xs text-base-content/60">{row.role}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-base-content/70">
                    {row.team}
                  </td>
                  {metricDefinitions.map((metric) => {
                    const value = row.metrics[metric.key];
                    const width = getRelativeWidth(metric.key, value);

                    return (
                      <td key={`${row.player}-${metric.key}`} className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between text-sm font-semibold text-base-content">
                            <span>{metric.valueFormatter(value)}</span>
                            <span className="text-xs text-base-content/60">{renderDelta(metric.key, value)}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-base-200">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Math.min(Math.max(width, 0), 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-base-content/60">{metric.description}</p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
};

export default AnalysisPage;
