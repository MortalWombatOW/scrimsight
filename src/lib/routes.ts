import React from 'react';
import Home from '../pages/Home/Home';
import MapPage from '../pages/MapPage/MapPage';
import PlayerPage from '../pages/PlayerPage/PlayerPage';
import SplashPage from '../pages/SplashPage/SplashPage';
import {MapContextProvider} from '../pages/MapPage/context/MapContext';
import {PlayerContextProvider} from '../pages/PlayerPage/context/PlayerContext';
import {FilterContextProvider} from '../context/FilterContextProvider';
import QueriesPage from '../pages/QueriesPage/QueriesPage';

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
    hidden: true,
    contexts: [MapContextProvider, FilterContextProvider],
  },
  {
    path: ['/player/:playerName'],
    component: PlayerPage,
    name: 'Players',
    contexts: [PlayerContextProvider, FilterContextProvider],
  },
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
