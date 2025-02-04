import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { Suspense } from 'react';
import routes, { navigationItemsAtom } from './routes';
import { useAtomValue } from 'jotai';
import { Layout } from './components/Layout/Layout';
import { themeDef } from './theme';

const App = () => {
  const theme = createTheme(themeDef);
  const navigationItems = useAtomValue(navigationItemsAtom);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <Suspense fallback={<div>Loading...</div>}>
          <Layout navigationItems={navigationItems}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {routes.map((route) => (
                  <Route key={route.path} path={route.path} element={<route.component />} />
                ))}
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
