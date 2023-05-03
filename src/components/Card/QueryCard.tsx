import React, {useMemo} from 'react';
import {Card, Typography} from '@mui/material';
import './Card.scss';
import {Query} from '../../lib/data/types';
import useQueries from '../../hooks/useQueries';
import {format} from '../../lib/data/format';
import { DataRow } from '../../lib/data/logging/spec';

const QueryCard = ({
  title,
  query,
  deps,
  parseResults,
  emphasisLevel,
}: {
  title: string;
  query: Query;
  deps: any[];
  parseResults: (results: object[]) => number | string;
  emphasisLevel: 'low' | 'medium' | 'high';
}) => {
  const [results, tick] = useQueries([query], deps);
  const result = results[query.name];

  const value = useMemo(() => {
    if (result === undefined) {
      return undefined;
    }
    return parseResults(result);
  }, [result, parseResults]);

  return (
    <Card className="MetricCard" variant="outlined">
      <Typography
        variant={emphasisLevel === 'high' ? 'h4' : 'h6'}
        component="div"
        sx={{display: 'inline-block'}}
        // className={result === undefined ? 'blinkingcursor' : 'typingtext'}
      >
        {format(value)}
      </Typography>
      <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
        {title}
      </Typography>
    </Card>
  );
};

export default QueryCard;
