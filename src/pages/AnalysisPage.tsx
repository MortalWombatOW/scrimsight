import {
  Column,
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

interface PlayerPerformanceRow {
  player: string;
  team: string;
  role: string;
  impactScore: number;
  objectivePressure: number;
  damageShare: number;
  utilityScore: number;
}

const playerPerformance: PlayerPerformanceRow[] = [
  {
    player: "Nova",
    team: "Orion Collective",
    role: "Flex DPS",
    impactScore: 92.4,
    objectivePressure: 86,
    damageShare: 0.31,
    utilityScore: 27.1,
  },
  {
    player: "Atlas",
    team: "Summit Vanguard",
    role: "Tank",
    impactScore: 88.9,
    objectivePressure: 104,
    damageShare: 0.22,
    utilityScore: 32.4,
  },
  {
    player: "Mistral",
    team: "StormRunners",
    role: "Projectile DPS",
    impactScore: 85.6,
    objectivePressure: 78,
    damageShare: 0.29,
    utilityScore: 24.3,
  },
  {
    player: "Kestrel",
    team: "Skyward Wing",
    role: "Hitscan DPS",
    impactScore: 81.2,
    objectivePressure: 62,
    damageShare: 0.34,
    utilityScore: 19.5,
  },
  {
    player: "Harbor",
    team: "Tidal Guard",
    role: "Support",
    impactScore: 77.8,
    objectivePressure: 95,
    damageShare: 0.17,
    utilityScore: 36.8,
  },
  {
    player: "Quill",
    team: "Mythic League",
    role: "Flex Support",
    impactScore: 83.7,
    objectivePressure: 88,
    damageShare: 0.21,
    utilityScore: 34.1,
  },
  {
    player: "Cipher",
    team: "Neon Array",
    role: "Strategist",
    impactScore: 79.4,
    objectivePressure: 71,
    damageShare: 0.26,
    utilityScore: 28.7,
  },
  {
    player: "Bastion",
    team: "Iron Assembly",
    role: "Anchor Tank",
    impactScore: 75.9,
    objectivePressure: 110,
    damageShare: 0.19,
    utilityScore: 31.2,
  },
  {
    player: "Lyric",
    team: "Harmonic",
    role: "Tempo Support",
    impactScore: 73.5,
    objectivePressure: 82,
    damageShare: 0.18,
    utilityScore: 29.8,
  },
  {
    player: "Vex",
    team: "Shadow Circuit",
    role: "Flanker",
    impactScore: 70.6,
    objectivePressure: 58,
    damageShare: 0.27,
    utilityScore: 15.9,
  },
];

interface MetricDefinition {
  key: keyof PlayerPerformanceRow;
  label: string;
  description: string;
  format: (value: number) => string;
  formatDelta?: (value: number) => string;
  higherIsBetter?: boolean;
}

const metricDefinitions: MetricDefinition[] = [
  {
    key: "impactScore",
    label: "Impact Score",
    description:
      "Composite index of elimination impact, tempo plays, and objective conversions.",
    format: (value) => value.toFixed(1),
    formatDelta: (value) => `${value > 0 ? "+" : ""}${value.toFixed(1)}`,
    higherIsBetter: true,
  },
  {
    key: "objectivePressure",
    label: "Objective Pressure",
    description:
      "Average seconds spent creating or holding capture pressure each map.",
    format: (value) => `${value.toFixed(0)}s`,
    formatDelta: (value) => `${value > 0 ? "+" : ""}${value.toFixed(0)}s`,
    higherIsBetter: true,
  },
  {
    key: "damageShare",
    label: "Damage Share",
    description: "Share of team damage attributed to the player each series.",
    format: (value) => `${(value * 100).toFixed(1)}%`,
    formatDelta: (value) =>
      `${value > 0 ? "+" : ""}${(value * 100).toFixed(1)}%`,
    higherIsBetter: true,
  },
  {
    key: "utilityScore",
    label: "Utility Efficiency",
    description: "Successful disrupts, peels, or saves created every 10 minutes.",
    format: (value) => value.toFixed(1),
    formatDelta: (value) => `${value > 0 ? "+" : ""}${value.toFixed(1)}`,
    higherIsBetter: true,
  },
];

interface MetricSummary {
  min: number;
  max: number;
  average: number;
  ranks: Record<string, { rank: number; percentile: number }>;
}

const useMetricSummaries = (rows: PlayerPerformanceRow[]) =>
  useMemo(() => {
    const summaries: Record<string, MetricSummary> = {};

    metricDefinitions.forEach((metric) => {
      const values = rows.map((row) => row[metric.key] as number);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const average =
        values.reduce((total, current) => total + current, 0) / values.length;

      const sorted = [...rows].sort((a, b) =>
        (b[metric.key] as number) - (a[metric.key] as number)
      );

      const ranks: Record<string, { rank: number; percentile: number }> = {};

      sorted.forEach((row, index) => {
        const percentile = rows.length > 1 ? 1 - index / (rows.length - 1) : 1;

        ranks[row.player] = {
          rank: index + 1,
          percentile,
        };
      });

      summaries[metric.key as string] = {
        min,
        max,
        average,
        ranks,
      };
    });

    return summaries;
  }, [rows]);

const SortIndicator = ({
  column,
}: {
  column: Column<PlayerPerformanceRow, unknown>;
}) => {
  const sorted = column.getIsSorted();

  if (!sorted) {
    return <span className="text-xs text-base-400">↕</span>;
  }

  return (
    <span className="text-xs text-primary-500">
      {sorted === "asc" ? "↑" : "↓"}
    </span>
  );
};

const SortableHeader = ({
  column,
  title,
  description,
}: {
  column: Column<PlayerPerformanceRow, unknown>;
  title: string;
  description: string;
}) => {
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className="group flex w-full flex-col items-start gap-1 text-left"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-base-900 dark:text-base-100">
        {title}
        <SortIndicator column={column} />
      </div>
      <p className="text-xs text-base-500 transition-colors group-hover:text-base-600 dark:text-base-400 dark:group-hover:text-base-300">
        {description}
      </p>
    </button>
  );
};

