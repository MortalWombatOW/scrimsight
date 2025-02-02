import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NavigationPageItem } from '@toolpad/core/AppProvider';
import { themeDef } from './theme';
import { MatchPage } from './pages/Match/MatchPage';
import { AppProvider } from '@toolpad/core/react-router-dom';

import { MatchesPage } from './pages/Matches/Matches';

const App = () => {
  const theme = createTheme(themeDef);
  const navigation: NavigationPageItem[] = [
    {
      kind: 'page',
      segment: '/',
      title: 'Matches',
      icon: <div />,
    },
  ];

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <AppProvider navigation={navigation} branding={{ logo: <div />, title: 'SCRIMSIGHT' }} theme={theme}>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<MatchesPage />} />
            <Route path="/match/:matchId" element={<MatchPage />} />
          </Routes></DashboardLayout>
      </AppProvider>
        </QueryParamProvider>
      </ThemeProvider>
    </Router>
  );
};

// Keep this as the default export always
export default App;
