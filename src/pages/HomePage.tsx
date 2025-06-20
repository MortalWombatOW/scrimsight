import { useAtomValue } from "jotai";
import {
  FileText,
  Users,
  Trophy,
  Clock,
  Target,
  Heart,
  Zap,
  Shield,
} from "lucide-react";

import CardStat from "@components/CardStat";
import EmptyState from "@components/EmptyState";
import StatDistributionAndTop from "@components/StatDistributionAndTop";
import { formatDuration } from "@library/format";
import { dataModelAtom } from "../atoms/scrimsight";
const HomePage = () => {
  const dataModel = useAtomValue(dataModelAtom);

  if (!dataModel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={FileText}
          title="No Data Available"
          description="Upload scrim data to see statistics and insights"
          size="lg"
        />
      </div>
    );
  }

  const avgKDA =
    dataModel.playerStatBreakdown.total.eliminations /
    Math.max(1, dataModel.playerStatBreakdown.total.deaths);

  const killDeathRows = dataModel.playerStatBreakdown.byPlayer.map(
    (player) => ({
      category: player.playerName,
      value: player.eliminations / Math.max(1, player.deaths),
    })
  );

  const damagePerTenRows = dataModel.playerStatBreakdown.byPlayer.map(
    (player) => ({
      category: player.playerName,
      value: player.allDamageDealtPer10Minutes,
    })
  );

  const healingPerTenRows = dataModel.playerStatBreakdown.byPlayer.map(
    (player) => ({
      category: player.playerName,
      value: player.healingDealtPer10Minutes,
    })
  );

  const avgDamagePerTen =
    dataModel.playerStatBreakdown.total.allDamageDealtPer10Minutes;
  const avgHealingPerTen =
    dataModel.playerStatBreakdown.total.healingDealtPer10Minutes;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">Dashboard</h1>
        <p className="text-base-content/70">
          Overview of your scrim performance and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 bg-base-100 p-6 rounded-lg">
        <CardStat
          label="Total Scrims"
          value={dataModel.scrims.length}
          icon={<Trophy className="w-6 h-6" />}
          severity="neutral"
        />
        <CardStat
          label="Total Matches"
          value={dataModel.matches.length}
          icon={<Target className="w-6 h-6" />}
          severity="neutral"
        />
        <CardStat
          label="Active Players"
          value={dataModel.players.length}
          icon={<Users className="w-6 h-6" />}
          severity="neutral"
        />
        <CardStat
          label="Teams"
          value={dataModel.teams.length}
          icon={<Shield className="w-6 h-6" />}
          severity="neutral"
        />
        <CardStat
          label="Teamfights"
          value={dataModel.teamfights.length}
          icon={<Zap className="w-6 h-6" />}
          severity="neutral"
        />
        <CardStat
          label="Total Playtime"
          value={formatDuration(
            dataModel.matches.reduce(
              (total, match) => total + match.duration,
              0
            )
          )}
          icon={<Clock className="w-6 h-6" />}
          severity="neutral"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-base-content mb-6">
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatDistributionAndTop
            statName="Kill/Death Ratio"
            statValue={avgKDA}
            statDescription="Average eliminations per death across all players"
            rows={killDeathRows}
            higherIsBetter={true}
            precision={2}
          />
          <StatDistributionAndTop
            statName="Damage per 10 Minutes"
            statValue={avgDamagePerTen}
            statDescription="Average damage dealt per 10 minutes of playtime"
            rows={damagePerTenRows}
            higherIsBetter={true}
            precision={0}
          />
          <StatDistributionAndTop
            statName="Healing per 10 Minutes"
            statValue={avgHealingPerTen}
            statDescription="Average healing dealt per 10 minutes of playtime"
            rows={healingPerTenRows}
            higherIsBetter={true}
            precision={0}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
