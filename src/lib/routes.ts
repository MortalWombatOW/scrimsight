import DebugPage from '../pages/Debug/DebugPage';
import Home from '../pages/Home/Home';
import MapPage from '../pages/MapV2/MapPage';
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
    component: Home,
  },
  // {
  //   path: ['/dashboard'],
  //   component: Home,
  //   name: 'Dashboard',
  // },
  {
    path: ['/map', '/map/:mapId'],
    component: MapPage,
    name: 'View Maps',
  },
  {
    path: ['/player/:playerId'],
    component: PlayerPage,
    name: 'View Players',
  },
  // {
  //   path: ['/team'],
  //   component: PlayerPage,
  //   name: 'Teams',
  // },
  // {
  //   path: ['/debug'],
  //   component: DebugPage,
  //   name: 'Debug',
  // },
];

export default routes;
