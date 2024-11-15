import React from 'react';
import {Skeleton, Grid} from '@mui/material';
import {TimelineContainer, PlayerNameCell} from '../styles/timeline.styles';

export const TimelineSkeleton: React.FC = () => (
  <>
    <Skeleton variant="text" width={200} height={40} sx={{mb: 2}} />
    {[...Array(5)].map((_, index) => (
      <TimelineContainer container key={index} spacing={1}>
        <PlayerNameCell item xs={2}>
          <Skeleton variant="text" width={100} />
        </PlayerNameCell>
        <Grid item xs={10}>
          <Skeleton variant="rectangular" height={20} />
        </Grid>
      </TimelineContainer>
    ))}
  </>
); 