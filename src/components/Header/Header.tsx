import React from 'react';
import {Toolbar} from '@mui/material';
// import DataSummary from './DataSummary';
import Uploader from '../Uploader/Uploader';

const Header = () => {
  return (
    <Toolbar className="header">
      <img className="logoicon" src="/assets/owlogo.svg" alt="logo" />
      <span className="logo">scrimsight</span>
      <div className="navbuttons">
        <Uploader />
        {/* <DataSummary dataset={dataset} /> */}
      </div>
    </Toolbar>
  );
};

export default Header;
