import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

import { useScrimsightData } from "../lib/useScrimsightData";
import { METRIC_FOCUS, PlayerStatsNumerical, PlayerStatsNumericalKeys } from "../lib/ScrimsightDataModel";
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
    return players.some(player => player.player === playerName);
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
      key => key !== 'playerName' && typeof allPlayers[0][key as keyof typeof allPlayers[0]] === 'number'
    ) as PlayerStatsNumericalKeys[];

    // Compute average for each metric
    const averages = R.pipe(
      numericKeys,
      R.map(key => [key, R.meanBy(allPlayers, player => player[key])] as const),
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
