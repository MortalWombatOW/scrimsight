import { Location } from 'history';
import React, { useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import routes, { ScrimsightRoute } from './routes';
import { themeDef } from './theme';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { WombatDataProvider, DataManager, AlaSQLNode, AlaSQLNodeConfig, FunctionNode, FunctionNodeConfig, IndexedDBNode, IndexedDBNodeConfig, ObjectStoreNode, ObjectStoreNodeConfig, LogLevel, InputNodeConfig, InputNode } from 'wombat-data-framework';
import Header from './components/Header/Header';
import { getColorgorical } from './lib/color';
import { generateThemeColor } from './lib/palette';
import { useDeepMemo } from './hooks/useDeepEffect';
import { DATA_COLUMNS, OBJECT_STORE_NODES, ALASQL_NODES, FUNCTION_NODES, FILE_PARSING_NODES, indexedDbNode } from './WombatDataFrameworkSchema';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NavigationItem, NavigationPageItem } from '@toolpad/core/AppProvider';
import Uploader from './components/Uploader/Uploader';
import WombatDataWrapper from './components/WombatDataWrapper/WombatDataWrapper';

const routesToNavigation = (routes: ScrimsightRoute[]): NavigationPageItem[] => {
  return routes.map((route) => ({
    kind: 'page',
    segment: route.path[0].substring(1),
    title: route.name ?? route.path[0],
    icon: route.icon,
  }));
};

const ContextualizedRoute = ({ route }: { route: ScrimsightRoute }): JSX.Element => {
  let el: JSX.Element = React.createElement(route.component, {});
  // for (const context of route.contexts || []) {
  //   el = React.createElement(context, undefined, el);
  // }
  return el;
};

function ThemedRoutes(props) {
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
      <AppProvider navigation={routesToNavigation(routes)} branding={{ logo: <div />, title: 'SCRIMSIGHT' }} theme={theme}>
        <DashboardLayout>
          {/* <Header /> */}


          <Routes>{routes.map((route) =>
            <Route key={route.path[0]} path={route.path[0]} element={<ContextualizedRoute route={route} />} />
          )}
          </Routes>
        </DashboardLayout>
      </AppProvider>
    </ThemeProvider>
  );
}

const App = () => {
  console.log('Rendering App');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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

const RouteAdapter: React.FC = ({ children }: { children }) => {
  const reactRouterNavigate = useNavigate();
  const reactRouterlocation = useLocation();

  const adaptedHistory = useDeepMemo(
    () => ({
      // can disable eslint for parts here, location.state can be anything
      replace(location: Location) {
        reactRouterNavigate(location, { replace: true, state: location.state });
      },
      push(location: Location) {
        reactRouterNavigate(location, {
          replace: false,

          state: location.state,
        });
      },
    }),
    [reactRouterNavigate],
  );
  // https://github.com/pbeshai/use-query-params/issues/196
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  return children({
    history: adaptedHistory,
    location: reactRouterlocation,
  });
};

export default App;
