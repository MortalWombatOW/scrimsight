import {Grid, Typography, Button} from '@mui/material';
import {Box} from '@mui/system';
import React from 'react';

const SplashRow = ({
  title,
  content,
  image,
  beforeBackgroundColor,
  backgroundColor,
  className,
  textColor,
  button,
}: {
  title: string;
  content: string;
  image: string;
  beforeBackgroundColor?: string;
  backgroundColor?: string;
  className?: string;
  textColor: string;
  button?: {
    text: string;
    onClick: () => void;
  };
}) => {
  return (
    <Box
      component="div"
      style={{
        display: 'flex',
        width: '100%',
        backgroundColor: beforeBackgroundColor,
      }}>
      <Box
        component="div"
        style={{
          display: 'flex',
          width: '100%',
          backgroundColor: backgroundColor,
          color: textColor,
          padding: '50px',
        }}
        className={className}>
        <Grid container>
          <Grid item xs={8}>
            <Typography variant="h3" sx={{marginBottom: '32px'}}>
              {title}
            </Typography>
            <Typography variant="body1">{content}</Typography>
            {button && (
              <Button variant="contained" color="secondary" sx={{marginTop: '32px'}}>
                {button?.text}
              </Button>
            )}
          </Grid>
          <Grid item xs={3}>
            <Box component={'img'} src={image} style={{width: '100%'}} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SplashRow;
