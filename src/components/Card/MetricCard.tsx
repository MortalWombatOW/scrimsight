import React, { useState } from 'react';
import { Card, CardContent, CardActions, Button, Typography, LinearProgress, CircularProgress, CardActionArea } from '@mui/material';
import useMetric, { MetricData } from '../../hooks/useMetrics';
import './Card.scss';
import { Bar, BarChart, ComposedChart, Legend, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';

interface MetricCardProps {
  columnName: string;
  slice: Record<string, string | number>;
  compareToOther: string[];
}

const MetricChange = ({ metric }: { metric: MetricData }) => {
  if (metric.direction === 'flat') {
    return (
      <Typography variant="body2" display="inline">
        flat
      </Typography>
    );
  }
  if (metric.direction === 'increase') {
    return (
      <Typography variant="body2" color="green" display="inline">
        +{metric.percentChange.toFixed(0)}%
      </Typography>
    );
  }
  return (
    <Typography variant="body2" color="red" display="inline">
      {metric.percentChange.toFixed(0)}%
    </Typography>
  );
};

const SmallHistogram = ({ metric }: { metric: MetricData }) => {
  const histogram = metric.histogram;
  console.log('metric', metric);
  return (
    <BarChart width={500} height={200} data={histogram}>
      <Bar dataKey="count" fill="#119911" />
      <Bar dataKey="compareCount" fill="#8884d8" strokeDasharray="3 3" />
      <XAxis dataKey="bin" interval="preserveStartEnd" tickLine={false} label={{ value: metric.column.displayName + ' distribution', position: 'insideBottom' }} height={50} />
    </BarChart>
  );
};

const MetricCard: React.FC<MetricCardProps> = ({ columnName, slice, compareToOther }) => {
  const [expanded, setExpanded] = useState(false);
  const metric = useMetric(columnName, slice, compareToOther);
  console.log('MetricCard', metric);


  const isLoading = metric.significance === 'unknown';

  if (isLoading) {
    return (
      <Card className="MetricCard">
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card className="MetricCard">
      <CardActionArea className="metric-card-action-area" onClick={() => setExpanded(!expanded)}>
        <Typography variant="h4">
          Avg. {metric.column.displayName} for {metric.valueLabel} per round
        </Typography>
        <Typography variant="h3" className="metric-value">
          {metric.column.formatter(metric.value)}
        </Typography>
        <Typography variant="subtitle2">
          [{metric.column.formatter(metric.lowerBound)}, {metric.column.formatter(metric.upperBound)}]
        </Typography>
        {expanded && <Typography variant="subtitle2">{metric.roundCount} rounds</Typography>}
        <MetricChange metric={metric} />
        &nbsp;
        <Typography variant="body2" display="inline">
          vs {metric.compareValueLabel}:
        </Typography>
        &nbsp;
        <Typography variant="h5" display="inline">
          {metric.column.formatter(metric.compareValue)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {metric.significance}
        </Typography>
        {expanded && <SmallHistogram metric={metric} />}
      </CardActionArea>
    </Card>
  );
};

export default MetricCard;
