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
import Header from '../../components/Header/Header';
import MapsList from '../../components/MapsList/MapsList';

const ExplorePage = () => {
  const [updateCount, setUpdateCount] = React.useState(0);
  const incrementUpdateCount = () => setUpdateCount((prev) => prev + 1);


  return (
    <div>
      <Header
        refreshCallback={incrementUpdateCount}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      <div className="Explore-container">
      
      </div>
    </div>
  );
};

export default ExplorePage;
