import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Users, Trophy, Target, TrendingUp } from "lucide-react";

import { useScrimsightData } from "../lib/useScrimsightData";


import PageHeader from "../components/PageHeader";
import PageSection from "../components/PageSection";
import CardStat from "../components/CardStat";
import EmptyState from "../components/EmptyState";
import BreadCrumbs from "../components/BreadCrumbs";
import ScrimsightPage from "../components/ScrimsightPage";
import TeamHeader from "../components/TeamHeader";
import ScrimCard from "../components/ScrimCard";
import MatchList from "../components/MatchList";
import DataTable from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
// import HeroIcon from "../icons/HeroIcon";
// import RoleIcon from "../icons/RoleIcon";
import { formatDuration, prettyFormat, formatPercentage } from "../lib/format";

import { getRoute } from "../lib/route";

const TeamDetailsPage = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const dataModel = useScrimsightData();

  const {
    playerStatBreakdown,
    // playerStatBreakdownRanks,
    teams,
    scrims,
    matches
  } = dataModel;

  // Helper function to calculate severity
  // const calculateSeverity = (
  //   value: number,
  //   averageValue: number,
  //   metricKey: PlayerStatsNumericalKeys
  // ): "neutral" | "good" | "bad" => {
  //   const higherIsBetter =
  //     PLAYER_STAT_RANKING_DIRECTIONS[metricKey] === "higher";
  //
  //   if (higherIsBetter) {
  //     return value > averageValue ? "good" : "bad";
  //   } else {
  //     return value < averageValue ? "good" : "bad";
  //   }
  // };

  // Get team relationship data
  const teamRelationship = useMemo(() => {
    if (!teamName) return null;

    const team = teams.find((t) => t.team === teamName);
    return team || null;
  }, [teams, teamName]);

  // Get team statistics
  const teamStats = useMemo(() => {
    if (!teamName) return null;

    const stats = playerStatBreakdown.byTeam.find(
      (team) => team.playerTeam === teamName
    );
    return stats || null;
  }, [playerStatBreakdown.byTeam, teamName]);

  // Get team stat ranks
  // const teamStatRanks = useMemo(() => {
  //   if (!teamName) return null;
  //
  //   const ranks = playerStatBreakdownRanks.byTeam.find(
  //     (team) => team.playerTeam === teamName
  //   );
  //   return ranks || null;
  // }, [playerStatBreakdownRanks.byTeam, teamName]);

  // Get total count of teams for ranking context
  // const totalTeamCount = useMemo(() => {
  //   return playerStatBreakdownRanks.byTeam.length;
  // }, [playerStatBreakdownRanks.byTeam]);

  // Compute global averages for all team stats
  // const teamAverageStats = useMemo(() => {
  //   const allTeams = playerStatBreakdown.byTeam;
  //   if (allTeams.length === 0) return null;
  //
  //   // Get all numeric keys from PlayerStatsNumerical
  //   const numericKeys = Object.keys(allTeams[0]).filter(
  //     (key) =>
  //       key !== "playerTeam" &&
  //       typeof allTeams[0][key as keyof typeof allTeams[0]] === "number"
  //   ) as PlayerStatsNumericalKeys[];
  //
  //   // Compute average for each metric
  //   const averages = R.pipe(
  //     numericKeys,
  //     R.map((key) => [
  //       key,
  //       R.pipe(
  //         allTeams,
  //         R.map((team) => team[key] as number),
  //         R.mean()
  //       ),
  //     ]),
  //     R.fromPairs
  //   ) as PlayerStatsNumerical;
  //
  //   return averages;
  // }, [playerStatBreakdown.byTeam]);

  // Get team's player stats
  const teamPlayerStats = useMemo(() => {
    if (!teamName) return [];

    return playerStatBreakdown.byTeamAndPlayer.filter(
      (stat) => stat.playerTeam === teamName
    );
  }, [playerStatBreakdown.byTeamAndPlayer, teamName]);

  // Get team's recent scrims
  const teamRecentScrims = useMemo(() => {
    if (!teamRelationship) return [];

    return scrims
      .filter((scrim) => teamRelationship.scrims.includes(scrim.scrim))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [scrims, teamRelationship]);

  // Get team's recent matches
  const teamRecentMatches = useMemo(() => {
    if (!teamName) return [];

    return matches
      .filter((match) => match.teams.includes(teamName))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [matches, teamName]);

  // Player table columns
  const playerColumns: ColumnDef<any>[] = [
    {
      accessorKey: "playerName",
      header: "Player",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "eliminations",
      header: "Eliminations",
      enableSorting: true,
      cell: ({ getValue }) => prettyFormat(getValue() as number),
    },
    {
      accessorKey: "deaths",
      header: "Deaths",
      enableSorting: true,
      cell: ({ getValue }) => prettyFormat(getValue() as number),
    },
    {
      accessorKey: "heroDamageDealt",
      header: "Hero Damage",
      enableSorting: true,
      cell: ({ getValue }) => prettyFormat(getValue() as number),
    },
    {
      accessorKey: "healingDealt",
      header: "Healing",
      enableSorting: true,
      cell: ({ getValue }) => prettyFormat(getValue() as number),
    },
    {
      accessorKey: "playtime",
      header: "Playtime",
      enableSorting: true,
      cell: ({ getValue }) => formatDuration(getValue() as number),
    },
  ];

  // Calculate team-level metrics
  const winRate = useMemo(() => {
    if (!teamName) return 0;
    
    const teamMatches = matches.filter(match => match.teams.includes(teamName));
    const wins = teamMatches.filter(match => match.winningTeam === teamName);
    return teamMatches.length > 0 ? (wins.length / teamMatches.length) * 100 : 0;
  }, [matches, teamName]);

  const breadcrumbs = [
    { label: "Home", path: getRoute("/") },
    { label: "Teams", path: getRoute("/teams") },
    { label: teamName || "Unknown Team" }
  ];

  if (!teamName || !teamRelationship) {
    return (
      <ScrimsightPage>
        <EmptyState
          icon={Users}
          title="Team not found"
          description="The requested team could not be found in the dataset"
          size="lg"
        />
      </ScrimsightPage>
    );
  }

  const teamfightWinRate = teamStats?.teamfightWinRate || 0;

  return (
    <ScrimsightPage>
      <PageHeader>
        <BreadCrumbs items={breadcrumbs} />
        <PageHeader.Icon>
          <Users size={32} />
        </PageHeader.Icon>
        <PageHeader.Title>{teamName}</PageHeader.Title>
      </PageHeader>

      <TeamHeader teamName={teamName} players={teamRelationship.players} />

      {/* Team Stats */}
      <PageSection>
        <PageSection.Title>Team Statistics</PageSection.Title>
        <PageSection.Content layout="grid">
          <CardStat
            label="Match Win Rate"
            value={formatPercentage(winRate / 100)}
            icon={<Trophy />}
            severity={winRate > 50 ? "good" : "bad"}
            size="large"
          />
          <CardStat
            label="Teamfight Win Rate"
            value={formatPercentage(teamfightWinRate)}
            icon={<Target />}
            severity={teamfightWinRate > 0.5 ? "good" : "bad"}
            size="large"
          />
          <CardStat
            label="Total Scrims"
            value={teamRelationship.scrims.length}
            icon={<TrendingUp />}
            severity="neutral"
            size="large"
          />
          <CardStat
            label="Total Players"
            value={teamRelationship.players.length}
            icon={<Users />}
            severity="neutral"
            size="large"
          />
        </PageSection.Content>
      </PageSection>

      {/* Player Stats */}
      <PageSection>
        <PageSection.Title>Player Statistics</PageSection.Title>
        <PageSection.Description>
          Performance statistics for all players on {teamName}
        </PageSection.Description>
        <PageSection.Content>
          {teamPlayerStats.length > 0 ? (
            <DataTable
              columns={playerColumns}
              data={teamPlayerStats}
              rowKey={(row) => row.playerName}
              defaultSort="eliminations"
            />
          ) : (
            <EmptyState
              icon={Users}
              title="No player stats available"
              description="No statistics are available for this team's players"
              size="sm"
            />
          )}
        </PageSection.Content>
      </PageSection>

      {/* Recent Scrims */}
      <PageSection>
        <PageSection.Title>Recent Scrims</PageSection.Title>
        <PageSection.Description>
          Recent scrimmages played by {teamName}
        </PageSection.Description>
        <PageSection.Content>
          {teamRecentScrims.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {teamRecentScrims.map((scrim) => (
                <ScrimCard key={scrim.scrim} scrimId={scrim.scrim} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Trophy}
              title="No recent scrims"
              description="No recent scrimmages found for this team"
              size="sm"
            />
          )}
        </PageSection.Content>
      </PageSection>

      {/* Recent Matches */}
      <PageSection>
        <PageSection.Title>Recent Matches</PageSection.Title>
        <PageSection.Description>
          Recent individual matches played by {teamName}
        </PageSection.Description>
        <PageSection.Content>
          <MatchList matches={teamRecentMatches} />
        </PageSection.Content>
      </PageSection>
    </ScrimsightPage>
  );
};

export default TeamDetailsPage;
