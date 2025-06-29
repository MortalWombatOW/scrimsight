import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Trophy, Calendar, Search, Users, Target, Swords } from "lucide-react";

import CardStat from "../components/CardStat";
import ScrimCard from "../components/ScrimCard";
import DataTable from "../components/DataTable";
import StatDistributionAndTop from "../components/StatDistributionAndTop";
import TeamColorDot from "../components/TeamColorDot";
import EmptyState from "../components/EmptyState";
import { useScrimsightData } from "../hooks/useScrimsightData";
import BreadCrumbs from "../components/BreadCrumbs";
import PageHeader from "../components/PageHeader";
import ScrimsightPage from "../components/ScrimsightPage";

interface ScrimTableRow {
  scrimId: string;
  team1: string;
  team2: string;
  score: string;
  date: string;
  time: string;
  totalMatches: number;
  outcome: "team1" | "team2" | "draw";
}

const ScrimsPage = () => {
  const dataModel = useScrimsightData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { scrims, matches, teams, playerStatBreakdown } = dataModel;

  // Use pre-calculated data from the data model
  const scrimStats = useMemo(() => {
    const recentScrims = scrims
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    const avgMatchesPerScrim =
      scrims.length > 0 ? matches.length / scrims.length : 0;

    return {
      totalScrims: scrims.length,
      totalMatches: matches.length,
      totalTeams: teams.length,
      avgMatchesPerScrim: Math.round(avgMatchesPerScrim * 10) / 10,
      recentScrims,
    };
  }, [scrims, matches.length, teams.length]);

  // Prepare data for DataTable
  const scrimTableData = useMemo(() => {
    let filtered = scrims;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (scrim) =>
          scrim.teams[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
          scrim.teams[1].toLowerCase().includes(searchTerm.toLowerCase()) ||
          scrim.scrim.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.map(
      (scrim): ScrimTableRow => {
        const outcome: "team1" | "team2" | "draw" =
          scrim.team1MatchesWon > scrim.team2MatchesWon
            ? "team1"
            : scrim.team2MatchesWon > scrim.team1MatchesWon
              ? "team2"
              : "draw";

        return {
          scrimId: scrim.scrim,
          team1: scrim.teams[0],
          team2: scrim.teams[1],
          score: `${scrim.team1MatchesWon} - ${scrim.team2MatchesWon}`,
          date: scrim.date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: scrim.date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          totalMatches: scrim.team1MatchesWon + scrim.team2MatchesWon,
          outcome,
        };
      }
    );
  }, [scrims, searchTerm]);

  // DataTable columns
  const scrimColumns: ColumnDef<ScrimTableRow>[] = [
    {
      accessorKey: "team1",
      header: "Team 1",
      enableSorting: true,
      cell: ({ getValue, row }) => (
        <div className="flex items-center gap-2">
          <TeamColorDot teamName={getValue() as string} size={12} />
          <span
            className={
              row.original.outcome === "team1"
                ? "font-semibold text-success"
                : ""
            }
          >
            {getValue() as string}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "team2",
      header: "Team 2",
      enableSorting: true,
      cell: ({ getValue, row }) => (
        <div className="flex items-center gap-2">
          <TeamColorDot teamName={getValue() as string} size={12} />
          <span
            className={
              row.original.outcome === "team2"
                ? "font-semibold text-success"
                : ""
            }
          >
            {getValue() as string}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "score",
      header: "Score",
      enableSorting: false,
      cell: ({ getValue }) => (
        <span className="font-mono text-lg">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "totalMatches",
      header: "Total Matches",
      enableSorting: true,
    },
    {
      accessorKey: "date",
      header: "Date",
      enableSorting: true,
    },
    {
      accessorKey: "time",
      header: "Time",
      enableSorting: true,
    },
  ];

  // Use pre-calculated team statistics from byTeam breakdown
  const teamStats = useMemo(() => {
    const { byTeam, byTeamAndScrim } = playerStatBreakdown;

    if (!byTeam.length) {
      return {
        eliminationsRows: [],
        damageRows: [],
        healingRows: [],
        avgEliminations: 0,
        avgDamage: 0,
        avgHealing: 0,
      };
    }

    // Use pre-calculated team totals and calculate averages per scrim
    const teamScrimCounts = byTeamAndScrim.reduce((acc, stats) => {
      acc[stats.playerTeam] = (acc[stats.playerTeam] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eliminationsRows = byTeamAndScrim.map((stats) => ({
      playerTeam: stats.playerTeam,
      scrimId: stats.scrim,
      value: stats.eliminations,
    }));

    const damageRows = byTeamAndScrim.map((stats) => ({
      playerTeam: stats.playerTeam,
      scrimId: stats.scrim,
      value: stats.heroDamageDealt,
    }));

    const healingRows = byTeamAndScrim.map((stats) => ({
      playerTeam: stats.playerTeam,
      scrimId: stats.scrim,
      value: stats.healingDealt,
    }));

    // Use pre-calculated totals for overall averages
    const totalScrims = Object.values(teamScrimCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    return {
      eliminationsRows,
      damageRows,
      healingRows,
      avgEliminations: playerStatBreakdown.total.eliminations / totalScrims,
      avgDamage: playerStatBreakdown.total.heroDamageDealt / totalScrims,
      avgHealing: playerStatBreakdown.total.healingDealt / totalScrims,
    };
  }, [playerStatBreakdown]);

  const handleRowClick = (row: ScrimTableRow) => {
    navigate(`scrim/${row.scrimId}`);
  };

  return (
    <ScrimsightPage>
      <PageHeader>
        <BreadCrumbs items={[{ label: "Scrims", path: "/scrims" }]} />
        <PageHeader.Icon>
          <Swords size={32} />
        </PageHeader.Icon>
        <PageHeader.Title>Scrims</PageHeader.Title>
      </PageHeader>
      <div className="container mx-auto px-4 py-8">

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 bg-base-100 p-6 rounded-lg">
          <CardStat
            label="Total Scrims"
            value={scrimStats.totalScrims}
            icon={<Trophy className="w-6 h-6" />}
            severity="neutral"
          />
          <CardStat
            label="Total Matches"
            value={scrimStats.totalMatches}
            icon={<Target className="w-6 h-6" />}
            severity="neutral"
          />
          <CardStat
            label="Teams Involved"
            value={scrimStats.totalTeams}
            icon={<Users className="w-6 h-6" />}
            severity="neutral"
          />
          <CardStat
            label="Avg Matches/Scrim"
            value={scrimStats.avgMatchesPerScrim}
            icon={<Calendar className="w-6 h-6" />}
            severity="neutral"
          />
        </div>

        {/* Recent Scrims Section */}
        {scrimStats.recentScrims.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-6">
              Recent Scrims
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {scrimStats.recentScrims.map((scrim) => (
                <ScrimCard key={scrim.scrim} scrimId={scrim.scrim} />
              ))}
            </div>
          </div>
        )}

        {/* Team Performance Statistics */}
        {teamStats.eliminationsRows.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-base-content mb-6">
              Team Performance Across Scrims
            </h2>
            <div className="flex flex-row gap-6 flex-wrap">
              <StatDistributionAndTop
                statName="Avg Eliminations per Scrim"
                statDescription="Average eliminations per team per scrim"
                categoryKeys={["playerTeam", "scrimId"]}
                rows={teamStats.eliminationsRows}
                higherIsBetter={true}
                precision={1}
              />
              <StatDistributionAndTop
                statName="Avg Hero Damage per Scrim"
                statDescription="Average hero damage dealt per team per scrim"
                categoryKeys={["playerTeam", "scrimId"]}
                rows={teamStats.damageRows}
                higherIsBetter={true}
                precision={0}
              />
              <StatDistributionAndTop
                statName="Avg Healing per Scrim"
                statDescription="Average healing dealt per team per scrim"
                categoryKeys={["playerTeam", "scrimId"]}
                rows={teamStats.healingRows}
                higherIsBetter={true}
                precision={0}
              />
            </div>
          </div>
        )}

        {/* All Scrims Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-base-content">
              All Scrims ({scrimTableData.length})
            </h2>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search teams or scrim ID..."
                className="input input-bordered w-full sm:w-64 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Scrims DataTable */}
          {scrimTableData.length > 0 ? (
            <div className="bg-base-100 rounded-lg overflow-hidden">
              <DataTable
                columns={scrimColumns}
                data={scrimTableData}
                rowKey={(row) => row.scrimId}
                defaultSort="date"
                onRowClick={handleRowClick}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <EmptyState
                icon={Search}
                title="No Scrims Found"
                description={
                  searchTerm
                    ? `No scrims match your search "${searchTerm}"`
                    : "No scrims available"
                }
                size="md"
              />
            </div>
          )}
        </div>
      </div>
    </ScrimsightPage>
  );
};

export default ScrimsPage;
