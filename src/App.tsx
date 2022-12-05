import Home from './pages/Home/Home';
import React, {useEffect, useLayoutEffect, useMemo} from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {Location} from 'history';
import Map from './pages/Map/Map';
import ReportPage from './pages/ReportPage/ReportPage';
// import ReportBuilderPage from './pages/ReportBuilderPage/ReportBuilderPage';
import {QueryParamProvider} from 'use-query-params';
import {createTheme, ThemeProvider} from '@mui/material';
import PlayerPage from './pages/PlayerPage/PlayerPage';
import routes from './lib/routes';
import useQueries from './hooks/useQueries';
import ResultCache from './lib/data/ResultCache';
import DebugQueries from './components/Debug/DebugQueries';

const theme = createTheme({
  palette: {
    primary: {
      main: '#363636',
    },
  },
});

const App = () => {
  // React runs useEffects from child components before parent components.
  // Because this is the root component, and we need this to run first, we use useLayoutEffect instead.
  // useLayoutEffect(() => {
  //   ResultCache.runQueries(

  //   );
  // }, []);

  const [results, tick] = useQueries(
    [
      {name: 'player_status', query: 'select * from player_status'},
      {name: 'player_interaction', query: 'select * from player_interaction'},
      {name: 'player_ability', query: 'select * from player_ability'},
      {name: 'map', query: 'select * from map'},
    ],
    [],
    {
      runFirst: true,
    },
  );

  return (
    <div>
      {/* <DebugQueries /> */}
      <ThemeProvider theme={theme}>
        <BrowserRouter basename="/">
          <QueryParamProvider adapter={RouteAdapter}>
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                />
              ))}

              <Route path="/map/:mapId" element={<Map />} />
              {/* <Route path="/report/edit" element={<ReportBuilderPage />} /> */}
            </Routes>
          </QueryParamProvider>
        </BrowserRouter>
      </ThemeProvider>
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
