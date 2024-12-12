import React from 'react';
import Home from './pages/Home/Home';
import {QueriesPage} from 'wombat-data-framework';
import HomeIcon from '@mui/icons-material/Home';
import BugReportIcon from '@mui/icons-material/BugReport';
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

  // {
  //   path: ['/map'],
  //   component: Home,
  //   name: 'Maps',
  //   icon: <DateRangeIcon />,
  // },
  // {
  //   path: ['/map/:matchId'],
  //   component: MapPage,
  //   icon: <EmojiFlagsIcon />,
  // },
  // {
  //   path: ['/player'],
  //   component: PlayersPage,
  //   name: 'Players',
  //   icon: <SupportAgentIcon />,
  // },
  // {
  //   path: ['/player/:playerName'],
  //   component: PlayerPage,
  //   name: 'Player',
  //   icon: <SupportAgentIcon />,
  // },
  // {
  //   path: ['/team'],
  //   component: TeamsPage,
  //   name: 'Teams',
  //   icon: <Groups3Icon />,
  // },
  // {
  //   path: ['/team/:teamName'],
  //   component: TeamPage,
  //   name: 'Team',
  //   icon: <Groups3Icon />,
  // },
  // {
  //   path: ['/metrics'],
  //   component: MetricsPage,
  //   name: 'Metrics',
  //   icon: <EqualizerIcon />,
  // },
  {
    path: ['/queries'],
    component: QueriesPage,
    name: 'Debug',
    icon: <BugReportIcon />,
  },
];

export default routes;
