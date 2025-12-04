import { Suspense } from "react";
import { useParams, Outlet } from "react-router-dom";
import { getRoleFromHero } from "@library";
import { RoleIcon } from "@icons";
import { ErrorBoundary } from "react-error-boundary";
import { Page } from "@components";
import { useStats } from "../hooks/useStats";

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
    <Page>
      <Page.Header
        title={playerName}
        subtitle={playerData.playerTeam || 'Unknown Team'}
        icon={<RoleIcon role={mostPlayedRole} className="w-12 h-12" />}
      />
      
      <Page.Navigation navItems={playerNavItems} />
      
      <Page.Content>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </Page.Content>
    </Page>
  );
};

export default PlayerPage;
