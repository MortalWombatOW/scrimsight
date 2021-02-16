import React from 'react';
import PropTypes from 'prop-types';
import './MapPage.css';
import DamageChart from '../DamageChart/DamageChart';
import PlayersInMap from '../PlayersInMap/PlayersInMap';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';

const layout = [
  {i: 'players', x: 0, y: 0, w: 1, h: 2, static: true},
  {i: 'dmg', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
];

const MapPage = (params) => (
  <div className="MapPage">
    
    
    <ResponsiveGridLayout className="layout" layouts={layouts}
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
        <PlayersInMap key='players' id={params.match.params.id}></PlayersInMap>
        <DamageChart key='dmg' id={params.match.params.id}></DamageChart>
    </ResponsiveGridLayout>
  </div>
);

MapPage.propTypes = {};

MapPage.defaultProps = {};

export default MapPage;
