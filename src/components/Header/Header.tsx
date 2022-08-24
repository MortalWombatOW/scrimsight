import React from 'react';
import {Toolbar} from '@mui/material';
import Uploader from '../Uploader/Uploader';
import {useNavigate} from 'react-router-dom';

import './Header.scss';

const Header = ({
  refreshCallback,
}: {
  refreshCallback: (() => void) | undefined;
}) => {
  const navigate = useNavigate();
  return (
    <Toolbar className="header">
      <span className="logo" onClick={() => navigate('/')}>
        scrimsight
      </span>
      <div className="navbuttons">
        <Uploader refreshCallback={refreshCallback} />
      </div>
    </Toolbar>
  );
};

export default Header;
