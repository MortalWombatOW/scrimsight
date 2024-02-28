import DebugPage from '../pages/Debug/DebugPage';
import Home from '../pages/Home/Home';
import MapPage from '../pages/MapV2/MapPage';
import PlayerPage from '../pages/PlayerPage/PlayerPage';
import SplashPage from '../pages/SplashPage/SplashPage';

interface Route {
  path: string[];
  component: () => JSX.Element;
  name?: string;
  hidden?: boolean;
}

const routes: Route[] = [
  {
    path: ['/'],
    component: SplashPage,
  },
  {
    path: ['/map'],
    component: Home,
    name: 'View Scrims',
  },
  {
    path: ['/map/:mapId'],
    component: MapPage,
    name: 'View Maps',
    hidden: true,
  },
  {
    path: ['/player/:playerId'],
    component: PlayerPage,
    name: 'View Players',
    hidden: true,
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
