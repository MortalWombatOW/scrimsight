import Home from '../pages/Home/Home';
import PlayerPage from '../pages/PlayerPage/PlayerPage';
import ReportPage from '../pages/ReportPage/ReportPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import UploadPage from '../pages/Uploads/UploadPage';
import MapList from '../pages/Map/MapList';
import DebugQueries from '../components/Debug/DebugQueries';

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
    path: '/report',
    component: ReportPage,
    name: 'Reports',
  },
  {
    path: '/maps',
    component: MapList,
    name: 'Maps',
  },
  {
    path: '/data',
    component: UploadPage,
    name: 'Add Data',
  },
  {
    path: '/settings',
    component: SettingsPage,
    name: 'Settings',
  },
];

export default routes;
