import { TeamStats } from "../../../atoms/teamStatsAtom";
import { useStats } from "../../../atoms/metrics/playerMetricsAtoms";
import { StatCard } from "../../../components/StatCard";
import { prettyFormat } from "../../../lib/format";

interface TeamOverviewProps {
  teamStats: TeamStats;
}

export const TeamOverview = ({ teamStats }: TeamOverviewProps) => {
  const stats = useStats(["playerTeam"], { playerTeam: [teamStats.teamName] });

  const avgStats = {
    damage: stats.rows[0]?.allDamageDealt / teamStats.gamesPlayed || 0,
    healing: stats.rows[0]?.healingDealt / teamStats.gamesPlayed || 0,
    eliminations: stats.rows[0]?.eliminations / teamStats.gamesPlayed || 0,
    ultimates: stats.rows[0]?.ultimatesUsed / teamStats.gamesPlayed || 0,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Team Performance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Avg. Damage"
          value={prettyFormat(avgStats.damage)}
          color="error"
        />
        <StatCard
          title="Avg. Healing"
          value={prettyFormat(avgStats.healing)}
          color="success"
        />
        <StatCard
          title="Avg. Eliminations"
          value={prettyFormat(avgStats.eliminations)}
          color="warning"
        />
        <StatCard
          title="Avg. Ultimates"
          value={prettyFormat(avgStats.ultimates)}
          color="info"
        />
      </div>
    </div>
  );
};