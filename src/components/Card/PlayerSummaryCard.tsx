import {Card, CardContent, Grid, Avatar, Typography, Chip} from '@mui/material';
import React from 'react';

const PlayerSummaryCard = ({playerName}: {playerName: string}) => {
  const playerIcon = 'https://i.imgur.com/0X2V9w1.png';
  const metrics = ['Top 500', 'Top 100', 'Top 10', 'Top 1'];
  return (
    <Card sx={{minWidth: '200px'}}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar src={playerIcon} />
          </Grid>
          <Grid item>
            <Typography variant="h5">{playerName}</Typography>
          </Grid>
          <Grid item>
            {metrics.map((metric, index) => {
              return <Chip key={index} label={metric} variant="outlined" />;
            })}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PlayerSummaryCard;
