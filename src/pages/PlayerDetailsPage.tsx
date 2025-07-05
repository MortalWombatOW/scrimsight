import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  User,
  Target,
  Activity,
  TrendingUp,
  Zap,
  Clock,
  Award,
} from "lucide-react";

import { useScrimsightData } from "../hooks/useScrimsightData";
import {
  PlayerStatsNumerical,
  PlayerStatsNumericalKeys,
  PLAYER_STAT_RANKING_DIRECTIONS,
  Role,
  Hero,
  PlayerName,
  TeamName,
  PlayerRelationships,
  ScrimRelationships,
} from "../lib/ScrimsightDataModel";
import * as R from "remeda";
import PageHeader from "../components/PageHeader";
import PageSection from "../components/PageSection";
import CardStat from "../components/CardStat";
import EmptyState from "../components/EmptyState";
import BreadCrumbs from "../components/BreadCrumbs";
import ScrimsightPage from "../components/ScrimsightPage";
import ScrimCard from "../components/ScrimCard";
import HeroCard from "../components/HeroCard";
import RoleCard from "../components/RoleCard";
import TeamCard from "../components/TeamCard";
import HeroIcon from "../icons/HeroIcon";
import ChartWrapper from "../components/ChartWrapper";
import DataTable from "../components/DataTable";
import { formatDuration } from "../lib/format";

