import {Location} from 'history';
import React, {useMemo} from 'react';
import {BrowserRouter, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {CssBaseline, ThemeProvider, createTheme} from '@mui/material';
import {QueryParamProvider} from 'use-query-params';
import {ReactRouter6Adapter} from 'use-query-params/adapters/react-router-6';
import routes, {ScrimsightRoute} from './lib/routes';
import {themeDef} from './theme';

import {DataProvider} from './WombatDataFramework/DataContext';
import Header from './components/Header/Header';
import {getColorgorical} from './lib/color';
import {generateThemeColor} from './lib/palette';

const ContextualizedRoute = ({route}: {route: ScrimsightRoute}): JSX.Element => {
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
      <Routes>
        {routes.map((route) => route.path.map((path, i) => <Route key={path} path={path} index={(i === (0 as unknown)) as false} element={<ContextualizedRoute route={route} />} />))}

        {/* <Route path="/map/:mapId" element={<Map />} />
      {/* <Route path="/report/edit" element={<ReportBuilderPage />} /> */}
      </Routes>
    </ThemeProvider>
  );
}

const App = () => {
  const [tick, setTick] = React.useState(0);
  const incrementTick = () => {
    console.log('apptick', tick);
    setTick((tick) => tick + 1);
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      <BrowserRouter basename="/">
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <DataProvider globalTick={tick} updateGlobalCallback={incrementTick}>
            <ThemedRoutes />
          </DataProvider>
        </QueryParamProvider>
      </BrowserRouter>
    </div>
  );
};

const RouteAdapter: React.FC = ({children}: {children}) => {
  const reactRouterNavigate = useNavigate();
  const reactRouterlocation = useLocation();

  const adaptedHistory = useMemo(
    () => ({
      // can disable eslint for parts here, location.state can be anything
      replace(location: Location) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        reactRouterNavigate(location, {replace: true, state: location.state});
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
