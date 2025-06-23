import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Target, ArrowLeft, Clock, Map } from "lucide-react";

import CardStat from "@components/CardStat";
import DataTable from "@components/DataTable";
import StatDistributionAndTop from "@components/StatDistributionAndTop";
import TeamColorDot from "@components/TeamColorDot";
import EmptyState from "@components/EmptyState";
import BreadCrumbs from "@components/BreadCrumbs";
import ScatterChart, { ScatterDataPoint } from "@components/ScatterChart";
import { useScrimsightData } from "@library/useScrimsightData";
import { MatchRelationships, ScrimRelationships } from "@library/ScrimsightDataModel";
import { getColorgorical } from "@library/color";

interface MatchTableRow {
  matchId: string;
  map: string;
  gameMode: string;
  duration: string;
  team1Score: number;
  team2Score: number;
  winner: string;
  date: string;
  time: string;
}

const ScrimDetailsPage = () => {
  const { scrimId } = useParams<{ scrimId: string }>();
  const navigate = useNavigate();
  const dataModel = useScrimsightData();

  const { scrims, matches, playerStatBreakdown } = dataModel;

  // Find the current scrim
  const currentScrim = useMemo(() => {
    return scrims.find((scrim: ScrimRelationships) => scrim.scrim === scrimId);
  }, [scrims, scrimId]);

  // Get matches for this scrim
  const scrimMatches = useMemo(() => {
    if (!currentScrim) return [];
    return matches.filter((match: MatchRelationships) => 
      currentScrim.matches.includes(match.match)
    );
  }, [matches, currentScrim]);

  // Calculate scrim statistics
  const scrimStats = useMemo(() => {
    if (!currentScrim || !scrimMatches.length) {
      return {
        totalMatches: 0,
        totalDuration: 0,
        avgMatchDuration: 0,
        team1Wins: 0,
        team2Wins: 0,
      };
    }

    const totalDuration = scrimMatches.reduce((sum, match) => sum + match.duration, 0);
    const team1Wins = scrimMatches.filter(match => match.winningTeam === currentScrim.teams[0]).length;
    const team2Wins = scrimMatches.filter(match => match.winningTeam === currentScrim.teams[1]).length;

    return {
      totalMatches: scrimMatches.length,
      totalDuration,
      avgMatchDuration: Math.round(totalDuration / scrimMatches.length / 60), // in minutes
      team1Wins,
      team2Wins,
    };
  }, [currentScrim, scrimMatches]);

  // Prepare match table data
  const matchTableData = useMemo(() => {
    return scrimMatches.map((match): MatchTableRow => {
      const durationMinutes = Math.floor(match.duration / 60);
      const durationSeconds = match.duration % 60;
      
      return {
        matchId: match.match,
        map: match.map,
        gameMode: match.gameMode,
        duration: `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`,
        team1Score: match.team1Score,
        team2Score: match.team2Score,
        winner: match.winningTeam,
        date: match.date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: match.date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
    });
  }, [scrimMatches]);

  // Match table columns
  const matchColumns: ColumnDef<MatchTableRow>[] = [
    {
      accessorKey: "map",
      header: "Map",
      enableSorting: true,
    },
    {
      accessorKey: "gameMode",
      header: "Mode",
      enableSorting: true,
    },
    {
      accessorKey: "team1Score",
      header: currentScrim?.teams[0] || "Team 1",
      enableSorting: true,
      cell: ({ getValue, row }) => (
        <div className="flex items-center gap-2">
          <TeamColorDot teamName={currentScrim?.teams[0] || ""} size={12} />
          <span className={
            row.original.winner === currentScrim?.teams[0] 
              ? "font-semibold text-success" 
              : ""
          }>
            {getValue() as number}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "team2Score",
      header: currentScrim?.teams[1] || "Team 2",
      enableSorting: true,
      cell: ({ getValue, row }) => (
        <div className="flex items-center gap-2">
          <TeamColorDot teamName={currentScrim?.teams[1] || ""} size={12} />
          <span className={
            row.original.winner === currentScrim?.teams[1] 
              ? "font-semibold text-success" 
              : ""
          }>
            {getValue() as number}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      enableSorting: true,
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span className="font-mono">{getValue() as string}</span>
        </div>
      ),
    },
    {
      accessorKey: "time",
      header: "Time",
      enableSorting: true,
    },
  ];

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

  // Calculate team comparison stats
  const teamComparison = useMemo(() => {
    if (!scrimPlayerStats.team1Stats.length || !scrimPlayerStats.team2Stats.length) {
      return null;
    }

    const team1Totals = scrimPlayerStats.team1Stats[0];
    const team2Totals = scrimPlayerStats.team2Stats[0];

    return {
      eliminations: [
        { playerTeam: currentScrim?.teams[0] || "Team 1", scrimId: scrimId || "", value: team1Totals.eliminations },
        { playerTeam: currentScrim?.teams[1] || "Team 2", scrimId: scrimId || "", value: team2Totals.eliminations },
      ],
      damage: [
        { playerTeam: currentScrim?.teams[0] || "Team 1", scrimId: scrimId || "", value: team1Totals.heroDamageDealt },
        { playerTeam: currentScrim?.teams[1] || "Team 2", scrimId: scrimId || "", value: team2Totals.heroDamageDealt },
      ],
      healing: [
        { playerTeam: currentScrim?.teams[0] || "Team 1", scrimId: scrimId || "", value: team1Totals.healingDealt },
        { playerTeam: currentScrim?.teams[1] || "Team 2", scrimId: scrimId || "", value: team2Totals.healingDealt },
      ],
    };
  }, [scrimPlayerStats, currentScrim, scrimId]);

  // Prepare scatter chart data for player performance
  const scatterChartData = useMemo(() => {
    if (!currentScrim) return [];

    const playerStats = playerStatBreakdown.byTeamAndPlayerAndScrim.filter(
      (stats) => stats.scrim === scrimId
    );

    return playerStats.map((stats): ScatterDataPoint => ({
      x: stats.heroDamageDealtPer10Minutes,
      y: stats.eliminationsPer10Minutes,
      playerName: stats.playerName,
      playerTeam: stats.playerTeam,
    }));
  }, [playerStatBreakdown.byTeamAndPlayerAndScrim, currentScrim, scrimId]);

  if (!scrimId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={Target}
          title="Invalid Scrim"
          description="No scrim ID provided"
          size="lg"
        />
      </div>
    );
  }

  if (!currentScrim) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={Target}
          title="Scrim Not Found"
          description={`No scrim found with ID: ${scrimId}`}
          size="lg"
        />
      </div>
    );
  }

  const handleBackToScrims = () => {
    navigate("/scrims");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <BreadCrumbs 
          items={[
            { label: "Scrims", path: "/scrims" },
            { label: scrimId, path: `/scrim/${scrimId}` }
          ]} 
        />
      </div>

      {/* Scrim Header */}
      <div className="mb-8 bg-base-100 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBackToScrims}
            className="btn btn-ghost btn-sm gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Scrims
          </button>
          <div className="text-sm text-base-content/70">
            {formatDate(currentScrim.date)} at {formatTime(currentScrim.date)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="flex items-center gap-3">
            <TeamColorDot teamName={currentScrim.teams[0]} size={16} />
            <span className={`text-2xl font-bold ${
              currentScrim.team1MatchesWon > currentScrim.team2MatchesWon 
                ? "text-success" 
                : ""
            }`}>
              {currentScrim.teams[0]}
            </span>
          </div>
          
          <div className="text-4xl font-mono font-bold">
            {currentScrim.team1MatchesWon} - {currentScrim.team2MatchesWon}
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`text-2xl font-bold ${
              currentScrim.team2MatchesWon > currentScrim.team1MatchesWon 
                ? "text-success" 
                : ""
            }`}>
              {currentScrim.teams[1]}
            </span>
            <TeamColorDot teamName={currentScrim.teams[1]} size={16} />
          </div>
        </div>

        {/* Scrim Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CardStat
            label="Total Matches"
            value={scrimStats.totalMatches}
            icon={<Target className="w-5 h-5" />}
            severity="neutral"
          />
          <CardStat
            label="Total Duration"
            value={`${Math.floor(scrimStats.totalDuration / 3600)}h ${Math.floor((scrimStats.totalDuration % 3600) / 60)}m`}
            icon={<Clock className="w-5 h-5" />}
            severity="neutral"
          />
          <CardStat
            label="Avg Match Duration"
            value={`${scrimStats.avgMatchDuration}m`}
            icon={<Calendar className="w-5 h-5" />}
            severity="neutral"
          />
          <CardStat
            label="Maps Played"
            value={new Set(scrimMatches.map(m => m.map)).size}
            icon={<Map className="w-5 h-5" />}
            severity="neutral"
          />
        </div>
      </div>

      {/* Match Breakdown */}
      {matchTableData.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-base-content mb-6">
            Match Breakdown
          </h2>
          <div className="bg-base-100 rounded-lg overflow-hidden">
            <DataTable
              columns={matchColumns}
              data={matchTableData}
              rowKey={(row) => row.matchId}
              defaultSort="time"
            />
          </div>
        </div>
      )}

      {/* Team Performance Comparison */}
      {teamComparison && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-base-content mb-6">
            Team Performance Comparison
          </h2>
          <div className="flex flex-row gap-6 flex-wrap">
            <StatDistributionAndTop
              statName="Total Eliminations"
              statDescription="Total eliminations achieved by each team"
              categoryKeys={["playerTeam"]}
              rows={teamComparison.eliminations}
              higherIsBetter={true}
              precision={0}
            />
            <StatDistributionAndTop
              statName="Total Hero Damage"
              statDescription="Total hero damage dealt by each team"
              categoryKeys={["playerTeam"]}
              rows={teamComparison.damage}
              higherIsBetter={true}
              precision={0}
            />
            <StatDistributionAndTop
              statName="Total Healing"
              statDescription="Total healing provided by each team"
              categoryKeys={["playerTeam"]}
              rows={teamComparison.healing}
              higherIsBetter={true}
              precision={0}
            />
          </div>
        </div>
      )}

      {/* Player Performance Scatter Plot */}
      {scatterChartData.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-base-content mb-6">
            Player Performance Analysis
          </h2>
          <div className="bg-base-100 p-6 rounded-lg">
            <div className="mb-4">
              <p className="text-base-content/70 text-sm">
                Each point represents a player's performance across all matches in this scrim.
                Points are colored by team.
              </p>
            </div>
            <ScatterChart
              data={scatterChartData}
              xAxisLabel="Hero Damage per 10 Minutes"
              yAxisLabel="Eliminations per 10 Minutes"
              colorFunction={getColorgorical}
              showGrid={true}
              showTooltip={true}
              showLegend={true}
              height={500}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrimDetailsPage;