import React from 'react';
import {Box, Card, Typography} from '@mui/material';
import {PulseLoader} from 'react-spinners';
import './Card.scss';

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
    <Card className="MetricCard" variant="outlined">
      <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
        {name}
      </Typography>
      <Typography
        variant="body1"
        component="div"
        sx={{display: 'inline-block'}}
        className={value === undefined ? 'blinkingcursor' : 'typingtext'}>
        {value === undefined ? (
          <PulseLoader color="#5e5e5e" size={4} />
        ) : value > 1000 ? (
          `${(value / 1000).toFixed(2)}k`
        ) : (
          value.toFixed(2)
        )}
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
  );
};

export default MetricCard;
