import ExplorePage from '~/pages/Explore/Explore';
import AnalysisPage from '../pages/AnalysisPage/AnalysisPage';
import Home from '../pages/Home/Home';
import MapPage from '../pages/Map/MapPage';
import PlayerPage from '../pages/PlayerPage/PlayerPage';
import SettingsPage from '../pages/Settings/SettingsPage';
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
    path: ['/home'],
    component: Home,
    name: 'Home',
  },
  {
    path: ['/player'],
    component: PlayerPage,
    name: 'Players',
  },
  {
    path: ['/map/:mapId'],
    component: MapPage,
  },
  {
    path: ['/review', '/review/:mapId'],
    component: MapPage,
    name: 'Review Map',
  },
  {
    path: ['/analyze'],
    component: AnalysisPage,
    name: 'Analyze',
  },
  {
    path: ['/workshop'],
    component: SettingsPage,
    name: 'Workshop Config',
  },
  {
    path: ['/explore'],
    component: ExplorePage,
    name: 'Explorer',
  },
  {
    path: ['/settings'],
    component: SettingsPage,
    name: 'Settings',
  },
];

export default routes;
