import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { Suspense } from "react";
import { Layout } from "./components/Layout/Layout";
import { HomePage } from "./pages/Home";
import { AddFilesPage } from "./pages/AddFiles/AddFilesPage";
import { MatchesPage } from "./pages/Matches";
import { PlayersPage } from "./pages/Players/PlayersPage";
import { TeamsPage } from "./pages/Teams";
import { PlayerPage } from "./pages/Player";
import { TeamPage } from "./pages/Team";
import { MatchPage2 } from "./pages/Match/MatchPage2";
import { AuthProvider, AuthProviderProps } from "react-oidc-context";
import { CallbackPage } from "./pages/Auth/CallbackPage";
import { TimelinePage } from "./pages/Match/TimelinePage";
import { MatchOverviewPage } from "./pages/Match/MatchOverviewPage";
import { MatchStatComparisonPage } from "./pages/Match/MatchStatComparisonPage";

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
          <div className="font-poppins min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
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
                  <Route path="/matches" element={<MatchesPage />} />
                  <Route path="/matches/:matchId" element={<MatchPage2 />}>
                    <Route index element={<MatchOverviewPage />} />
                    <Route path="timeline" element={<TimelinePage />} />
                    <Route
                      path="compare"
                      element={<MatchStatComparisonPage />}
                    />
                  </Route>
                  <Route path="/players" element={<PlayersPage />} />
                  <Route path="/players/:playerName" element={<PlayerPage />} />
                  <Route path="/teams" element={<TeamsPage />} />
                  <Route path="/teams/:teamId" element={<TeamPage />} />
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
