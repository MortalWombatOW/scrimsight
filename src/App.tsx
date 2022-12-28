import {Location} from 'history';
import React, {useMemo} from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import Map from './pages/Map/Map';
import {createTheme, ThemeProvider} from '@mui/material';
import {QueryParamProvider} from 'use-query-params';
import {ReactRouter6Adapter} from 'use-query-params/adapters/react-router-6';
import useQueries from './hooks/useQueries';
import routes from './lib/routes';

const theme = createTheme({
  palette: {
    primary: {
      main: '#001732',
    },
    secondary: {
      main: '#A356A7',
    },
  },
  typography: {
    fontFamily: 'Bitter',
  },
});

const App = () => {
  const [results, tick] = useQueries(
    [
      {name: 'player_status', query: 'select * from player_status'},
      {name: 'player_interaction', query: 'select * from player_interaction'},
      {name: 'player_ability', query: 'select * from player_ability'},
      {name: 'map', query: 'select * from map'},
      {name: 'team', query: 'select * from team'},
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
          <QueryParamProvider adapter={ReactRouter6Adapter}>
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
