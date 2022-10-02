import Home from './pages/Home/Home';
import React, {useMemo} from 'react';
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
const App = () => (
  <BrowserRouter>
    <QueryParamProvider adapter={RouteAdapter}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map/:mapId" element={<Map />} />
        {/* <Route path="/report/edit" element={<ReportBuilderPage />} /> */}
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </QueryParamProvider>
  </BrowserRouter>
);

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
    reactRouterLocation: reactRouterlocation,
  });
};

export default App;
