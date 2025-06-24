import { ReactNode } from "react";
import { ScrimsightMetricFocus, PlayerStatsNumerical, PlayerStatsNumericalKeys } from "../lib/ScrimsightDataModel";
import CardStat from "./CardStat";
import { prettyFormat } from "../lib/format";
import { Target, TrendingUp, Activity, Zap } from "lucide-react";

interface MetricFocusSectionProps {
  metricFocus: ScrimsightMetricFocus;
  playerStats: PlayerStatsNumerical;
  className?: string;
}

const MetricFocusSection = ({
  metricFocus,
  playerStats,
  className = "",
}: MetricFocusSectionProps) => {
  const getFocusIcon = (focus: string): ReactNode => {
    switch (focus.toLowerCase()) {
      case "offensive impact":
        return <Target className="w-6 h-6" />;
      case "survivability":
        return <Activity className="w-6 h-6" />;
      case "utility":
        return <TrendingUp className="w-6 h-6" />;
      case "efficiency":
        return <Zap className="w-6 h-6" />;
      default:
        return <Target className="w-6 h-6" />;
    }
  };

  const getMetricSeverity = (
    metricKey: PlayerStatsNumericalKeys,
    value: number
  ): "neutral" | "good" | "bad" => {
    const lowerIsBetterMetrics = [
      "deathsPer10Minutes",
      "firstDeathRate",
      "deathsWithUltAvailable",
      "damageTakenPer10Minutes",
    ];

    if (lowerIsBetterMetrics.includes(metricKey)) {
      return value < 5 ? "good" : value > 10 ? "bad" : "neutral";
    }

    return value > 10 ? "good" : value < 5 ? "bad" : "neutral";
  };

  const formatMetricValue = (
    metricKey: PlayerStatsNumericalKeys,
    value: number
  ): string => {
    if (metricKey.includes("Rate") || metricKey.includes("Accuracy")) {
      return `${(value * 100).toFixed(1)}%`;
    }
    if (metricKey.includes("Per10Minutes")) {
      return prettyFormat(value, 1);
    }
    return prettyFormat(value, 2);
  };

  const getMetricLabel = (metricKey: PlayerStatsNumericalKeys): string => {
    const labels: Record<string, string> = {
      finalBlowsPer10Minutes: "Final Blows/10min",
      heroDamageDealtPer10Minutes: "Hero Damage/10min",
      firstKillRate: "First Kill Rate",
      eliminationsPer10Minutes: "Eliminations/10min",
      allDamageDealtPer10Minutes: "All Damage/10min",
      tankFocusRate: "Tank Focus Rate",
      damageFocusRate: "Damage Focus Rate",
      supportFocusRate: "Support Focus Rate",
      deathsPer10Minutes: "Deaths/10min",
      firstDeathRate: "First Death Rate",
      teamfightWinRateWithFirstDeath: "Win Rate w/ First Death",
      damageTakenPer10Minutes: "Damage Taken/10min",
      averageLifeDuration: "Avg Life Duration",
      deathsWithUltAvailable: "Deaths w/ Ult Available",
      selfHealingPer10Minutes: "Self Healing/10min",
      healingDealtPer10Minutes: "Healing/10min",
      totalAssistsPer10Minutes: "Assists/10min",
      damageBlockedPer10Minutes: "Damage Blocked/10min",
      offensiveAssistsPer10Minutes: "Offensive Assists/10min",
      defensiveAssistsPer10Minutes: "Defensive Assists/10min",
      ultimatesUsedPer10Minutes: "Ultimates Used/10min",
      teamfightWinRate: "Teamfight Win Rate",
      weaponAccuracy: "Weapon Accuracy",
      killsPerUltimate: "Kills/Ultimate",
      damageDonePerHealingReceived: "Damage/Healing Received",
      damagePerKill: "Damage/Kill",
      criticalHitRate: "Critical Hit Rate",
      scopedWeaponAccuracy: "Scoped Accuracy",
      criticalHitsPer10Minutes: "Critical Hits/10min",
      barrierDamageDealtPer10Minutes: "Barrier Damage/10min",
      teamfightWinRateWithUlt: "Win Rate w/ Ult",
    };
    return labels[metricKey] || metricKey;
  };

  return (
    <div className={`bg-base-100 rounded-lg p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-primary">{getFocusIcon(metricFocus.focus)}</div>
        <div>
          <h2 className="text-2xl font-bold text-base-content">
            {metricFocus.focus}
          </h2>
          <p className="text-sm text-base-content/70 mt-1">
            {metricFocus.description}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-base-content mb-3">
            Primary Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricFocus.primaryMetrics.map((metricKey) => {
              const value = playerStats[metricKey];
              if (value === undefined) return null;
              
              return (
                <CardStat
                  key={metricKey}
                  label={getMetricLabel(metricKey)}
                  value={formatMetricValue(metricKey, value)}
                  severity={getMetricSeverity(metricKey, value)}
                />
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-base-content mb-3">
            Secondary Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {metricFocus.secondaryMetrics.map((metricKey) => {
              const value = playerStats[metricKey];
              if (value === undefined) return null;
              
              return (
                <CardStat
                  key={metricKey}
                  label={getMetricLabel(metricKey)}
                  value={formatMetricValue(metricKey, value)}
                  severity={getMetricSeverity(metricKey, value)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricFocusSection;