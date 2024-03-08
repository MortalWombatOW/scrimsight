import {Location} from 'history';
import React, {useMemo} from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import {QueryParamProvider} from 'use-query-params';
import {ReactRouter6Adapter} from 'use-query-params/adapters/react-router-6';
import routes from './lib/routes';
import {themeDef} from './theme';

import {DataProvider} from './WombatDataFramework/DataContext';
import {generateThemeColor} from './lib/palette';
import {TeamContextProvider} from './context/TeamContextProvider';
import {getColorgorical} from './lib/color';
import {TeamContext} from './context/TeamContext';

function ThemedRoutes(props) {
  const {team1Name, team2Name} = React.useContext(TeamContext);

  const theme = useMemo(
    () =>
      createTheme({
        ...themeDef,
        palette: {
          ...themeDef.palette,
          team1: generateThemeColor(getColorgorical(team1Name)),
          team2: generateThemeColor(getColorgorical(team2Name)),
        },
      }),
    [team1Name, team2Name],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {routes.map((route) =>
          route.path.map((path, i) => (
            <Route
              key={path}
              path={path}
              index={(i === (0 as unknown)) as false}
              element={<route.component />}
            />
          )),
        )}

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
          <TeamContextProvider>
            <DataProvider
              globalTick={tick}
              updateGlobalCallback={incrementTick}>
              <ThemedRoutes />
            </DataProvider>
          </TeamContextProvider>
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
