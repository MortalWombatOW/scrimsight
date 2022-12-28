import {
  Container,
  Box,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from '@mui/material';
import React from 'react';
import {Link} from 'react-router-dom';
import HomeDashboard from '../../components/HomeDashboard/HomeDashboard';
import {useResult} from '../../hooks/useQueries';
import SplashPage from '../SplashPage/SplashPage';
import Header from './../../components/Header/Header';
import MapsList from './../../components/MapsList/MapsList';

const Home = () => {
  const [updateCount, setUpdateCount] = React.useState(0);
  const incrementUpdateCount = () => setUpdateCount((prev) => prev + 1);

  const [maps, tick] = useResult('map');
  const isLoading = maps === undefined;
  const isNewUser = (!isLoading && maps.length === 0) || true;

  return (
    <div>
      <Header
        refreshCallback={incrementUpdateCount}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      <div className="Home-container">
        {isLoading ? (
          <CircularProgress variant="indeterminate" color="primary" />
        ) : null}
        <HomeDashboard />
      </div>
    </div>
  );
};

export default Home;
