import {Box, Card, Typography} from '@mui/material';
import React from 'react';

const percentDiff = (a: number, b: number) => {
  return ((a - b) / b) * 100;
};

const MetricCard = ({
  value,
  name,
  compareValue,
  compareText,
}: {
  value: number | undefined;
  name: string;
  compareValue: number | undefined;
  compareText: string;
}) => {
  const diff =
    value === undefined || compareValue === undefined
      ? 0
      : percentDiff(value, compareValue);
  const diffText = diff > 0 ? `+${diff.toFixed(2)}%` : `${diff.toFixed(2)}%`;
  return (
    <Box sx={{width: 300}}>
      <Card variant="outlined">
        <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
          {name}
        </Typography>
        <Typography variant="h5" component="div">
          {value === undefined
            ? 'loading...'
            : value > 1000
            ? `${(value / 1000).toFixed(2)}k`
            : value.toFixed(2)}
        </Typography>
        <Typography variant="body2">
          <span
            className={
              diff > 0 ? 'increase-text' : diff < 0 ? 'decrease-text' : ''
            }>
            {diffText}
          </span>{' '}
          vs {compareText}
        </Typography>
      </Card>
    </Box>
  );
};

export default MetricCard;
