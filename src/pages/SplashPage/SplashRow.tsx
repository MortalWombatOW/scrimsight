import {Grid} from '@mui/material';
import {Box} from '@mui/system';
import React from 'react';
import {Typography} from '../../components/Common/Mui';

const SplashRow = ({title, content, image, backgroundColor, textColor}) => {
  return (
    <Box
      style={{
        display: 'flex',
        width: '100%',
        backgroundColor: backgroundColor,
        color: textColor,
        padding: '50px',
      }}>
      <Grid container>
        <Grid item xs={8}>
          <Typography variant="h3" header sx={{marginBottom: '75px'}}>
            {title}
          </Typography>
          <Typography variant="body1">{content}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Box component={'img'} src={image} style={{width: '100%'}} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SplashRow;
