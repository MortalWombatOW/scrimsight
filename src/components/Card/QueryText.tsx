import React, {useMemo} from 'react';
import {Box, Card, Typography} from '@mui/material';
import './Card.scss';
import { Query} from '../../lib/data/types';
import useQueries from '../../hooks/useQueries';
import { DataRow } from '../../lib/data/logging/spec';

const QueryText = ({
  query,
  deps,
  parseResults,
  variant,
}: {
  query: Query;
  deps: any[];
  parseResults: (results: DataRow[]) => string | undefined;
  variant: 'h4' | 'h6' | 'body1';
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
    <Typography
      variant={variant}
      component="div"
      sx={{display: 'inline-block'}}
      // className={result === undefined ? 'blinkingcursor' : 'typingtext'}
    >
      {value}
    </Typography>
  );
};

export default QueryText;
