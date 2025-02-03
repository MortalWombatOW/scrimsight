import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NavigationPageItem } from '@toolpad/core/AppProvider';
import { themeDef } from './theme';
import { MatchPage } from './pages/Match/MatchPage';
import { AppProvider } from '@toolpad/core/react-router-dom';

import { MatchesPage } from './pages/Matches/Matches';
import { AddFilesPage } from './pages/AddFiles/AddFilesPage';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Suspense } from 'react';
import { TeamsPage } from './pages/Teams/TeamsPage';
import GroupIcon from '@mui/icons-material/Group';
import { TeamPage } from './pages/Team/TeamPage';

const App = () => {
  const theme = createTheme(themeDef);
  const navigation: NavigationPageItem[] = [
    {
      kind: 'page',
      segment: '',
      title: 'Matches',
      icon: <div />,
    },
    {
      kind: 'page',
      segment: 'add-files',
      title: 'Add Files',
      icon: <FileUploadIcon />,
    },
    {
      kind: 'page',
      segment: 'teams',
      title: 'Teams',
      icon: <GroupIcon />,
    },
  ];

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <AppProvider navigation={navigation} branding={{ logo: <div />, title: 'SCRIMSIGHT' }} theme={theme}>
            <DashboardLayout>
              <Suspense fallback={<div>Loading...</div>}>
              <Box sx={{ p: 2 }}>
                <Routes>
                  <Route path="/" element={<MatchesPage />} />
                  <Route path="/match/:matchId" element={<MatchPage />} />
                  <Route path="/add-files" element={<AddFilesPage />} />
                  <Route path="/teams" element={<TeamsPage />} />
                  <Route path="/teams/:teamName" element={<TeamPage />} />
                </Routes>
              </Box>
              </Suspense>
            </DashboardLayout>
          </AppProvider>
        </QueryParamProvider>
      </ThemeProvider>
    </Router>
  );
};

// Keep this as the default export always
export default App;
