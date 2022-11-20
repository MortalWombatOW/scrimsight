import Home from '../pages/Home/Home';
import PlayerPage from '../pages/PlayerPage/PlayerPage';
import ReportPage from '../pages/ReportPage/ReportPage';
import UploadPage from '../pages/Uploads/UploadPage';

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
    path: '/uploads',
    component: UploadPage,
    name: 'Uploads',
  },
];

export default routes;
