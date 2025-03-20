import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { useStats } from "../../atoms";
import { getRoleFromHero } from "../../lib/hero";
import RoleIcon from "../../components/Common/RoleIcon";
import { ErrorBoundary } from "react-error-boundary";
import { PlayerOverview } from "./components/PlayerOverview";
import { PlayerHeroes } from "./components/PlayerHeroes";
import { PlayerMatches } from "./components/PlayerMatches";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="loading loading-spinner loading-lg"></div>
  </div>
);

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="alert alert-error">
    <div className="flex-1">
      <label>{error.message}</label>
    </div>
  </div>
);

export const PlayerPage = () => {
  const { playerName } = useParams<{ playerName: string }>();
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "heroes" | "matches"
  >("overview");

  if (!playerName) {
    return (
      <div className="alert alert-error">
        <div className="flex-1">
          <label>No player selected</label>
        </div>
      </div>
    );
  }

  const stats = useStats(["playerName", "playerHero"], {
    playerName: [playerName],
  });
  const playerExists = stats.rows.length > 0;

  if (!playerExists) {
    return (
      <div className="alert alert-error">
        <div className="flex-1">
          <label>Player not found: {playerName}</label>
        </div>
      </div>
    );
  }

  const playerData = stats.rows[0];
  const mostPlayedRole = playerData.playerHero
    ? getRoleFromHero(playerData.playerHero)
    : "tank";

  return (
    <div className="container mx-auto p-4 bg-base-100">
      {/* Header Section */}
      <header className="mb-8 bg-base-100 rounded-box p-6">
        <div className="flex items-center gap-4">
          <RoleIcon role={mostPlayedRole} className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold">{playerName}</h1>
            <p className="text-base-content/70">{playerData.playerTeam}</p>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="tabs tabs-boxed bg-base-100 p-1 mb-8">
        <button
          className={`tab ${activeTab === "overview" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === "heroes" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("heroes")}
        >
          Heroes
        </button>
        <button
          className={`tab ${activeTab === "matches" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("matches")}
        >
          Matches
        </button>
      </div>

      {/* Tab Content */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingSpinner />}>
          {activeTab === "overview" && (
            <PlayerOverview playerName={playerName} />
          )}
          {activeTab === "heroes" && <PlayerHeroes playerName={playerName} />}
          {activeTab === "matches" && <PlayerMatches playerName={playerName} />}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
