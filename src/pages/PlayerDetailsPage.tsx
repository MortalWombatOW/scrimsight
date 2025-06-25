import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Target,
  Activity,
  TrendingUp,
  Zap,
} from "lucide-react";

import { useScrimsightData } from "../lib/useScrimsightData";
import {
  PlayerStatsNumerical,
  PlayerStatsNumericalKeys,
  METRIC_DISPLAY_NAME,
  PLAYER_STAT_RANKING_DIRECTIONS,
} from "../lib/ScrimsightDataModel";
import * as R from "remeda";
import PageHeader from "../components/PageHeader";
import PageSection from "../components/PageSection";
import CardStat from "../components/CardStat";
import EmptyState from "../components/EmptyState";
import BreadCrumbs from "../components/BreadCrumbs";

const PlayerDetailsPage = () => {
  const { playerName } = useParams<{ playerName: string }>();
  const navigate = useNavigate();
  const dataModel = useScrimsightData();

  // Helper function to calculate severity
  const calculateSeverity = (
    value: number,
    averageValue: number,
    metricKey: PlayerStatsNumericalKeys
  ): "neutral" | "good" | "bad" => {
    const higherIsBetter =
      PLAYER_STAT_RANKING_DIRECTIONS[metricKey] === "higher";

    if (higherIsBetter) {
      return value > averageValue ? "good" : "bad";
    } else {
      return value < averageValue ? "good" : "bad";
    }
  };

  const { playerStatBreakdown, playerStatBreakdownRanks, players } = dataModel;

  // Check if player exists
  const playerExists = useMemo(() => {
    return players.some((player) => player.player === playerName);
  }, [players, playerName]);

  // Get player statistics
  const playerStats = useMemo(() => {
    if (!playerName) return null;

    const stats = playerStatBreakdown.byPlayer.find(
      (player) => player.playerName === playerName
    );
    return stats || null;
  }, [playerStatBreakdown.byPlayer, playerName]);

  // Get player stat ranks
  const playerStatRanks = useMemo(() => {
    if (!playerName) return null;

    const ranks = playerStatBreakdownRanks.byPlayer.find(
      (player) => player.playerName === playerName
    );
    return ranks || null;
  }, [playerStatBreakdownRanks.byPlayer, playerName]);

  // Get total count of players for ranking context
  const totalPlayerCount = useMemo(() => {
    return playerStatBreakdownRanks.byPlayer.length;
  }, [playerStatBreakdownRanks.byPlayer]);

  // Compute global averages for all player stats
  const playerAverageStats = useMemo(() => {
    const allPlayers = playerStatBreakdown.byPlayer;
    if (allPlayers.length === 0) return null;

    // Get all numeric keys from PlayerStatsNumerical
    const numericKeys = Object.keys(allPlayers[0]).filter(
      (key) =>
        key !== "playerName" &&
        typeof allPlayers[0][key as keyof typeof allPlayers[0]] === "number"
    ) as PlayerStatsNumericalKeys[];

    // Compute average for each metric
    const averages = R.pipe(
      numericKeys,
      R.map(
        (key) => [key, R.meanBy(allPlayers, (player) => player[key])] as const
      ),
      R.fromEntries()
    ) as PlayerStatsNumerical;

    return averages;
  }, [playerStatBreakdown.byPlayer]);

  if (!playerName) {
    return (
      <EmptyState
        icon={User}
        title="No Player Selected"
        description="Please select a player to view their details."
      />
    );
  }

  if (!playerExists) {
    return (
      <EmptyState
        icon={User}
        title="Player Not Found"
        description={`Player "${playerName}" was not found in the data.`}
      />
    );
  }

  if (!playerStats) {
    return (
      <EmptyState
        icon={User}
        title="No Statistics Available"
        description={`No statistics available for player "${playerName}".`}
      />
    );
  }

  const breadcrumbItems = [
    { label: "Players", href: "/players" },
    { label: playerName, href: `/player/${playerName}` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader>
        <div>
          <BreadCrumbs items={breadcrumbItems} />
          <div className="flex items-center gap-3 mt-2">
            <PageHeader.Icon>
              <User className="w-8 h-8" />
            </PageHeader.Icon>
            <div>
              <PageHeader.Title>{playerName}</PageHeader.Title>
              <p className="text-sm text-base-content/70">
                Player Performance Dashboard
              </p>
            </div>
          </div>
        </div>
      </PageHeader>

      <PageSection variant="card">
        <PageSection.Title>Context</PageSection.Title>
        <PageSection.Description className="mt-1">
          The context of this page is the performance of {playerName}
        </PageSection.Description>
      </PageSection>

      <PageSection variant="card" className="w-fit">
        <PageSection.Title>Offensive Impact</PageSection.Title>
        <PageSection.Description className="mt-1">
          The ability to secure kills and deal damage to your opponents is
          critical for securing wins.
        </PageSection.Description>

        <PageSection.Content layout="flex">
          {[
            "finalBlowsPer10Minutes",
            "heroDamageDealtPer10Minutes",
            "firstKillRate",
          ].map((metricKey) => {
            const key = metricKey as PlayerStatsNumericalKeys;
            const value = (playerStats as PlayerStatsNumerical)[key];
            if (value === undefined) return null;

            const rank = (playerStatRanks as PlayerStatsNumerical)?.[key];
            const averageValue = (playerAverageStats as PlayerStatsNumerical)?.[
              key
            ];
            const severity =
              averageValue !== undefined
                ? calculateSeverity(value, averageValue, key)
                : "neutral";

            return (
              <CardStat
                key={key}
                label={METRIC_DISPLAY_NAME[key]}
                numericValue={value}
                averageValue={averageValue}
                metricKey={key}
                rank={rank}
                totalCount={totalPlayerCount}
                severity={severity}
                size="large"
              />
            );
          })}
        </PageSection.Content>

        <div>
          <h3 className="text-lg font-semibold text-base-content mb-3">
            Secondary Metrics
          </h3>
          <PageSection.Content layout="flex" className="gap-3">
            {[
              "eliminationsPer10Minutes",
              "allDamageDealtPer10Minutes",
              "tankFocusRate",
              "damageFocusRate",
              "supportFocusRate",
            ].map((metricKey) => {
              const key = metricKey as PlayerStatsNumericalKeys;
              const value = (playerStats as PlayerStatsNumerical)[key];
              if (value === undefined) return null;

              const rank = (playerStatRanks as PlayerStatsNumerical)?.[key];
              const averageValue = (playerAverageStats as PlayerStatsNumerical)?.[
                key
              ];
              const severity =
                averageValue !== undefined
                  ? calculateSeverity(value, averageValue, key)
                  : "neutral";

              return (
                <CardStat
                  key={key}
                  label={METRIC_DISPLAY_NAME[key]}
                  numericValue={value}
                  averageValue={averageValue}
                  metricKey={key}
                  rank={rank}
                  totalCount={totalPlayerCount}
                  severity={severity}
                  size="small"
                />
              );
            })}
          </PageSection.Content>
        </div>
      </PageSection>

      {/* Survivability Section */}
      <PageSection variant="card" className="w-fit">
        <PageSection.Title>
          <div className="text-primary">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            Survivability
            <PageSection.Description className="mt-1">
              The ability to survive and withstand enemy attacks is essential,
              as losing a player early can be costly.
            </PageSection.Description>
          </div>
        </PageSection.Title>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-base-content mb-3">
              Primary Metrics
            </h3>
            <PageSection.Content layout="flex">
              {[
                "deathsPer10Minutes",
                "firstDeathRate",
                "teamfightWinRateWithFirstDeath",
              ].map((metricKey) => {
                const key = metricKey as PlayerStatsNumericalKeys;
                const value = (playerStats as PlayerStatsNumerical)[key];
                if (value === undefined) return null;

                const rank = (playerStatRanks as PlayerStatsNumerical)?.[key];
                const averageValue = (playerAverageStats as PlayerStatsNumerical)?.[
                  key
                ];
                const severity =
                  averageValue !== undefined
                    ? calculateSeverity(value, averageValue, key)
                    : "neutral";

                return (
                  <CardStat
                    key={key}
                    label={METRIC_DISPLAY_NAME[key]}
                    numericValue={value}
                    averageValue={averageValue}
                    metricKey={key}
                    rank={rank}
                    totalCount={totalPlayerCount}
                    severity={severity}
                    size="large"
                  />
                );
              })}
            </PageSection.Content>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-base-content mb-3">
              Secondary Metrics
            </h3>
            <PageSection.Content layout="flex" className="gap-3">
              {[
                "damageTakenPer10Minutes",
                "averageLifeDuration",
                "deathsWithUltAvailable",
                "selfHealingPer10Minutes",
              ].map((metricKey) => {
                const key = metricKey as PlayerStatsNumericalKeys;
                const value = (playerStats as PlayerStatsNumerical)[key];
                if (value === undefined) return null;

                const rank = (playerStatRanks as PlayerStatsNumerical)?.[key];
                const averageValue = (playerAverageStats as PlayerStatsNumerical)?.[
                  key
                ];
                const severity =
                  averageValue !== undefined
                    ? calculateSeverity(value, averageValue, key)
                    : "neutral";

                return (
                  <CardStat
                    key={key}
                    label={METRIC_DISPLAY_NAME[key]}
                    numericValue={value}
                    averageValue={averageValue}
                    metricKey={key}
                    rank={rank}
                    totalCount={totalPlayerCount}
                    severity={severity}
                    size="small"
                  />
                );
              })}
            </PageSection.Content>
          </div>
        </div>
      </PageSection>

      {/* Utility Section */}
      <PageSection variant="card" className="w-fit">
        <PageSection.Title>
          <div className="text-primary">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            Utility
            <PageSection.Description className="mt-1">
              Support and space creation are essential to enabling a team to
              win.
            </PageSection.Description>
          </div>
        </PageSection.Title>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-base-content mb-3">
              Primary Metrics
            </h3>
            <PageSection.Content layout="flex">
              {[
                "healingDealtPer10Minutes",
                "totalAssistsPer10Minutes",
                "damageBlockedPer10Minutes",
              ].map((metricKey) => {
                const key = metricKey as PlayerStatsNumericalKeys;
                const value = (playerStats as PlayerStatsNumerical)[key];
                if (value === undefined) return null;

                const rank = (playerStatRanks as PlayerStatsNumerical)?.[key];
                const averageValue = (playerAverageStats as PlayerStatsNumerical)?.[
                  key
                ];
                const severity =
                  averageValue !== undefined
                    ? calculateSeverity(value, averageValue, key)
                    : "neutral";

                return (
                  <CardStat
                    key={key}
                    label={METRIC_DISPLAY_NAME[key]}
                    numericValue={value}
                    averageValue={averageValue}
                    metricKey={key}
                    rank={rank}
                    totalCount={totalPlayerCount}
                    severity={severity}
                    size="large"
                  />
                );
              })}
            </PageSection.Content>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-base-content mb-3">
              Secondary Metrics
            </h3>
            <PageSection.Content layout="flex" className="gap-3">
              {[
                "offensiveAssistsPer10Minutes",
                "defensiveAssistsPer10Minutes",
                "ultimatesUsedPer10Minutes",
                "teamfightWinRate",
              ].map((metricKey) => {
                const key = metricKey as PlayerStatsNumericalKeys;
                const value = (playerStats as PlayerStatsNumerical)[key];
                if (value === undefined) return null;

                const rank = (playerStatRanks as PlayerStatsNumerical)?.[key];
                const averageValue = (playerAverageStats as PlayerStatsNumerical)?.[
                  key
                ];
                const severity =
                  averageValue !== undefined
                    ? calculateSeverity(value, averageValue, key)
                    : "neutral";

                return (
                  <CardStat
                    key={key}
                    label={METRIC_DISPLAY_NAME[key]}
                    numericValue={value}
                    averageValue={averageValue}
                    metricKey={key}
                    rank={rank}
                    totalCount={totalPlayerCount}
                    severity={severity}
                    size="small"
                  />
                );
              })}
            </PageSection.Content>
          </div>
        </div>
      </PageSection>

      {/* Efficiency Section */}
      <PageSection variant="card" className="w-fit">
        <PageSection.Title>
          <div className="text-primary">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            Efficiency
            <PageSection.Description className="mt-1">
              Being able to take advantage of opportunities and make the most of
              your resources is crucial.
            </PageSection.Description>
          </div>
        </PageSection.Title>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-base-content mb-3">
              Primary Metrics
            </h3>
            <PageSection.Content layout="flex">
              {[
                "weaponAccuracy",
                "killsPerUltimate",
                "damageDonePerHealingReceived",
                "damagePerKill",
              ].map((metricKey) => {
                const key = metricKey as PlayerStatsNumericalKeys;
                const value = (playerStats as PlayerStatsNumerical)[key];
                if (value === undefined) return null;

                const rank = (playerStatRanks as PlayerStatsNumerical)?.[key];
                const averageValue = (playerAverageStats as PlayerStatsNumerical)?.[
                  key
                ];
                const severity =
                  averageValue !== undefined
                    ? calculateSeverity(value, averageValue, key)
                    : "neutral";

                return (
                  <CardStat
                    key={key}
                    label={METRIC_DISPLAY_NAME[key]}
                    numericValue={value}
                    averageValue={averageValue}
                    metricKey={key}
                    rank={rank}
                    totalCount={totalPlayerCount}
                    severity={severity}
                    size="large"
                  />
                );
              })}
            </PageSection.Content>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-base-content mb-3">
              Secondary Metrics
            </h3>
            <PageSection.Content layout="flex" className="gap-3">
              {[
                "criticalHitRate",
                "scopedWeaponAccuracy",
                "criticalHitsPer10Minutes",
                "barrierDamageDealtPer10Minutes",
                "teamfightWinRateWithUlt",
              ].map((metricKey) => {
                const key = metricKey as PlayerStatsNumericalKeys;
                const value = (playerStats as PlayerStatsNumerical)[key];
                if (value === undefined) return null;

                const rank = (playerStatRanks as PlayerStatsNumerical)?.[key];
                const averageValue = (playerAverageStats as PlayerStatsNumerical)?.[
                  key
                ];
                const severity =
                  averageValue !== undefined
                    ? calculateSeverity(value, averageValue, key)
                    : "neutral";

                return (
                  <CardStat
                    key={key}
                    label={METRIC_DISPLAY_NAME[key]}
                    numericValue={value}
                    averageValue={averageValue}
                    metricKey={key}
                    rank={rank}
                    totalCount={totalPlayerCount}
                    severity={severity}
                    size="small"
                  />
                );
              })}
            </PageSection.Content>
          </div>
        </div>
      </PageSection>

      {/* Tank Section */}
      <PageSection variant="card" className="w-fit">
        <PageSection.Title>
          <div className="text-primary">
            <Target className="w-6 h-6" />
          </div>
          <div>
            Tank
            <PageSection.Description className="mt-1">
              Tanks excel by creating space and staying alive. High damage
              blocked and objective kills reflect space held and getting the
              team to the objective. Avoiding dying, especially early, is
              crucial to tank success.
            </PageSection.Description>
          </div>
        </PageSection.Title>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-base-content mb-3">
              Primary Metrics
            </h3>
            <PageSection.Content layout="flex">
              {[
                "damageBlockedPer10Minutes",
                "objectiveKillsPer10Minutes",
                "firstDeathRate",
              ].map((metricKey) => {
                const key = metricKey as PlayerStatsNumericalKeys;
                const value = (playerStats as PlayerStatsNumerical)[key];
                if (value === undefined) return null;

                const rank = (playerStatRanks as PlayerStatsNumerical)?.[key];
                const averageValue = (playerAverageStats as PlayerStatsNumerical)?.[
                  key
                ];
                const severity =
                  averageValue !== undefined
                    ? calculateSeverity(value, averageValue, key)
                    : "neutral";

                return (
                  <CardStat
                    key={key}
                    label={METRIC_DISPLAY_NAME[key]}
                    numericValue={value}
                    averageValue={averageValue}
                    metricKey={key}
                    rank={rank}
                    totalCount={totalPlayerCount}
                    severity={severity}
                    size="large"
                  />
                );
              })}
            </PageSection.Content>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-base-content mb-3">
              Secondary Metrics
            </h3>
            <PageSection.Content layout="flex" className="gap-3">
              {[
                "killsPerUltimate",
                "deathsPer10Minutes",
                "damageTakenPer10Minutes",
                "damageDonePerHealingReceived",
              ].map((metricKey) => {
                const key = metricKey as PlayerStatsNumericalKeys;
                const value = (playerStats as PlayerStatsNumerical)[key];
                if (value === undefined) return null;

                const rank = (playerStatRanks as PlayerStatsNumerical)?.[key];
                const averageValue = (playerAverageStats as PlayerStatsNumerical)?.[
                  key
                ];
                const severity =
                  averageValue !== undefined
                    ? calculateSeverity(value, averageValue, key)
                    : "neutral";

                return (
                  <CardStat
                    key={key}
                    label={METRIC_DISPLAY_NAME[key]}
                    numericValue={value}
                    averageValue={averageValue}
                    metricKey={key}
                    rank={rank}
                    totalCount={totalPlayerCount}
                    severity={severity}
                    size="small"
                  />
                );
              })}
            </PageSection.Content>
          </div>
        </div>
      </PageSection>
    </div>
  );
};

export default PlayerDetailsPage;
