import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme as createMuiTheme } from '@mui/material';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { Suspense } from 'react';
import { Layout } from './components/Layout/Layout';
import { themeDef } from './theme';
import { HomePage } from './pages/Home';
import { AddFilesPage } from './pages/AddFiles/AddFilesPage';
import { MatchesPage } from './pages/Matches';
import { PlayersPage } from './pages/Players/PlayersPage';
import { TeamsPage } from './pages/Teams';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import { MantineColorsTuple, MantineProvider, createTheme } from '@mantine/core';
import { PlayerPage } from './pages/Player';
import { TeamPage } from './pages/Team';
import { MatchPage2 } from './pages/Match/MatchPage2';
const App = () => {
  const theme = createMuiTheme(themeDef);
  const myColor: MantineColorsTuple = [
    '#fff4e1',
    '#ffe8cc',
    '#fed09b',
    '#fdb766',
    '#fca13a',
    '#fc931d',
    '#fc8c0c',
    '#e17800',
    '#c86a00',
    '#af5a00'
  ];

  const mtheme = createTheme({
    fontFamily: 'Poppins, sans-serif',
    colors: {
      myColor,
      redDark: ['#0e0c0c', '#251010', '#3d1515', '#541919', '#6c1d1d', '#832222', '#9b2626', '#b22a2a', '#ca2f2f', '#e13333'],
    },
    primaryColor: 'myColor',
  });

  return (
    <MantineProvider defaultColorScheme="dark" theme={mtheme}>
      <Router>
        <ThemeProvider theme={theme}>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <Layout>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
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
        </ThemeProvider>
      </Router>
    </MantineProvider>
  );
};

// Keep this as the default export always
export default App;
