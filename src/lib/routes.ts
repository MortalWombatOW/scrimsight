import Home from '../pages/Home/Home';
import MapPage from '../pages/Map/MapPage';
import PlayerPage from '../pages/PlayerPage/PlayerPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import SplashPage from '../pages/SplashPage/SplashPage';

interface Route {
  path: string[];
  component: () => JSX.Element;
  name: string;
}

const routes: Route[] = [
  {
    path: ['/'],
    component: SplashPage,
    name: 'Overview',
  },
  {
    path: ['/team'],
    component: Home,
    name: 'Team',
  },
  {
    path: ['/player'],
    component: PlayerPage,
    name: 'Players',
  },
  {
    path: ['/map', '/map/:mapId', '/map/:mapId/:view'],
    component: MapPage,
    name: 'Maps',
  },
  {
    path: ['/workshop'],
    component: SettingsPage,
    name: 'Workshop Config',
  },
  {
    path: ['/settings'],
    component: SettingsPage,
    name: 'Settings',
  },
];

export default routes;
