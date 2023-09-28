import {
  Card,
  CardContent,
  Grid,
  Avatar,
  Typography,
  Chip,
  CircularProgress,
  CardActions,
  CardHeader,
  Button,
  List,
  ListItem,
  Skeleton,
} from '@mui/material';
import React from 'react';
// import usePlayerSummaryMetrics from '../../hooks/usePlayerSummaryMetrics';
import {format, formatTime} from '../../lib/format';
import MetricText from '../Common/MetricText';
import {getIcon} from '../Common/RoleIcons';

const PlayerSummaryCard = ({playerName}: {playerName: string}) => {
  // const [results, tick] = usePlayerSummaryMetrics(playerName);
  const results = undefined;

  const isLoaded = results !== undefined;

  return (
    <Card sx={{width: '400px'}}>
      {/* <CardHeader
        avatar={
          results?.role === undefined ? (
            <CircularProgress
              variant="indeterminate"
              color="primary"
              size={15}
            />
          ) : (
            getIcon(results.role)
          )
        }
        disableTypography
        title={<Typography variant="h5">{playerName}</Typography>}
        subheader={
          <Typography variant="subtitle1">
            {results?.role === undefined ? (
              <span>...</span>
            ) : (
              results.role + ' player'
            )}
          </Typography>
        }
      />
      <CardContent>
        {isLoaded ? (
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <MetricText
                label="Maps played"
                value={format(results.mapsPlayed, 0)}
              />
            </Grid>
            <Grid item xs={6}>
              <MetricText
                label="Playtime"
                value={formatTime(results.playTime)}
              />
            </Grid>
            <Grid item xs={6}>
              <MetricText
                label="Damage done / taken"
                value={format(results.damageDoneVsTaken, 2)}
              />
            </Grid>
            <Grid item xs={6}>
              <MetricText
                label="Eliminations / deaths"
                value={format(results.elimsVsDeaths, 2)}
              />
            </Grid>
            <Grid item xs={6}>
              <MetricText
                label="Final blows / eliminations"
                value={format(results.finalBlowsVsElims, 2)}
              />
            </Grid>
          </Grid>
        ) : (
          <Skeleton variant="rectangular" width={380} height={150} />
        )}
      </CardContent> */}
      <CardActions>
        <Button size="small" color="secondary">
          View Player
        </Button>
      </CardActions>
    </Card>
  );
};

export default PlayerSummaryCard;
