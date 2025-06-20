import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { Suspense } from "react";
import { AuthProvider, AuthProviderProps } from "react-oidc-context";

import CallbackPage from "@pages/CallbackPage.tsx";
import ErrorBoundary from "@components/ErrorBoundary.tsx";
import { AppLayout } from "@components/AppLayout.tsx";

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
    <ErrorBoundary>
      <AuthProvider {...oidcConfig}>
        <Router>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <div className="font-poppins min-h-screen bg-base-200 dark:bg-base-900 text-base-900 dark:text-white">
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                }
              >
                <Routes>
                  <Route path="/callback" element={<CallbackPage />} />
                  <Route path="*" element={
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<div className="text-center p-8"><h1 className="text-2xl font-bold">Dashboard</h1><p className="mt-4 text-base-content/70">Welcome to Scrimsight</p></div>} />
                        <Route path="/analytics" element={<div className="text-center p-8"><h1 className="text-2xl font-bold">Analytics</h1><p className="mt-4 text-base-content/70">Analytics page coming soon</p></div>} />
                        <Route path="/matches" element={<div className="text-center p-8"><h1 className="text-2xl font-bold">Match History</h1><p className="mt-4 text-base-content/70">Match history page coming soon</p></div>} />
                        <Route path="/team-stats" element={<div className="text-center p-8"><h1 className="text-2xl font-bold">Team Stats</h1><p className="mt-4 text-base-content/70">Team stats page coming soon</p></div>} />
                      </Routes>
                    </AppLayout>
                  } />
                </Routes>
              </Suspense>
            </div>
          </QueryParamProvider>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

// Keep this as the default export always
export default App;
