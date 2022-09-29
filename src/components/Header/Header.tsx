import React from 'react';
import {Toolbar} from '@mui/material';
import Uploader from '../Uploader/Uploader';
import {useNavigate} from 'react-router-dom';

import SearchBar from '../SearchBar/SearchBar';
import './Header.scss';

const Header = ({
  refreshCallback,
  filters,
  setFilters,
}: {
  refreshCallback: (() => void) | undefined;
  filters: {[key: string]: string[]};
  setFilters: (filters: {[key: string]: string[]}) => void;
}) => {
  const navigate = useNavigate();
  return (
    <Toolbar className="header">
      <span className="logo" onClick={() => navigate('/')}>
        scrimsight
      </span>
      <div className="center">
        <SearchBar
          filters={filters}
          setFilters={setFilters}
          allOptions={[{foo: 'bar'}]}
        />
      </div>
      <div className="navbuttons">
        <Uploader refreshCallback={refreshCallback} />
      </div>
    </Toolbar>
  );
};

export default Header;
