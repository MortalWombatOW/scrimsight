import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { Suspense } from "react";
import { Layout } from "./components/Layout/Layout";
import { HomePage } from "./pages/Home";
import { AddFilesPage } from "./pages/AddFiles/AddFilesPage";
import { ScrimsPage } from "./pages/Scrims/ScrimsPage";
import { PlayersPage } from "./pages/Players/PlayersPage";
import { PlayersOverview } from "./pages/Players/components/Overview/PlayersOverview";
import { PlayersPerformance } from "./pages/Players/components/Performance/PlayersPerformance";
import { PlayersHeroes } from "./pages/Players/components/Heroes/PlayersHeroes";
import { TeamsPage } from "./pages/Teams";
import { PlayerPage } from "./pages/Player";
import { PlayerOverview as SinglePlayerOverview } from "./pages/Player/components/PlayerOverview"; // Renamed import
import { PlayerHeroes as SinglePlayerHeroes } from "./pages/Player/components/PlayerHeroes"; // Renamed import
import { PlayerMatches as SinglePlayerMatches } from "./pages/Player/components/PlayerMatches"; // Renamed import
import { TeamPage } from "./pages/Team";
import { TeamOverview } from "./pages/Team/components/TeamOverview";
import { TeamPlayers } from "./pages/Team/components/TeamPlayers";
import { TeamMatches } from "./pages/Team/components/TeamMatches";
import { TeamCompositions } from "./pages/Team/components/TeamCompositions";
import { MatchPage2 } from "./pages/Match/MatchPage2";
import { AuthProvider, AuthProviderProps } from "react-oidc-context";
import { CallbackPage } from "./pages/Auth/CallbackPage";
import { TimelinePage } from "./pages/Match/TimelinePage";
import { MatchOverviewPage } from "./pages/Match/MatchOverviewPage";
import { MatchStatComparisonPage } from "./pages/Match/MatchStatComparisonPage";
import { ScrimPage } from "./pages/Scrim/ScrimPage";

const App = () => {
  const oidcConfig: AuthProviderProps = {
    authority:
      "https://discord.com/oauth2/authorize?client_id=815622008402477116&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=identify+email",
    metadata: {
      authorization_endpoint: "https://discordapp.com/api/oauth2/authorize",
      token_endpoint: "https://discordapp.com/api/oauth2/token",
      userinfo_endpoint: "https://discordapp.com/api/users/@me",
      claims_supported: ["identify"],
    },
    client_id: "815622008402477116",
    redirect_uri: "http://localhost:3000/callback",
    scope: "identify email",
    onSigninCallback: async () => {
      window.history.replaceState({}, document.title, window.location.pathname);
    },
  };

  return (
    <AuthProvider {...oidcConfig}>
      <Router>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <div className="font-poppins min-h-screen bg-base-200 dark:bg-base-900 text-base-900 dark:text-white">
            <Layout>
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                }
              >
                <Routes>
                  <Route path="/" index element={<HomePage />} />
                  <Route path="/callback" element={<CallbackPage />} />
                  <Route path="/scrims" element={<ScrimsPage />} />
                  <Route path="/scrims/:scrimId" element={<ScrimPage />} />
                  <Route path="/matches/:matchId" element={<MatchPage2 />}>
                    <Route index element={<MatchOverviewPage />} />
                    <Route path="timeline" element={<TimelinePage />} />
                    <Route
                      path="compare"
                      element={<MatchStatComparisonPage />}
                    />
                  </Route>
                  <Route path="/players" element={<PlayersPage />}>
                    <Route index element={<PlayersOverview />} />
                    <Route
                      path="performance"
                      element={<PlayersPerformance />}
                    />
                    <Route path="heroes" element={<PlayersHeroes />} />
                  </Route>
                  {/* Updated Player Route with nested routes */}
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
                </Routes>
              </Suspense>
            </Layout>
          </div>
        </QueryParamProvider>
      </Router>
    </AuthProvider>
  );
};

// Keep this as the default export always
export default App;
