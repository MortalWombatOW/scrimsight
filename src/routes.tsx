import React from 'react';
import Home from './pages/Home/Home';
import MapPage from './pages/MapPage/MapPage';
import PlayersPage from './pages/Players/PlayersPage';
import PlayerPage from './pages/Player/PlayerPage';
import TeamsPage from './pages/Teams/TeamsPage';
import TeamPage from './pages/Team/TeamPage';
import MetricsPage from './pages/Metrics/MetricsPage';
import {QueriesPage} from 'wombat-data-framework';
import HomeIcon from '@mui/icons-material/Home';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import Groups3Icon from '@mui/icons-material/Groups3';
import BugReportIcon from '@mui/icons-material/BugReport';
import EqualizerIcon from '@mui/icons-material/Equalizer';
export interface ScrimsightRoute {
  path: string[];
  component: () => JSX.Element;
  name?: string;
  hidden?: boolean;
  icon?: React.ReactNode;
}

const routes: ScrimsightRoute[] = [
  {
    path: ['/'],
    component: Home,
    name: 'Home',
    icon: <HomeIcon />,
  },

  {
    path: ['/map'],
    component: Home,
    name: 'Maps',
    icon: <DateRangeIcon />,
  },
  {
    path: ['/map/:mapId'],
    component: MapPage,
    icon: <EmojiFlagsIcon />,
  },
  {
    path: ['/player'],
    component: PlayersPage,
    name: 'Players',
    icon: <SupportAgentIcon />,
  },
  {
    path: ['/player/:playerName'],
    component: PlayerPage,
    name: 'Player',
    icon: <SupportAgentIcon />,
  },
  {
    path: ['/team'],
    component: TeamsPage,
    name: 'Teams',
    icon: <Groups3Icon />,
  },
  {
    path: ['/team/:teamName'],
    component: TeamPage,
    name: 'Team',
    icon: <Groups3Icon />,
  },
  {
    path: ['/metrics'],
    component: MetricsPage,
    name: 'Metrics',
    icon: <EqualizerIcon />,
  },
  {
    path: ['/queries'],
    component: QueriesPage,
    name: 'Debug',
    icon: <BugReportIcon />,
  },
];

export default routes;
