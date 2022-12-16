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
import ImageCard from '../../components/Card/ImageCard';
import SplashRow from './SplashRow';

const SplashPage = () => {
  return (
    <Box style={{width: '100%'}}>
      <ImageCard
        width="100%"
        src="/assets/splash.png"
        titleText="Take your team to the next level"
        contentText="Unlock the power of data-driven decision making with Scrimsight."
        buttons={[
          {
            text: 'Explore example data',
            onClick: () => {},
          },
          {
            text: 'Create your team',
            onClick: () => {},
          },
        ]}
        style={{
          marginLeft: '50px',
          marginRight: '50px',
        }}
      />
      <SplashRow
        title="Easy to set up"
        content="With a custom workshop code, your scrims are automatically logged to your PC."
        image="/assets/settingsscreen.png"
        backgroundColor="#a93669"
        textColor="white"
      />
      <SplashRow
        title="Control your data"
        content="All of your data is stored and processed locally on your PC. Load your data manually or integrate with your prefered file storage service."
        image="/assets/settingsscreen.png"
        backgroundColor="#001732"
        textColor="white"
      />
      <SplashRow
        title="Cumulative insights"
        content="Browse metrics for players and teams over time. The more games you log, the more insights you'll gain."
        image="/assets/settingsscreen.png"
        backgroundColor="#a93669"
        textColor="white"
      />
      <SplashRow
        title="Revisit matches"
        content="See how the match unfolded with the play-by-play viewer. Link to specific moments in your match to share with your team."
        image="/assets/settingsscreen.png"
        backgroundColor="#001732"
        textColor="white"
      />
    </Box>
  );
};

export default SplashPage;
