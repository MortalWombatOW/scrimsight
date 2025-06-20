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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">Dashboard</h1>
        <p className="text-base-content/70">
          Overview of your scrim performance and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          value={formatDuration(dataModel.playerStatBreakdown.total.playtime)}
          icon={<Clock className="w-6 h-6" />}
          severity="neutral"
        />
        <CardStat
          label="Avg KDA"
          value={avgKDA.toFixed(2)}
          icon={<Target className="w-6 h-6" />}
          severity={avgKDA > 2 ? "good" : avgKDA > 1 ? "neutral" : "bad"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/*  <div className="bg-base-100 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-base-content mb-4">
            Performance Averages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CardStat
              label="Ults/10min"
              value={avgUltsPerMin.toFixed(1)}
              icon={<Zap className="w-5 h-5" />}
              severity="neutral"
            />
            <CardStat
              label="Deaths/10min"
              value={avgDeathsPerMin.toFixed(1)}
              icon={<Target className="w-5 h-5" />}
              severity={
                avgDeathsPerMin < 5
                  ? "good"
                  : avgDeathsPerMin < 8
                  ? "neutral"
                  : "bad"
              }
            />
            <CardStat
              label="Damage/10min"
              value={Math.round(avgDamagePerMin).toLocaleString()}
              icon={<Target className="w-5 h-5" />}
              severity="neutral"
            />
            <CardStat
              label="Healing/10min"
              value={Math.round(avgHealingPerMin).toLocaleString()}
              icon={<Heart className="w-5 h-5" />}
              severity="neutral"
            />
          </div>
        </div> */}

        <div className="bg-base-100 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-base-content mb-4">
            Recent Scrims
          </h2>
          {/* {recentScrims.length > 0 ? (
            <div className="space-y-3">
              {recentScrims.map((scrim) => (
                <div
                  key={scrim.scrim}
                  className="border border-base-300 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-base-content">
                      {scrim.teams[0]} vs {scrim.teams[1]}
                    </h3>
                    <span className="text-sm text-base-content/60">
                      {scrim.date.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-base-content/70">
                    {scrim.matches.length} match
                    {scrim.matches.length !== 1 ? "es" : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Recent Scrims"
              description="Recent scrims will appear here"
              size="sm"
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
