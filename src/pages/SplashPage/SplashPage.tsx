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
} from '@mui/material';
import React from 'react';
import {Link} from 'react-router-dom';

const SplashPage = () => {
  return (
    <Container maxWidth="xl">
      <Box m={3}>
        <Typography variant="h1" align="center">
          Welcome to Scrimsight
        </Typography>
        <Typography variant="h5" align="center">
          Professional Overwatch Team Management and Scrim Analysis
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-around" m={3}>
        <Card>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Analyze a Player's Performance"
              height="140"
              image="player-performance.jpg"
              title="Analyze a Player's Performance"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Analyze a Player's Performance
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Review a player's performance over many games with Scrimsight.
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary" component={Link} to="/player">
              Read More
            </Button>
          </CardActions>
        </Card>
        <Card>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Review a Specific Map"
              height="140"
              image="specific-map.jpg"
              title="Review a Specific Map"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Review a Specific Map
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Analyze a specific map's performance with Scrimsight.
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary" component={Link} to="/map">
              Read More
            </Button>
          </CardActions>
        </Card>
      </Box>
      <Button
        variant="contained"
        color="primary"
        size="large"
        component={Link}
        to="/signup">
        Get Started
      </Button>
    </Container>
  );
};

export default SplashPage;
