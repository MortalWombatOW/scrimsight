import React from 'react';
import {Card, CardContent, CardActions, Button, Typography} from '@mui/material';
import useMetric from '../../hooks/useMetrics';
import './Card.scss';

interface MetricCardProps {
  columnName: string;
  slice: Record<string, string>;
  compareToOther: string[];
}

const MetricCard: React.FC<MetricCardProps> = ({columnName, slice, compareToOther}) => {
  const metric = useMetric(columnName, slice, compareToOther);
  console.log('MetricCard', metric);

  return (
    <Card className="MetricCard">
      <CardContent>
        <Typography variant="h3">{metric.column.formatter(metric.value)}</Typography>
        <Typography variant="body2">
          {metric.column.displayName}, {metric.valueLabel}
        </Typography>

        <Typography variant="body2">
          {metric.percentChange.toFixed(0)}% vs {metric.compareValueLabel}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
