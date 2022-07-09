import {Autocomplete, Grid, TextField} from '@mui/material';
import React, {useEffect, useMemo, useState} from 'react';
import {getGroupsForMetric, getMetricValues} from '../../lib/data/metrics';
import {Metric, MetricGroup, MetricValue} from '../../lib/data/types';
import {getMetricValueName} from './../../lib/data/metrics';

type MetricSelectProps = {
  metric: Metric | undefined;
  onSelect: (metric: Metric) => void;
  width: number;
};

const buildMetric = (values: MetricValue[], groups: MetricGroup[]): Metric => ({
  values,
  groups,
});

const MetricSelect = (props: MetricSelectProps) => {
  const {onSelect, metric} = props;
  const metricValues = getMetricValues().map(getMetricValueName);

  const [values, setValues] = useState<MetricValue[]>(metric?.values ?? []);
  const [groups, setGroups] = useState<MetricGroup[]>(metric?.groups ?? []);

  const commonGroups = useMemo(() => {
    if (values.length === 0) {
      return [];
    }

    // return groups shared by all values
    return values
      .reduce((acc, value) => {
        const groups = getGroupsForMetric(value);
        return acc.filter((g) => groups.includes(g));
      }, getGroupsForMetric(values[0]))
      .map((g) => MetricGroup[g]);
  }, [values]);

  const hasPossibleGroups = commonGroups.length > 0;

  useEffect(() => {
    if (values.length > 0 && groups.length > 0) {
      const metric = buildMetric(values, groups);
      console.log(metric);
      onSelect(metric);
    }
  }, [values, groups, onSelect]);

  console.log(props.width, 'MetricSelect');

  return (
    <div className="MetricSelect">
      {/* <Grid container spacing={2}>
        <Grid item> */}
      <Autocomplete
        disablePortal
        multiple
        options={metricValues}
        value={values.map((v) => getMetricValueName(v))}
        size="medium"
        renderInput={(params) => (
          <TextField {...params} label="Metric" variant="standard" />
        )}
        onChange={(event, values) => {
          setValues(values.map((v) => MetricValue[v]) as MetricValue[]);
        }}
      />
      {/* </Grid> */}
      {hasPossibleGroups && <Grid item>group by</Grid>}

      {hasPossibleGroups && (
        // <Grid item>
        <Autocomplete
          disablePortal
          multiple
          value={groups.map((g) => MetricGroup[g])}
          options={commonGroups}
          // sx={{width: `${props.width}px`}}
          renderInput={(params) => (
            <TextField {...params} label="group" variant="standard" />
          )}
          onChange={(event, values) => {
            setGroups(values.map((g) => MetricGroup[g]));
          }}
        />
        // </Grid>
      )}
      {/* </Grid> */}
    </div>
  );
};

export default MetricSelect;
