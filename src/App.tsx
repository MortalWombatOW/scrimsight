import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { Suspense } from "react";
import { Layout } from "./components/Layout/Layout";
import { HomePage } from "./pages/Home";
import { AddFilesPage } from "./pages/AddFiles/AddFilesPage";
import { MatchesPage } from "./pages/Matches";
import { PlayersPage } from "./pages/Players/PlayersPage";
import { TeamsPage } from "./pages/Teams";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dropzone/styles.css";
import {
  MantineColorsTuple,
  MantineProvider,
  createTheme,
} from "@mantine/core";
import { PlayerPage } from "./pages/Player";
import { TeamPage } from "./pages/Team";
import { MatchPage2 } from "./pages/Match/MatchPage2";
import { AuthProvider, AuthProviderProps } from "react-oidc-context";
import { CallbackPage } from "./pages/Auth/CallbackPage";

const App = () => {
  const myColor: MantineColorsTuple = [
    "#fff4e1",
    "#ffe8cc",
    "#fed09b",
    "#fdb766",
    "#fca13a",
    "#fc931d",
    "#fc8c0c",
    "#e17800",
    "#c86a00",
    "#af5a00",
  ];

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

  const mtheme = createTheme({
    fontFamily: "Poppins, sans-serif",
    colors: {
      myColor,
      redDark: [
        "#0e0c0c",
        "#251010",
        "#3d1515",
        "#541919",
        "#6c1d1d",
        "#832222",
        "#9b2626",
        "#b22a2a",
        "#ca2f2f",
        "#e13333",
      ],
      dark: [
        "#8c8c8c",
        "#6c6c6c",
        "#4c4c4c",
        "#2c2c2c",
        "#0c0c0c",
        "#0a0a0a",
        "#080808",
        "#060606",
        "#040404",
        "#020202",
      ],
    },

    primaryColor: "myColor",
    focusRing: "always",
  });

  return (
    <AuthProvider {...oidcConfig}>
      <MantineProvider defaultColorScheme="dark" theme={mtheme}>
        <Router>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <Layout>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/callback" element={<CallbackPage />} />
                  <Route path="/matches" element={<MatchesPage />} />
                  <Route path="/matches/:matchId" element={<MatchPage2 />} />
                  <Route path="/players" element={<PlayersPage />} />
                  <Route path="/players/:playerName" element={<PlayerPage />} />
                  <Route path="/teams" element={<TeamsPage />} />
                  <Route path="/teams/:teamId" element={<TeamPage />} />
                  <Route path="/files" element={<AddFilesPage />} />
                </Routes>
              </Suspense>
            </Layout>
          </QueryParamProvider>
        </Router>
      </MantineProvider>
    </AuthProvider>
  );
};

// Keep this as the default export always
export default App;
