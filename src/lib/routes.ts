import React from 'react';
import Home from '../pages/Home/Home';
import SplashPage from '../pages/SplashPage/SplashPage';
import QueriesPage from '../pages/QueriesPage/QueriesPage';
import MapPage from '../pages/MapPage/MapPage';

export interface ScrimsightRoute {
  path: string[];
  component: () => JSX.Element;
  name?: string;
  hidden?: boolean;
  contexts?: ((props: {children: React.ReactNode}) => JSX.Element)[];
}

const routes: ScrimsightRoute[] = [
  {
    path: ['/'],
    component: SplashPage,
  },
  {
    path: ['/map'],
    component: Home,
    name: 'Maps',
  },
  {
    path: ['/map/:mapId'],
    component: MapPage,
  },
  // {
  //   path: ['/player/:playerName'],
  //   component: PlayerPage,
  //   name: 'Players',
  // },
  {
    path: ['/queries'],
    component: QueriesPage,
    name: 'Queries',
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
