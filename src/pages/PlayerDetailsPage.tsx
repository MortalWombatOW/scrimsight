import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

import { useScrimsightData } from "../lib/useScrimsightData";
import { METRIC_FOCUS, PlayerStatsNumerical } from "../lib/ScrimsightDataModel";
import MetricFocusSection from "../components/MetricFocusSection";
import EmptyState from "../components/EmptyState";
import BreadCrumbs from "../components/BreadCrumbs";

const PlayerDetailsPage = () => {
  const { playerName } = useParams<{ playerName: string }>();
  const navigate = useNavigate();
  const dataModel = useScrimsightData();

  const { playerStatBreakdown, players } = dataModel;

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
      <div className="space-y-6">
        {METRIC_FOCUS.map((metricFocus) => (
          <MetricFocusSection
            key={metricFocus.focus}
            metricFocus={metricFocus}
            playerStats={playerStats as PlayerStatsNumerical}
            className="shadow-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerDetailsPage;
