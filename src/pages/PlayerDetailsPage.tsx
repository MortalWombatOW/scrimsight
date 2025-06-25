import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

import { useScrimsightData } from "../lib/useScrimsightData";
import {
  METRIC_FOCUS,
  PlayerStatsNumerical,
  PlayerStatsNumericalKeys,
} from "../lib/ScrimsightDataModel";
import * as R from "remeda";
import MetricFocusSection from "../components/MetricFocusSection";
import EmptyState from "../components/EmptyState";
import BreadCrumbs from "../components/BreadCrumbs";

const PlayerDetailsPage = () => {
  const { playerName } = useParams<{ playerName: string }>();
  const navigate = useNavigate();
  const dataModel = useScrimsightData();

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

  // I need you to evolve the MetricFocusSection component, and its usage on the PlayerDetailsPage,
  //  and the METRIC_FOCUS list in @src/lib/ScrimsightDataModel.ts, to enable composition instead of prop drilling. Instead of the
  //  structure being determined by the ScrimsightMetricFocus objects and MetricFocusSection, I want to be able to configure the page directly,
  // allowing greater flexibility This will allow me to lay out the page in semantic units, like this sample:
  // (in player details page)
  // PageHeader
  //   PageHeader.Icon
  //   PageHeader.Title
  // PageSection
  //   PageSection.Title
  //   PageSection.Description
  //   PageSection.Content
  //     CardStat
  //     CardStat
  // PageSection
  //   PageSection.Title
  //   PageSection.Description
  //   PageSection.Content
  //    StatDistributionAndTop
  //    ChartWrapper
  //
  //  Please ultrathink and plan very carefully, using subagents for subtasks, and
  // confirm the design with me before proceeding with the implementation. You may not make any file changes until I give you
  // explicit approval.
  //
  // Relevant files: @src/components/MetricFocusSection.tsx @src/components/CardStat.tsx
  //   @src/lib/ScrimsightDataModel.ts @src/pages/PlayerDetailsPage.tsx

  const breadcrumbItems = [
    { label: "Players", href: "/players" },
    { label: playerName, href: `/player/${playerName}` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/players")}
            className="btn btn-ghost btn-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Players
          </button>
          <div>
            <BreadCrumbs items={breadcrumbItems} />
            <div className="flex items-center gap-3 mt-2">
              <User className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-base-content">
                  {playerName}
                </h1>
                <p className="text-sm text-base-content/70">
                  Player Performance Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Focus Sections */}
      <div className="flex flex-wrap gap-6">
        {METRIC_FOCUS.map((metricFocus) => (
          <MetricFocusSection
            key={metricFocus.focus}
            metricFocus={metricFocus}
            playerStats={playerStats as PlayerStatsNumerical}
            playerStatRanks={playerStatRanks as PlayerStatsNumerical}
            playerAverageStats={playerAverageStats as PlayerStatsNumerical}
            totalCount={totalPlayerCount}
            className="shadow-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerDetailsPage;
