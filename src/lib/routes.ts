import DebugPage from '../pages/Debug/DebugPage';
import Home from '../pages/Home/Home';
import MapPage from '../pages/Map/MapPage';
import PlayerPage from '../pages/PlayerPage/PlayerPage';
import SplashPage from '../pages/SplashPage/SplashPage';

interface Route {
  path: string[];
  component: () => JSX.Element;
  name?: string;
}

const routes: Route[] = [
  {
    path: ['/'],
    component: SplashPage,
  },
  {
    path: ['/dashboard'],
    component: Home,
    name: 'Dashboard',
  },
  {
    path: ['/player'],
    component: PlayerPage,
    name: 'Player Analysis',
  },
  {
    path: ['/team'],
    component: PlayerPage,
    name: 'Team Strategy',
  },
  {
    path: ['/map/:mapId'],
    component: MapPage,
  },
  {
    path: ['/review', '/review/:mapId'],
    component: MapPage,
    name: 'Match Breakdown',
  },
  {
    path: ['/debug'],
    component: DebugPage,
    name: 'Debug',
  },
];

export default routes;
