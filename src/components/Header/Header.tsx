import React from 'react';
import {Toolbar} from '@mui/material';
import Uploader from '../Uploader/Uploader';
import {useNavigate} from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <Toolbar className="header">
      <span className="logo" onClick={() => navigate('/')}>
        scrimsight
      </span>
      <div className="navbuttons">
        <Uploader />
        {/* <DataSummary dataset={dataset} /> */}
      </div>
    </Toolbar>
  );
};

export default Header;
