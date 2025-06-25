import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { User, Target, Activity, TrendingUp, Zap } from "lucide-react";

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
import ScrimsightPage from "../components/ScrimsightPage";
import TeamColorDot from "../components/TeamColorDot";
import ScrimCard from "../components/ScrimCard";
import HeroIcon from "../icons/HeroIcon";
import RoleIcon from "../icons/RoleIcon";
import { formatDuration } from "../lib/format";

const PlayerDetailsPage = () => {
  const { playerName } = useParams<{ playerName: string }>();
  // const navigate = useNavigate();
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

  const {
    playerStatBreakdown,
    playerStatBreakdownRanks,
    players,
    scrims,
  } = dataModel;

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

  // Get player relationship data (heroes and roles with playtime)
  const playerRelationship = useMemo(() => {
    if (!playerName) return null;

    const player = players.find((p) => p.player === playerName);
    return player || null;
  }, [players, playerName]);

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

  // Get player's teams
  const playerTeams = useMemo(() => {
    if (!playerName || !playerRelationship) return [];
    return playerRelationship.teams;
  }, [playerRelationship, playerName]);

  // Get player's recent scrims (last 5)
  const playerRecentScrims = useMemo(() => {
    if (!playerName || !playerRelationship) return [];

    return scrims
      .filter((scrim) => playerRelationship.scrims.includes(scrim.scrim))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [playerRelationship, playerName, scrims]);

  if (
    !playerName ||
    !playerRelationship ||
    !playerStats ||
    !playerTeams.length ||
    !playerRecentScrims.length
  ) {
    return (
      <EmptyState
        icon={User}
        title="No Player Selected"
        description="Please select a player to view their details."
      />
    );
  }

  const breadcrumbItems = [
    { label: "Players", href: "/players" },
    { label: playerName, href: `/player/${playerName}` },
  ];

  return (
    <ScrimsightPage>
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

      <div className="flex flex-wrap gap-6">
        <PageSection variant="card" className="w-fit">
          <PageSection.Title>Roles</PageSection.Title>

          <PageSection.Content layout="flex" className="gap-4">
            {playerRelationship.roles.map((roleEntry) => (
              <div
                key={roleEntry.role}
                className="flex flex-col items-center p-4 bg-base-200 rounded-lg min-w-[120px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-base-300 rounded-full">
                    <RoleIcon
                      role={roleEntry.role}
                      color="primary"
                      className="text-xl"
                    />
                  </div>
                </div>
                <h4 className="font-medium text-base-content text-center capitalize">
                  {roleEntry.role}
                </h4>
                <p className="text-sm text-base-content/70 mt-1">
                  {formatDuration(roleEntry.playtime)}
                </p>
              </div>
            ))}
          </PageSection.Content>
        </PageSection>

        <PageSection variant="card" className="w-fit">
          <PageSection.Title>Top Heroes</PageSection.Title>

          <PageSection.Content layout="flex" className="gap-4">
            {playerRelationship.heroes.slice(0, 5).map((heroEntry, index) => (
              <div
                key={heroEntry.hero}
                className="flex flex-col items-center p-4 bg-base-200 rounded-lg min-w-[120px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-base-content/60">
                    #{index + 1}
                  </span>
                  <HeroIcon hero={heroEntry.hero} size={40} showTooltip />
                </div>
                <h4 className="font-medium text-base-content text-center">
                  {heroEntry.hero}
                </h4>
                <p className="text-sm text-base-content/70 mt-1">
                  {formatDuration(heroEntry.playtime)}
                </p>
              </div>
            ))}
          </PageSection.Content>
        </PageSection>

        <PageSection variant="card" className="w-fit mb-6">
          <PageSection.Title>Teams</PageSection.Title>

          <PageSection.Content layout="flex" className="gap-4">
            {playerTeams.map((teamName) => (
              <div
                key={teamName}
                className="flex flex-col items-center p-4 bg-base-200 rounded-lg min-w-[120px]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TeamColorDot teamName={teamName} size={24} />
                </div>
                <h4 className="font-medium text-base-content text-center">
                  {teamName}
                </h4>
              </div>
            ))}
          </PageSection.Content>
        </PageSection>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-base-content mb-6">
          Recent Scrims
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {playerRecentScrims.map((scrim) => (
            <ScrimCard key={scrim.scrim} scrimId={scrim.scrim} />
          ))}
        </div>
      </div>

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
    </ScrimsightPage>
  );
};

export default PlayerDetailsPage;
