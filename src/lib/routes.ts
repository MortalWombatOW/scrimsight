import Home from '../pages/Home/Home';
import MapList from '../pages/Map/MapList';
import PlayerPage from '../pages/PlayerPage/PlayerPage';
import SettingsPage from '../pages/Settings/SettingsPage';

interface Route {
  path: string;
  component: () => JSX.Element;
  name: string;
}

const routes: Route[] = [
  {
    path: '/',
    component: Home,
    name: 'Home',
  },
  {
    path: '/player',
    component: PlayerPage,
    name: 'Players',
  },
  {
    path: '/maps',
    component: MapList,
    name: 'Maps',
  },
  {
    path: '/settings',
    component: SettingsPage,
    name: 'Settings',
  },
];

export default routes;
