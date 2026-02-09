import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { Suspense, lazy } from "react";
import { useHydration } from "@hooks/useHydration";
import { Layout } from "@components";

// Page-level lazy imports (each becomes its own chunk)
const HomePage = lazy(() => import("./pages/HomePage"));
const AddFilesPage = lazy(() => import("./pages/AddFilesPage"));
const ScrimsPage = lazy(() => import("./pages/ScrimsPage"));
const ScrimPage = lazy(() => import("./pages/ScrimPage"));
const PlayersPage = lazy(() => import("./pages/PlayersPage"));
const TeamsPage = lazy(() => import("./pages/TeamsPage"));
const PlayerPage = lazy(() => import("./pages/PlayerPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const MatchPage = lazy(() => import("./pages/MatchPage"));
const MetricsExplorerPage = lazy(() => import("./pages/MetricsExplorerPage"));
const MatchOverviewPage = lazy(() => import("./pages/MatchOverviewPage"));
const MatchPlayersPage = lazy(() => import("./pages/MatchPlayersPage"));
const MatchStatComparisonPage = lazy(() => import("./pages/MatchStatComparisonPage"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));

// Sub-route component lazy imports (named exports adapted for React.lazy)
const PlayersOverview = lazy(() => import("./components/player/PlayersOverview").then(m => ({ default: m.PlayersOverview })));
const PlayersPerformance = lazy(() => import("./components/player/PlayersPerformance").then(m => ({ default: m.PlayersPerformance })));
const PlayersHeroes = lazy(() => import("./components/player/PlayersHeroes").then(m => ({ default: m.PlayersHeroes })));
const SinglePlayerOverview = lazy(() => import("./components/player/PlayerOverview").then(m => ({ default: m.PlayerOverview })));
const SinglePlayerHeroes = lazy(() => import("./components/player/PlayerHeroes").then(m => ({ default: m.PlayerHeroes })));
const SinglePlayerMatches = lazy(() => import("./components/player/PlayerMatches").then(m => ({ default: m.PlayerMatches })));
const TeamOverview = lazy(() => import("./components/team/TeamOverview").then(m => ({ default: m.TeamOverview })));
const TeamPlayers = lazy(() => import("./components/team/TeamPlayers").then(m => ({ default: m.TeamPlayers })));
const TeamMatches = lazy(() => import("./components/team/TeamMatches").then(m => ({ default: m.TeamMatches })));
const TeamCompositions = lazy(() => import("./components/team/TeamCompositions").then(m => ({ default: m.TeamCompositions })));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const HydratedRoutes = () => {
  const isHydrated = useHydration();

  if (!isHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" index element={<HomePage />} />
      <Route path="/scrims" element={<ScrimsPage />} />
      <Route path="/scrims/:scrimId" element={<ScrimPage />} />
      <Route path="/matches/:matchId" element={<MatchPage />}>
        <Route index element={<MatchOverviewPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="compare" element={<MatchStatComparisonPage />} />
        <Route path="players" element={<MatchPlayersPage />} />
      </Route>
      <Route path="/players" element={<PlayersPage />}>
        <Route index element={<PlayersOverview />} />
        <Route path="performance" element={<PlayersPerformance />} />
        <Route path="heroes" element={<PlayersHeroes />} />
      </Route>
      <Route path="/player/:playerName" element={<PlayerPage />}>
        <Route index element={<SinglePlayerOverview />} />
        <Route path="heroes" element={<SinglePlayerHeroes />} />
        <Route path="matches" element={<SinglePlayerMatches />} />
      </Route>
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/teams/:teamId" element={<TeamPage />}>
        <Route index element={<TeamOverview />} />
        <Route path="players" element={<TeamPlayers />} />
        <Route path="matches" element={<TeamMatches />} />
        <Route path="compositions" element={<TeamCompositions />} />
      </Route>
      <Route path="/files" element={<AddFilesPage />} />
      <Route path="/metrics" element={<MetricsExplorerPage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <div className="font-poppins min-h-screen bg-base-200 text-base-content">
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <HydratedRoutes />
            </Suspense>
          </Layout>
        </div>
      </QueryParamProvider>
    </Router>
  );
};

// Keep this as the default export always
export default App;
