import { Suspense } from "react"; // Removed React import as it's not needed explicitly
import { useParams, Outlet } from "react-router-dom"; // Added Outlet
import { useStats } from "../../atoms";
import { getRoleFromHero } from "../../lib/hero";
import { SubPageNavigation } from "../../components/Layout/SubPageNavigation"; // Added SubPageNavigation
import RoleIcon from "../../components/Common/RoleIcon";
import { ErrorBoundary } from "react-error-boundary";
import Container from "~/components/Container/Container"; // Added import
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
  // Removed activeTab state:
  // const [activeTab, setActiveTab] = React.useState<
  //   "overview" | "heroes" | "matches"
  // >("overview");

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
