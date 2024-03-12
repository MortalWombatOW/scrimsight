import React from 'react';
import DebugPage from '../pages/Debug/DebugPage';
import Home from '../pages/Home/Home';
import MapPage from '../pages/Map/MapPage';
import PlayerPage from '../pages/PlayerPage/PlayerPage';
import SplashPage from '../pages/SplashPage/SplashPage';
import {MapContextProvider} from '../context/MapContext';

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
    name: 'View Scrims',
  },
  {
    path: ['/map/:mapId'],
    component: MapPage,
    name: 'View Maps',
    hidden: true,
    contexts: [MapContextProvider],
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
