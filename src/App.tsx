import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {CssBaseline, ThemeProvider, createTheme} from '@mui/material';
import {QueryParamProvider} from 'use-query-params';
import {ReactRouter6Adapter} from 'use-query-params/adapters/react-router-6';
import routes, {ScrimsightRoute} from './routes';
import {themeDef} from './theme';
import {AppProvider} from '@toolpad/core/react-router-dom';
import {getColorgorical} from './lib/color';
import {generateThemeColor} from './lib/palette';
import {DashboardLayout} from '@toolpad/core/DashboardLayout';
import {NavigationPageItem} from '@toolpad/core/AppProvider';
import WombatDataWrapper from './components/WombatDataWrapper/WombatDataWrapper';
import Debug from './components/Debug/Debug';

const routesToNavigation = (routes: ScrimsightRoute[]): NavigationPageItem[] => {
  return routes.map((route) => ({
    kind: 'page',
    segment: route.path[0].substring(1),
    title: route.name ?? route.path[0],
    icon: route.icon,
  }));
};

const ContextualizedRoute = ({route}: {route: ScrimsightRoute}): JSX.Element => {
  const el: JSX.Element = React.createElement(route.component, {});
  return el;
};

function ThemedRoutes() {
  const theme = createTheme({
    ...themeDef,
    palette: {
      ...themeDef.palette,
      team1: generateThemeColor(getColorgorical('Team 1')),
      team2: generateThemeColor(getColorgorical('Team 2')),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider navigation={routesToNavigation(routes)} branding={{logo: <div />, title: 'SCRIMSIGHT'}} theme={theme}>
        <DashboardLayout>
          {/* <Header /> */}
          <Debug />

          <Routes>
            {routes.map((route) => (
              <Route key={route.path[0]} path={route.path[0]} element={<ContextualizedRoute route={route} />} />
            ))}
          </Routes>
        </DashboardLayout>
      </AppProvider>
    </ThemeProvider>
  );
}

const App = () => {
  console.log('Rendering App');

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      <BrowserRouter basename="/">
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <WombatDataWrapper>
            <ThemedRoutes />
          </WombatDataWrapper>
        </QueryParamProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
