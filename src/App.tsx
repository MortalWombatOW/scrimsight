import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { Suspense } from "react";
import { AuthProvider, AuthProviderProps } from "react-oidc-context";
import {
  HomePage,
  AddFilesPage,
  ScrimsPage,
  PlayersPage,
  TeamsPage,
  PlayerPage,
  TeamPage,
  MatchPage,
  CallbackPage,
  TimelinePage,
  MatchOverviewPage,
  MatchPlayersPage,
  MatchStatComparisonPage,
  ScrimPage,
  AnalysisPage,
  MetricsExplorerPage,
  SchemaVisualizerPage,
} from "@pages";
import {
  Layout,
  PlayersOverview,
  PlayersPerformance,
  PlayersHeroes,
  PlayerOverview as SinglePlayerOverview,
  PlayerHeroes as SinglePlayerHeroes,
  PlayerMatches as SinglePlayerMatches,
  TeamOverview,
  TeamPlayers,
  TeamMatches,
  TeamCompositions,
} from "@components";

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
                  <Route path="/matches/:matchId" element={<MatchPage />}>
                    <Route index element={<MatchOverviewPage />} />
                    <Route path="timeline" element={<TimelinePage />} />
                    <Route
                      path="compare"
                      element={<MatchStatComparisonPage />}
                    />
                    <Route path="players" element={<MatchPlayersPage />} />{" "}
                    {/* Add the new players route */}
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
                  <Route path="/analysis" element={<AnalysisPage />} />
                  <Route path="/metrics" element={<MetricsExplorerPage />} />
                  <Route path="/schema" element={<SchemaVisualizerPage />} />
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
