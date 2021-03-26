import React from 'react';
import PropTypes from 'prop-types';
import './Dashboard.css';
import { Responsive, WidthProvider  } from 'react-grid-layout';
import Logo from '../Logo';

const ResponsiveGridLayout = WidthProvider(Responsive);

const layout = [
  {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
  {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
  {i: 'c', x: 4, y: 0, w: 1, h: 2}
];

const layouts = {
  lg: layout,
  md: layout,
  sm: layout,
  xs: layout,
  xxs: layout
};

const Dashboard = (props) => (
  <div className="Dashboard">
    <Logo></Logo>
    <ResponsiveGridLayout className="layout"
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
          {props.children.map((elem, i) => <div key={i} className="dashelement" data-grid={{x: i*3, y: 0, w: 3, h: 2, minW: 3, maxW: 4}}>{i}</div>)}
      </ResponsiveGridLayout>
  </div>
);

Dashboard.propTypes = {};

Dashboard.defaultProps = {};

export default Dashboard;
