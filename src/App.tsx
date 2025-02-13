import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
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

const App = () => {
  const theme = createTheme(themeDef);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <Suspense fallback={<div>Loading...</div>}>
          <Layout>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/matches" element={<MatchesPage />} />
                <Route path="/players" element={<PlayersPage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/files" element={<AddFilesPage />} />
              </Routes>
            </Suspense>
          </Layout>
          </Suspense>
        </QueryParamProvider>
      </ThemeProvider>
    </Router>
  );
};

// Keep this as the default export always
export default App;
