import {
  Container,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import React from 'react';
import {Link} from 'react-router-dom';
import ImageCard from '../../components/Card/ImageCard';
import {Button, Typography} from '../../components/Common/Mui';
import Header from '../../components/Header/Header';
import SplashRow from './SplashRow';

const SplashPage = () => {
  return (
    <Box style={{width: '100%'}}>
      <Header
        refreshCallback={() => {}}
        filters={{}}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setFilters={(filters) => {}}
      />
      <ImageCard
        width="100%"
        src="/assets/splash.png"
        titleText="Take your team to the next level"
        contentText="Unlock the power of data-driven insights for your Overwatch team with Scrimsight"
        // buttons={[
        //   {
        //     text: 'Explore example data',
        //     onClick: () => {},
        //   },
        //   {
        //     text: 'Create your team',
        //     onClick: () => {},
        //   },
        // ]}
        style={{
          marginLeft: '50px',
          marginRight: '50px',
        }}
      />

      <Box
        style={{
          marginLeft: '50px',
          marginRight: '50px',
        }}>
        <Box>
          <Typography variant="h5" style={{marginBottom: '20px'}}>
            Do you manage or coach a competitive Overwatch team?
          </Typography>
          <Typography variant="body2" style={{marginBottom: '20px'}}>
            Scrimsight takes the guesswork out of analyzing your team's
            performance. With detailed statistics and replay features, you can
            quickly identify and communicate the issues that are holding your
            team back and make better-informed decisions to supercharge your
            team. Use Scrimsight to find the keys to victory for your team!
          </Typography>
        </Box>
      </Box>
      <Box
        style={{
          width: '100%',
          backgroundColor: '#F9A03F',
        }}>
        <Box
          style={{
            width: '100%',
            borderBottomLeftRadius: '50% 32%',
            borderBottomRightRadius: '50% 32%',
            backgroundColor: '#f3f3f3',
            display: 'flex',
            paddingLeft: '50px',
            paddingRight: '50px',
            flexWrap: 'wrap',
            marginTop: '50px',
            paddingBottom: '32px',
          }}>
          <Button
            variant="contained"
            color="secondary"
            style={{
              marginRight: '100px',
              fontSize: '32px',
              width: '350px',
              marginBottom: '20px',
            }}>
            Explore example data
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={{
              fontSize: '32px',
              width: '350px',
              marginBottom: '20px',
            }}>
            Get started with your data
          </Button>
        </Box>
      </Box>

      <SplashRow
        title="Easy to set up"
        content="With a custom workshop code, your scrims are automatically logged to your PC."
        image="/assets/settingsscreen.png"
        beforeBackgroundColor="#001732"
        backgroundColor="#F9A03F"
        textColor="black"
        button={{
          text: 'Get started',
          onClick: () => {},
        }}
      />
      <SplashRow
        title="Control your data"
        content="All of your data is stored and processed locally on your PC. Load your data manually or integrate with your prefered file storage service."
        image="/assets/settingsscreen.png"
        beforeBackgroundColor="#F9A03F"
        backgroundColor="#001732"
        textColor="white"
        button={{
          text: 'Learn more',
          onClick: () => {},
        }}
      />
      <SplashRow
        title="Cumulative insights"
        content="Browse metrics for players and teams over time. The more games you log, the more insights you'll gain."
        image="/assets/settingsscreen.png"
        beforeBackgroundColor="#001732"
        backgroundColor="#F9A03F"
        textColor="black"
        button={{
          text: 'See an example',
          onClick: () => {},
        }}
      />
      <SplashRow
        title="Revisit matches"
        content="See how the match unfolded with the play-by-play viewer. Link to specific moments in your match to share with your team."
        image="/assets/settingsscreen.png"
        beforeBackgroundColor="#F9A03F"
        backgroundColor="#001732"
        textColor="white"
        button={{
          text: 'Try it out',
          onClick: () => {},
        }}
      />
      <Box
        style={{
          width: '100%',
          backgroundColor: '#F9A03F',
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
        }}>
        <Typography variant="body1">
          Terms of Service | Privacy Policy | © 2022 Andrew Gleeson
        </Typography>
      </Box>
    </Box>
  );
};

export default SplashPage;
