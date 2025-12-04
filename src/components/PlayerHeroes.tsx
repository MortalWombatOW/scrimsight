import { type ReactNode, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./Table/DataTable";
import {
  OverwatchRole,
  getRoleFromHero,
  getHeroImage,
} from "@library";
import { useStatsWithDerived } from "../hooks/useStats";
import { RoleIcon } from "@icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useParams } from "react-router-dom"; // Import useParams

// interface PlayerHeroesProps { // Remove prop interface
//   playerName: string;
// }

// Custom bar component with hero image
interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  hero?: string;
  payload?: {
    hero: string;
  };
}

const CustomBar = (props: CustomBarProps) => {
  const { x = 0, y = 0, width = 0, height = 0, hero, payload } = props;
  const heroName = hero || payload?.hero || "";
  const imageSize = 32; // Size of hero image

  return (
    <g>
      {/* Regular bar */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="currentColor"
        opacity={0.8}
        rx={4}
        ry={4}
      />

      {/* Hero image centered at the top of the bar */}
      {height > 0 && heroName && (
        <image
          x={x + width / 2 - imageSize / 2}
          y={y - imageSize - 5} // Position above the bar with 5px gap
          width={imageSize}
          height={imageSize}
          href={getHeroImage(heroName, true)}
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
          }}
        />
      )}
    </g>
  );
};

// Custom tooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      hero: string;
      role: string;
      playtime: number;
      elimsPerLife: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-base-200 p-3 rounded-lg shadow-lg border border-gray-700 border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={getHeroImage(data.hero, true)}
            alt={data.hero}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-bold">{data.hero}</span>
        </div>
        <div className="space-y-1 text-sm">
          <p>Playtime: {data.playtime} minutes</p>
          <p>
            Role: <span className="capitalize">{data.role}</span>
          </p>
          <p>Eliminations/Life: {data.elimsPerLife}</p>
        </div>
      </div>
    );
  }
  return null;
};

export const PlayerHeroes = (): ReactNode => {
  const { playerName } = useParams<{ playerName: string }>();

  // Always call hooks before any conditional logic
  const heroStats = useStatsWithDerived({
    playerName: playerName || undefined,
  });

  if (!playerName) {
    return <div>Player name not found in URL.</div>;
  }

  // Prepare hero statistics
  const heroData = heroStats
    .map((row) => ({
      hero: row.playerHero,
      role: getRoleFromHero(row.playerHero),
      playtime: Math.round(row.playtime / 60),
      elimsPerLife: (row.eliminations / Math.max(row.deaths, 1)).toFixed(2),
      damagePerMin: Math.round(row.heroDamageDealtPer10Minutes / 10),
      healingPerMin: Math.round(row.healingDealtPer10Minutes / 10),
      accuracy: (row.weaponAccuracy * 100).toFixed(1),
    }))
    .sort((a, b) => b.playtime - a.playtime);

  const roleGroups = heroData.reduce((acc, hero) => {
    if (!acc[hero.role]) {
      acc[hero.role] = [];
    }
    acc[hero.role].push(hero);
    return acc;
  }, {} as Record<OverwatchRole, typeof heroData>);

  // Role-based colors using theme colors
  const getRoleColor = (role: OverwatchRole) => {
    switch (role) {
      case "tank":
        return "--var(--color-base-content)";
      case "damage":
        return "var(--secondary)";
      case "support":
        return "var(--accent)";
      default:
        return "var(--primary)";
    }
  };

  const columns = useMemo<ColumnDef<typeof heroData[0]>[]>(
    () => [
      {
        accessorKey: "hero",
        header: "Hero",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <img
              src={getHeroImage(row.original.hero, true)}
              alt={row.original.hero}
              className="w-8 h-8 rounded-full"
            />
            {row.original.hero}
          </div>
        ),
      },
      {
        accessorKey: "playtime",
        header: "Playtime",
        cell: ({ getValue }) => `${getValue()} min`,
      },
      {
        accessorKey: "elimsPerLife",
        header: "Elims/Life",
      },
      {
        accessorKey: "damagePerMin",
        header: "Damage/min",
      },
      {
        accessorKey: "healingPerMin",
        header: "Healing/min",
      },
      {
        accessorKey: "accuracy",
        header: "Accuracy",
        cell: ({ getValue }) => `${getValue()}%`,
      },
    ],
    []
  );

  return (
    <div className="space-y-8">
      {/* Hero Usage Overview */}
      <div className="bg-base-100 p-6 rounded-box">
        <h2 className="text-xl font-bold mb-6 text-base-content">
          Hero Playtime Distribution
        </h2>
        <div className="h-[400px] mt-8">
          {" "}
          {/* Added top margin for hero images */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={heroData.slice(0, 10)}
              margin={{ top: 40, right: 20, left: 20, bottom: 20 }}
            >
              <XAxis
                dataKey="hero"
                interval={0}
                tick={{
                  fontSize: 12,
                  fill: "var(--color-base-content)",
                }}
                axisLine={{ stroke: "var(--color-base-content)", opacity: 0.2 }}
                tickLine={{ stroke: "var(--color-base-content)", opacity: 0.2 }}
                height={60}
              />
              <YAxis
                label={{
                  value: "Playtime (minutes)",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    fill: "var(--color-base-content)",
                    opacity: 0.7,
                    textAnchor: "middle",
                  },
                }}
                tick={{
                  fontSize: 12,
                  fill: "var(--color-base-content)",
                }}
                axisLine={{ stroke: "var(--color-base-content)", opacity: 0.2 }}
                tickLine={{ stroke: "var(--color-base-content)", opacity: 0.2 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-base-200)",
                  border: "1px solid var(--color-base-300)",
                  color: "var(--color-base-content)",
                }}
                content={<CustomTooltip />}
              />
              <Bar dataKey="playtime" shape={<CustomBar />}>
                {heroData.slice(0, 10).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRoleColor(entry.role)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Hero Stats by Role */}
      {(Object.keys(roleGroups) as OverwatchRole[]).map((role) => (
        <div key={role} className="bg-base-100 p-6 rounded-box">
          <div className="flex items-center gap-2 mb-4">
            <RoleIcon role={role} className="w-6 h-6" />
            <h2 className="text-xl font-bold capitalize text-base-content">
              {role} Heroes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <DataTable
              data={roleGroups[role]}
              columns={columns}
              initialState={{
                sorting: [{ id: "playtime", desc: true }],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
