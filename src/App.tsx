import { Location } from 'history';
import React from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import routes, { ScrimsightRoute } from './lib/routes';
import { themeDef } from './theme';

import { WombatDataProvider } from 'wombat-data-framework';
import Header from './components/Header/Header';
import { getColorgorical } from './lib/color';
import { generateThemeColor } from './lib/palette';
import { useDeepMemo } from './hooks/useDeepEffect';
import { DATA_COLUMNS, OBJECT_STORE_NODES, ALASQL_NODES, FUNCTION_NODES, FILE_PARSING_NODES, indexedDbNode } from './WombatDataFrameworkSchema';

const ContextualizedRoute = ({ route }: { route: ScrimsightRoute }): JSX.Element => {
  let el: JSX.Element = React.createElement(route.component, {});
  for (const context of route.contexts || []) {
    el = React.createElement(context, undefined, el);
  }
  console.log('el', el);
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
      <Header />
      <Routes>{routes.map((route) => route.path.map((path, i) => <Route key={path} path={path} index={(i === (0 as unknown)) as false} element={<ContextualizedRoute route={route} />} />))}</Routes>
    </ThemeProvider>
  );
}

const App = () => {
  const [tick, setTick] = React.useState(0);
  const incrementTick = () => {
    setTick((tick) => {
      return tick + 1;
    });
  };

  console.log('Rendering App');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <BrowserRouter basename="/">
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <WombatDataProvider updateGlobalCallback={incrementTick} columns={DATA_COLUMNS} nodes={[indexedDbNode, ...FILE_PARSING_NODES, ...OBJECT_STORE_NODES, ...ALASQL_NODES, ...FUNCTION_NODES]}>
            <ThemedRoutes />
          </WombatDataProvider>
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        reactRouterNavigate(location, { replace: true, state: location.state });
      },
      push(location: Location) {
        reactRouterNavigate(location, {
          replace: false,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          state: location.state,
        });
      },
    }),
    [reactRouterNavigate],
  );
  // https://github.com/pbeshai/use-query-params/issues/196
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return children({
    history: adaptedHistory,
    location: reactRouterlocation,
  });
};

export default App;