import { getRoute } from "../lib/route";

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
    { label: "Players", href: getRoute("/players") },
    { label: playerName, href: getRoute(`/player/${playerName}`) },
  ];

  const PlayerPageHeader = ({ playerName }: { playerName: PlayerName }) => {
    return (
      <>
        <BreadCrumbs items={breadcrumbItems} />
        <PageHeader>
          <PageHeader.Icon>
            <User className="w-8 h-8" />
          </PageHeader.Icon>
          <PageHeader.Title>{playerName}</PageHeader.Title>
        </PageHeader>
      </>
    );
  };

  const PlayerOverview = ({
    playerData,
  }: {
    playerData: PlayerRelationships;
  }) => {
    const topHeroes = playerData.heroes
      .sort((a, b) => b.playtime - a.playtime)
      .slice(0, 5);

    const topRoles = playerData.roles
      .sort((a, b) => b.playtime - a.playtime)
      .filter((role) => role.playtime > 0);

    return (
      <PageSection variant="card">
        <PageSection.Title as="h2">Overview</PageSection.Title>
        <PageSection.Content layout="grid">
          <CardStat
            label="Teams"
            value={
              <div className="flex flex-wrap gap-2">
                {playerData.teams.map((team: TeamName) => (
                  <TeamCard key={team} teamName={team} />
                ))}
              </div>
            }
            icon={<Target />}
          />
          <CardStat
            label="Top Heroes"
            value={
              <div className="flex flex-wrap gap-2">
                {topHeroes.map((hero) => (
                  <HeroCard
                    key={hero.hero}
                    hero={hero.hero}
                    playtime={hero.playtime}
                  />
                ))}
              </div>
            }
            icon={<Award />}
          />
          <CardStat
            label="Primary Roles"
            value={
              <div className="flex flex-wrap gap-2">
                {topRoles.map((role) => (
                  <RoleCard key={role.role} role={role.role} playtime={role.playtime} />
                ))}
              </div>
            }
            icon={<Activity />}
          />
        </PageSection.Content>
      </PageSection>
    );
  };

  const PerformanceSummary = ({
    stats,
    averageStats,
    ranks,
    totalCount,
  }: {
    stats: PlayerStatsNumerical;
    averageStats: PlayerStatsNumerical;
    ranks: PlayerStatsNumerical;
    totalCount: number;
  }) => {
    // Use the derived KDR field instead of manual calculation
    const kdrRatio = stats.kdr;
    const avgKdrRatio = averageStats.kdr;

    return (
      <PageSection variant="card">
        <PageSection.Title as="h2">Performance Summary</PageSection.Title>
        <PageSection.Description>
          Key performance indicators and overall statistics
        </PageSection.Description>
        <PageSection.Content layout="grid">
          <CardStat
            label="K/D Ratio"
            numericValue={kdrRatio}
            averageValue={avgKdrRatio}
            metricKey="kdr"
            rank={ranks.kdr}
            totalCount={totalCount}
            severity={calculateSeverity(kdrRatio, avgKdrRatio, "kdr")}
            icon={<Target />}
          />
          <CardStat
            label="Eliminations/10min"
            numericValue={stats.eliminationsPer10Minutes}
            averageValue={averageStats.eliminationsPer10Minutes}
            metricKey="eliminationsPer10Minutes"
            rank={ranks.eliminationsPer10Minutes}
            totalCount={totalCount}
            severity={calculateSeverity(
              stats.eliminationsPer10Minutes,
              averageStats.eliminationsPer10Minutes,
              "eliminationsPer10Minutes"
            )}
            icon={<Zap />}
          />
          <CardStat
            label="Hero Damage/10min"
            numericValue={stats.heroDamageDealtPer10Minutes}
            averageValue={averageStats.heroDamageDealtPer10Minutes}
            metricKey="heroDamageDealtPer10Minutes"
            rank={ranks.heroDamageDealtPer10Minutes}
            totalCount={totalCount}
            severity={calculateSeverity(
              stats.heroDamageDealtPer10Minutes,
              averageStats.heroDamageDealtPer10Minutes,
              "heroDamageDealtPer10Minutes"
            )}
            icon={<TrendingUp />}
          />
          <CardStat
            label="Deaths/10min"
            numericValue={stats.deathsPer10Minutes}
            averageValue={averageStats.deathsPer10Minutes}
            metricKey="deathsPer10Minutes"
            rank={ranks.deathsPer10Minutes}
            totalCount={totalCount}
            severity={calculateSeverity(
              stats.deathsPer10Minutes,
              averageStats.deathsPer10Minutes,
              "deathsPer10Minutes"
            )}
            icon={<Activity />}
          />
          <CardStat
            label="Ultimate Charge Time"
            numericValue={stats.ultimateChargeTime}
            averageValue={averageStats.ultimateChargeTime}
            metricKey="ultimateChargeTime"
            rank={ranks.ultimateChargeTime}
            totalCount={totalCount}
            severity={calculateSeverity(
              stats.ultimateChargeTime,
              averageStats.ultimateChargeTime,
              "ultimateChargeTime"
            )}
            icon={<Clock />}
          />
          <CardStat
            label="Teamfight Win Rate"
            numericValue={stats.teamfightWinRate * 100}
            averageValue={averageStats.teamfightWinRate * 100}
            metricKey="teamfightWinRate"
            rank={ranks.teamfightWinRate}
            totalCount={totalCount}
            severity={calculateSeverity(
              stats.teamfightWinRate,
              averageStats.teamfightWinRate,
              "teamfightWinRate"
            )}
            icon={<Award />}
          />
        </PageSection.Content>
      </PageSection>
    );
  };

  const RoleAnalysis = ({
    stats,
    averageStats,
    playerRoles,
    ranks,
    totalCount,
  }: {
    stats: PlayerStatsNumerical;
    averageStats: PlayerStatsNumerical;
    playerRoles: { role: Role; playtime: number }[];
    ranks: PlayerStatsNumerical;
    totalCount: number;
  }) => {
    const activeRoles = playerRoles
      .filter((role) => role.playtime > 0)
      .sort((a, b) => b.playtime - a.playtime);

    if (activeRoles.length === 0) return null;

    const TankAnalysis = () => (
      <PageSection variant="bordered">
        <PageSection.Title as="h3">Tank Performance</PageSection.Title>
        <PageSection.Content layout="grid">
          <CardStat
            label="Damage Blocked/10min"
            numericValue={stats.damageBlockedPer10Minutes}
            averageValue={averageStats.damageBlockedPer10Minutes}
            metricKey="damageBlockedPer10Minutes"
            rank={ranks.damageBlockedPer10Minutes}
            totalCount={totalCount}
            severity={calculateSeverity(
              stats.damageBlockedPer10Minutes,
              averageStats.damageBlockedPer10Minutes,
              "damageBlockedPer10Minutes"
            )}
          />
          <CardStat
            label="Damage Taken/10min"
            numericValue={stats.damageTakenPer10Minutes}
            averageValue={averageStats.damageTakenPer10Minutes}
            metricKey="damageTakenPer10Minutes"
            rank={ranks.damageTakenPer10Minutes}
            totalCount={totalCount}
            severity={calculateSeverity(
              stats.damageTakenPer10Minutes,
              averageStats.damageTakenPer10Minutes,
              "damageTakenPer10Minutes"
            )}
          />
        </PageSection.Content>
      </PageSection>
    );

    const DamageAnalysis = () => (
      <PageSection variant="bordered">
        <PageSection.Title as="h3">Damage Performance</PageSection.Title>
        <PageSection.Content layout="grid">
          <CardStat
            label="Final Blows/10min"
            numericValue={stats.finalBlowsPer10Minutes}
            averageValue={averageStats.finalBlowsPer10Minutes}
            metricKey="finalBlowsPer10Minutes"
            rank={ranks.finalBlowsPer10Minutes}
            totalCount={totalCount}
            severity={calculateSeverity(
              stats.finalBlowsPer10Minutes,
              averageStats.finalBlowsPer10Minutes,
              "finalBlowsPer10Minutes"
            )}
          />
          <CardStat
            label="Solo Kills/10min"
            numericValue={stats.soloKillsPer10Minutes}
            averageValue={averageStats.soloKillsPer10Minutes}
            metricKey="soloKillsPer10Minutes"
            rank={ranks.soloKillsPer10Minutes}
            totalCount={totalCount}
            severity={calculateSeverity(
              stats.soloKillsPer10Minutes,
              averageStats.soloKillsPer10Minutes,
              "soloKillsPer10Minutes"
            )}
          />
          <CardStat
            label="Weapon Accuracy"
            numericValue={stats.weaponAccuracy * 100}
            averageValue={averageStats.weaponAccuracy * 100}
            metricKey="weaponAccuracy"
            rank={ranks.weaponAccuracy}
            totalCount={totalCount}
            severity={calculateSeverity(
              stats.weaponAccuracy,
              averageStats.weaponAccuracy,
              "weaponAccuracy"
            )}
          />
        </PageSection.Content>
      </PageSection>
    );

    const SupportAnalysis = () => (
      <PageSection variant="bordered">
        <PageSection.Title as="h3">Support Performance</PageSection.Title>
        <PageSection.Content layout="grid">
          <CardStat
            label="Healing/10min"
            numericValue={stats.healingDealtPer10Minutes}
            averageValue={averageStats.healingDealtPer10Minutes}
            metricKey="healingDealtPer10Minutes"
            rank={ranks.healingDealtPer10Minutes}
            totalCount={totalCount}
            severity={calculateSeverity(
              stats.healingDealtPer10Minutes,
              averageStats.healingDealtPer10Minutes,
              "healingDealtPer10Minutes"
            )}
          />
          <CardStat
            label="Defensive Assists/10min"
            numericValue={stats.defensiveAssistsPer10Minutes}
            averageValue={averageStats.defensiveAssistsPer10Minutes}
            metricKey="defensiveAssistsPer10Minutes"
            rank={ranks.defensiveAssistsPer10Minutes}
            totalCount={totalCount}
            severity={calculateSeverity(
              stats.defensiveAssistsPer10Minutes,
              averageStats.defensiveAssistsPer10Minutes,
              "defensiveAssistsPer10Minutes"
            )}
          />
        </PageSection.Content>
      </PageSection>
    );

    return (
      <PageSection variant="card">
        <PageSection.Title as="h2">Role Analysis</PageSection.Title>
        <PageSection.Description>
          Performance breakdown by role
        </PageSection.Description>
        <PageSection.Content layout="stack">
          {activeRoles.map((role) => {
            switch (role.role) {
              case "tank":
                return <TankAnalysis key="tank" />;
              case "damage":
                return <DamageAnalysis key="damage" />;
              case "support":
                return <SupportAnalysis key="support" />;
              default:
                return null;
            }
          })}
        </PageSection.Content>
      </PageSection>
    );
  };

  const HeroBreakdown = ({
    heroStats,
  }: {
    heroStats: (PlayerStatsNumerical & {
      playerName: PlayerName;
      playerHero: Hero;
    })[];
  }) => {
    const heroPerformanceData = heroStats
      .filter((hero) => hero.playtime > 0)
      .sort((a, b) => b.playtime - a.playtime)
      .slice(0, 10)
      .map((hero) => ({
        hero: hero.playerHero,
        winRate: hero.teamfightWinRate * 100,
        playtime: hero.playtime,
        kdr: hero.kdr,
      }));

    const chartConfig = {
      type: "bar" as const,
      data: heroPerformanceData.map((hero) => ({
        name: hero.hero,
        value: hero.winRate,
      })),
      series: [{ dataKey: "value", name: "Win Rate %" }],
      xAxis: { dataKey: "name" },
      height: 300,
    };

    const columns = [
      {
        accessorKey: "playerHero",
        header: "Hero",
        cell: ({ row }: { row: { original: { playerHero: Hero } } }) => (
          <div className="flex items-center gap-2">
            <HeroIcon hero={row.original.playerHero} size={24} />
            <span>{row.original.playerHero}</span>
          </div>
        ),
      },
      {
        accessorKey: "playtime",
        header: "Playtime",
        cell: ({ row }: { row: { original: { playtime: number } } }) =>
          formatDuration(row.original.playtime),
      },
      {
        accessorKey: "eliminations",
        header: "Eliminations",
      },
      {
        accessorKey: "deaths",
        header: "Deaths",
      },
      {
        accessorKey: "teamfightWinRate",
        header: "Win Rate",
        cell: ({ row }: { row: { original: { teamfightWinRate: number } } }) =>
          `${(row.original.teamfightWinRate * 100).toFixed(1)}%`,
      },
    ];

    return (
      <PageSection variant="card">
        <PageSection.Title as="h2">Hero Performance</PageSection.Title>
        <PageSection.Description>
          Performance breakdown by hero
        </PageSection.Description>
        <PageSection.Content layout="stack">
          <ChartWrapper title="Hero Win Rates" config={chartConfig} />
          <DataTable
            columns={columns}
            data={heroStats.filter((hero) => hero.playtime > 0)}
            rowKey={(row) => `${row.playerHero}-${row.playerName}`}
            defaultSort="playtime"
          />
        </PageSection.Content>
      </PageSection>
    );
  };

  const RecentActivity = ({ scrims }: { scrims: ScrimRelationships[] }) => {
    return (
      <PageSection variant="card">
        <PageSection.Title as="h2">Recent Activity</PageSection.Title>
        <PageSection.Description>
          Latest scrims participated in
        </PageSection.Description>
        <PageSection.Content layout="stack">
          {scrims.map((scrim) => (
            <ScrimCard key={scrim.scrim} scrimId={scrim.scrim} />
          ))}
        </PageSection.Content>
      </PageSection>
    );
  };

  return (
    <ScrimsightPage>
      <PlayerPageHeader playerName={playerName} />
      <PlayerOverview playerData={playerRelationship} />
      {playerStats && playerAverageStats && playerStatRanks && (
        <PerformanceSummary
          stats={playerStats}
          averageStats={playerAverageStats}
          ranks={playerStatRanks}
          totalCount={totalPlayerCount}
        />
      )}
      {playerStats && playerAverageStats && playerStatRanks && (
        <RoleAnalysis
          stats={playerStats}
          averageStats={playerAverageStats}
          playerRoles={playerRelationship.roles}
          ranks={playerStatRanks}
          totalCount={totalPlayerCount}
        />
      )}
      <HeroBreakdown
        heroStats={playerStatBreakdown.byPlayerAndHero.filter(
          (h) => h.playerName === playerName
        )}
      />
      <RecentActivity scrims={playerRecentScrims} />
    </ScrimsightPage>
  );
};

export default PlayerDetailsPage;
