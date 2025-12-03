import { Suspense } from "react";
import { useParams, Outlet } from "react-router-dom";
import { getRoleFromHero } from "@library";
import { SubPageNavigation } from "@components";
import { RoleIcon } from "@icons";
import { ErrorBoundary } from "react-error-boundary";
import { Container } from "@components";
import { useStats } from "../hooks/useStats";
// Removed direct imports of child components as they are handled by Outlet
// import { PlayerOverview } from "./components/PlayerOverview";
// import { PlayerHeroes } from "./components/PlayerHeroes";
// import { PlayerMatches } from "./components/PlayerMatches";

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
  const stats = useStats({
    playerName: playerName || undefined,
  });

  if (!playerName) {
    return (
      <div className="alert alert-error">
        <div className="flex-1">
          <label>No player selected</label>
        </div>
      </div>
    );
  }
  const playerExists = stats.length > 0;

  if (!playerExists) {
    return (
      <div className="alert alert-error">
        <div className="flex-1">
          <label>Player not found: {playerName}</label>
        </div>
      </div>
    );
  }

  const playerData = stats[0];
  const mostPlayedRole = playerData.playerHero
    ? getRoleFromHero(playerData.playerHero)
    : "tank";

  // Define Nav Items for SubPageNavigation
  const playerNavItems = [
    { path: `/player/${playerName}`, label: "Overview", end: true },
    { path: `/player/${playerName}/heroes`, label: "Heroes" },
    { path: `/player/${playerName}/matches`, label: "Matches" },
  ];

  return (
    <Container>
      {" "}
      {/* Added Container */}
      {/* Header Section - Apply consistent card styling */}
      <header className="mb-8 bg-base-200 border border-gray-700 border-gray-700 shadow-md rounded-lg p-6">
        {" "}
        {/* Updated classes */}
        <div className="flex items-center gap-4">
          <RoleIcon role={mostPlayedRole} className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold">{playerName}</h1>
            <p className="text-base-content/70">{(playerData as any).playerTeam || 'Unknown Team'}</p>
          </div>
        </div>
      </header>
      {/* SubPage Navigation */}
      <SubPageNavigation navItems={playerNavItems} />
      {/* Content Outlet */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet /> {/* Replaced conditional rendering with Outlet */}
        </Suspense>
      </ErrorBoundary>
    </Container> // Added closing Container
  );
};

export default PlayerPage;
