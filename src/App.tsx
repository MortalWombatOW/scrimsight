import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { Suspense } from "react";
import { AuthProvider, AuthProviderProps } from "react-oidc-context";

import CallbackPage from "@pages/CallbackPage.tsx";
import LandingPage from "@pages/LandingPage.tsx";
import ErrorBoundary from "@components/ErrorBoundary.tsx";
import { AppLayout } from "@components/AppLayout.tsx";
import { AuthGuard } from "./components/AuthGuard";
import SampleData from "./components/SampleData";
import HomePage from "./pages/HomePage";

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

  const subroutes = (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </AppLayout>
  );

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
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/callback" element={<CallbackPage />} />
                  <Route
                    path="/demo/*"
                    element={<SampleData>{subroutes}</SampleData>}
                  />
                  <Route
                    path="/app/*"
                    element={<AuthGuard>{subroutes}</AuthGuard>}
                  />
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
