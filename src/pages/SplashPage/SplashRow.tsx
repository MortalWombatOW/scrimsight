import {Grid} from '@mui/material';
import {Box} from '@mui/system';
import React from 'react';
import {Button, Typography} from '../../components/Common/Mui';

const SplashRow = ({
  title,
  content,
  image,
  backgroundColor,
  textColor,
  button,
}: {
  title: string;
  content: string;
  image: string;
  backgroundColor: string;
  textColor: string;
  button?: {
    text: string;
    onClick: () => void;
  };
}) => {
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
          <Typography variant="h3" header sx={{marginBottom: '32px'}}>
            {title}
          </Typography>
          <Typography variant="body1">{content}</Typography>
          {button && (
            <Button
              variant="contained"
              color="secondary"
              sx={{marginTop: '32px'}}>
              {button?.text}
            </Button>
          )}
        </Grid>
        <Grid item xs={3}>
          <Box component={'img'} src={image} style={{width: '100%'}} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SplashRow;