const MetricValueCell = ({
  value,
  metric,
  summary,
}: {
  value: number;
  metric: MetricDefinition;
  summary: MetricSummary;
}) => {
  const delta = value - summary.average;
  const percentage =
    summary.max === summary.min
      ? 1
      : (value - summary.min) / (summary.max - summary.min);
  const width = `${Math.max(6, Math.round(percentage * 100))}%`;

  const deltaLabel = metric.formatDelta
    ? metric.formatDelta(delta)
    : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`;

  const deltaColor =
    delta > 0.5
      ? "text-success-500"
      : delta < -0.5
        ? "text-error-500"
        : "text-base-500 dark:text-base-400";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm font-medium text-base-900 dark:text-base-100">
        <span>{metric.format(value)}</span>
        <span className={`text-xs font-medium ${deltaColor}`}>
          {delta > 0 ? "above" : delta < 0 ? "below" : "at"} avg · {deltaLabel}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-base-300 dark:bg-base-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
          style={{ width }}
        />
      </div>
    </div>
  );
};

const MetricRankFooter = ({
  player,
  summary,
}: {
  player: string;
  summary: MetricSummary;
}) => {
  const rankInfo = summary.ranks[player];
  if (!rankInfo) {
    return null;
  }

  const percentileLabel = Math.round(rankInfo.percentile * 100);
  const category =
    percentileLabel >= 85
      ? "Top performer"
      : percentileLabel >= 60
        ? "Consistent impact"
        : percentileLabel >= 40
          ? "Team average"
          : "Needs review";

  return (
    <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-base-400 dark:text-base-500">
      <span>{category}</span>
      <span>
        Rank {rankInfo.rank} of {Object.keys(summary.ranks).length}
      </span>
    </div>
  );
};

const PlayerIdentityCell = ({
  player,
  team,
  role,
}: {
  player: string;
  team: string;
  role: string;
}) => (
  <div className="flex flex-col">
    <span className="text-sm font-semibold text-base-900 dark:text-base-100">
      {player}
    </span>
    <span className="text-xs text-base-500 dark:text-base-400">
      {team} · {role}
    </span>
  </div>
);

const AnalysisPage = () => {
  const summaries = useMetricSummaries(playerPerformance);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "impactScore", desc: true },
  ]);

  const columns = useMemo<ColumnDef<PlayerPerformanceRow>[]>(
    () => [
      {
        accessorKey: "player",
        header: ({ column }) => (
          <SortableHeader
            column={column as Column<PlayerPerformanceRow, unknown>}
            title="Player"
            description="Primary roster identity and assignment."
          />
        ),
        cell: ({ row }) => (
          <PlayerIdentityCell
            player={row.original.player}
            team={row.original.team}
            role={row.original.role}
          />
        ),
        enableSorting: true,
      },
      ...metricDefinitions.map((metric) => ({
        accessorKey: metric.key,
        header: ({ column }) => (
          <SortableHeader
            column={column as Column<PlayerPerformanceRow, unknown>}
            title={metric.label}
            description={metric.description}
          />
        ),
        cell: ({ row }) => (
          <div className="space-y-2">
            <MetricValueCell
              value={row.original[metric.key] as number}
              metric={metric}
              summary={summaries[metric.key as string]}
            />
            <MetricRankFooter
              player={row.original.player}
              summary={summaries[metric.key as string]}
            />
          </div>
        ),
        enableSorting: true,
      })),
    ],
    [summaries]
  );

  const table = useReactTable({
    data: playerPerformance,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">
          Competitive Insight
        </p>
        <h1 className="text-3xl font-bold text-base-900 dark:text-white">
          Player Impact Analysis
        </h1>
        <p className="max-w-3xl text-base text-base-600 dark:text-base-300">
          Explore roster-wide performance metrics with contextual comparisons. Sort
          by any column to reveal who is driving objective control, dealing the
          most damage, or creating high-value utility.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {metricDefinitions.map((metric) => {
          const summary = summaries[metric.key as string];
          const leader = Object.entries(summary.ranks).sort(
            (a, b) => a[1].rank - b[1].rank
          )[0][0];
          return (
            <article
              key={metric.key as string}
              className="rounded-2xl border border-base-300 bg-base-100/60 p-4 shadow-sm dark:border-base-700 dark:bg-base-800/60"
            >
              <h2 className="text-sm font-semibold text-base-900 dark:text-base-100">
                {metric.label}
              </h2>
              <p className="mt-1 text-xs text-base-500 dark:text-base-400">
                {metric.description}
              </p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-base-500 dark:text-base-400">Average</dt>
                  <dd className="font-medium text-base-900 dark:text-base-100">
                    {metric.format(summary.average)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-base-500 dark:text-base-400">Leader</dt>
                  <dd className="font-medium text-base-900 dark:text-base-100">
                    {leader}
                  </dd>
                </div>
              </dl>
            </article>
          );
        })}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-base-900 dark:text-base-100">
            Team-wide comparison table
          </h2>
          <p className="text-xs text-base-500 dark:text-base-400">
            Click any column to reorder results. Metrics display deviation from
            the roster average and visualize relative standing.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm dark:border-base-700 dark:bg-base-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-base-200 dark:divide-base-700">
              <thead className="bg-base-100/80 backdrop-blur dark:bg-base-800/80">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className="px-4 py-3 text-left align-bottom"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-base-200 bg-base-50 dark:divide-base-700 dark:bg-base-900">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="transition hover:bg-primary-500/5">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-4 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalysisPage;
