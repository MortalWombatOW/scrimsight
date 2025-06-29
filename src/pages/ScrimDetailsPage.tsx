import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Target } from "lucide-react";

import DataTable from "../components/DataTable";
import TeamColorDot from "../components/TeamColorDot";
import EmptyState from "../components/EmptyState";
import BreadCrumbs from "../components/BreadCrumbs";
import { MatchCard } from "../components/MatchCard";
import ScrimsightPage from "../components/ScrimsightPage";
import PageHeader from "../components/PageHeader";
import PageSection from "../components/PageSection";
import ScrimHeader from "../components/ScrimHeader";
import { useScrimsightData } from "../hooks/useScrimsightData";
import { 
  MatchRelationships, 
  ScrimRelationships, 
  PlayerStatsNumerical, 
  PlayerName, 
  TeamName, 
  ScrimID 
} from "../lib/ScrimsightDataModel";
import { prettyFormat, formatDuration } from "../lib/format";

const ScrimDetailsPage = () => {
  const { scrimId } = useParams<{ scrimId: string }>();
  const dataModel = useScrimsightData();

  const { scrims, matches, playerStatBreakdown } = dataModel;

  // Find the current scrim
  const currentScrim = useMemo(() => {
    const foundScrim = scrims.find((scrim: ScrimRelationships) => scrim.scrim === scrimId);
    return foundScrim;
  }, [scrims, scrimId]);

  // Get matches for this scrim
  const scrimMatches = useMemo(() => {
    if (!currentScrim) return [];
    return matches.filter((match: MatchRelationships) => 
      currentScrim.matches.includes(match.match)
    );
  }, [matches, currentScrim]);


  // Get player stats for this scrim
  const scrimPlayerStats = useMemo(() => {
    if (!currentScrim) return { team1Stats: [], team2Stats: [] };

    const scrimStats = playerStatBreakdown.byTeamAndScrim.filter(
      (stats) => stats.scrim === scrimId
    );

    const team1Stats = scrimStats.filter(stats => stats.playerTeam === currentScrim.teams[0]);
    const team2Stats = scrimStats.filter(stats => stats.playerTeam === currentScrim.teams[1]);

    return { team1Stats, team2Stats };
  }, [playerStatBreakdown.byTeamAndScrim, currentScrim, scrimId]);


  // Prepare team comparison data for DataTable
  const teamComparisonData = useMemo(() => {
    if (!scrimPlayerStats.team1Stats.length || !scrimPlayerStats.team2Stats.length) {
      return [];
    }

    const team1Totals = scrimPlayerStats.team1Stats[0];
    const team2Totals = scrimPlayerStats.team2Stats[0];

    return [
      {
        metric: 'Eliminations',
        team1: team1Totals.eliminations,
        team2: team2Totals.eliminations,
      },
      {
        metric: 'Deaths',
        team1: team1Totals.deaths,
        team2: team2Totals.deaths,
      },
      {
        metric: 'Hero Damage',
        team1: team1Totals.heroDamageDealt,
        team2: team2Totals.heroDamageDealt,
      },
      {
        metric: 'Healing Dealt',
        team1: team1Totals.healingDealt,
        team2: team2Totals.healingDealt,
      },
      {
        metric: 'Damage Taken',
        team1: team1Totals.damageTaken,
        team2: team2Totals.damageTaken,
      },
      {
        metric: 'Ultimates Used',
        team1: team1Totals.ultimatesUsed,
        team2: team2Totals.ultimatesUsed,
      },
    ];
  }, [scrimPlayerStats]);

  // Prepare player stats data for DataTable
  const allPlayerStats = useMemo(() => {
    if (!currentScrim) return [];

    return playerStatBreakdown.byTeamAndPlayerAndScrim.filter(
      (stats) => stats.scrim === scrimId
    );
  }, [playerStatBreakdown.byTeamAndPlayerAndScrim, currentScrim, scrimId]);

  type TeamComparisonRow = {
    metric: string;
    team1: number;
    team2: number;
  };

  // Team comparison table columns
  const teamComparisonColumns: ColumnDef<TeamComparisonRow>[] = [
    {
      accessorKey: "metric",
      header: "Metric",
      enableSorting: false,
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "team1",
      header: currentScrim?.teams[0] || "Team 1",
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <TeamColorDot teamName={currentScrim?.teams[0] || ""} size={12} />
          <span>{prettyFormat(getValue() as number)}</span>
        </div>
      ),
    },
    {
      accessorKey: "team2",
      header: currentScrim?.teams[1] || "Team 2",
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <TeamColorDot teamName={currentScrim?.teams[1] || ""} size={12} />
          <span>{prettyFormat(getValue() as number)}</span>
        </div>
      ),
    },
  ];

  type PlayerStatEntry = { playerName: PlayerName; playerTeam: TeamName; scrim: ScrimID } & PlayerStatsNumerical;

  // Player stats table columns
  const playerStatsColumns: ColumnDef<PlayerStatEntry>[] = [
    {
      accessorKey: "playerName",
      header: "Player",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "playerTeam",
      header: "Team",
      enableSorting: true,
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <TeamColorDot teamName={getValue() as string} size={12} />
          <span>{getValue() as string}</span>
        </div>
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
      accessorKey: "ultimatesUsed",
      header: "Ults Used",
      enableSorting: true,
      cell: ({ getValue }) => getValue() as number,
    },
    {
      accessorKey: "playtime",
      header: "Playtime",
      enableSorting: true,
      cell: ({ getValue }) => formatDuration(getValue() as number),
    },
  ];

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Scrims", path: "/scrims" },
    { label: scrimId || "Unknown Scrim" }
  ];

  if (!scrimId) {
    return (
      <ScrimsightPage>
        <EmptyState
          icon={Target}
          title="Invalid Scrim"
          description="No scrim ID provided"
          size="lg"
        />
      </ScrimsightPage>
    );
  }

  if (!currentScrim) {
    return (
      <ScrimsightPage>
        <EmptyState
          icon={Target}
          title="Scrim Not Found"
          description={`No scrim found with ID: ${scrimId}`}
          size="lg"
        />
      </ScrimsightPage>
    );
  }

  return (
    <ScrimsightPage>
      <PageHeader>
        <BreadCrumbs items={breadcrumbs} />
        <PageHeader.Icon>
          <Target size={32} />
        </PageHeader.Icon>
        <PageHeader.Title>Scrim Details</PageHeader.Title>
      </PageHeader>

      <ScrimHeader
        scrimId={currentScrim.scrim}
        date={currentScrim.date}
        team1Name={currentScrim.teams[0]}
        team2Name={currentScrim.teams[1]}
        team1MatchesWon={currentScrim.team1MatchesWon}
        team2MatchesWon={currentScrim.team2MatchesWon}
      />

      {/* Matches Section */}
      <PageSection>
        <PageSection.Title>Matches</PageSection.Title>
        <PageSection.Description>
          All matches played during this scrim
        </PageSection.Description>
        <PageSection.Content>
          {scrimMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scrimMatches.map((match) => (
                <MatchCard key={match.match} matchId={match.match} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Target}
              title="No matches found"
              description="No matches were played in this scrim"
              size="sm"
            />
          )}
        </PageSection.Content>
      </PageSection>

      {/* Team Stats Comparison */}
      <PageSection>
        <PageSection.Title>Team Stats Comparison</PageSection.Title>
        <PageSection.Description>
          Side-by-side comparison of team aggregate statistics for this scrim
        </PageSection.Description>
        <PageSection.Content>
          {teamComparisonData.length > 0 ? (
            <DataTable
              columns={teamComparisonColumns}
              data={teamComparisonData}
              rowKey={(row) => row.metric}
            />
          ) : (
            <EmptyState
              icon={Target}
              title="No team stats available"
              description="Unable to load team comparison data"
              size="sm"
            />
          )}
        </PageSection.Content>
      </PageSection>

      {/* Player Stats */}
      <PageSection>
        <PageSection.Title>Player Stats</PageSection.Title>
        <PageSection.Description>
          Individual player performance statistics for all participants in this scrim
        </PageSection.Description>
        <PageSection.Content>
          {allPlayerStats.length > 0 ? (
            <DataTable
              columns={playerStatsColumns}
              data={allPlayerStats}
              rowKey={(row) => `${row.playerName}-${row.playerTeam}`}
              defaultSort="eliminations"
            />
          ) : (
            <EmptyState
              icon={Target}
              title="No player stats available"
              description="Unable to load player statistics for this scrim"
              size="sm"
            />
          )}
        </PageSection.Content>
      </PageSection>
    </ScrimsightPage>
  );
};

export default ScrimDetailsPage;