import {Autocomplete, Grid, TextField} from '@mui/material';
import React, {useEffect, useMemo, useState} from 'react';
import {getGroupsForMetric, getMetricValues} from '../../lib/data/metrics';
import {
  Metric,
  MetricFilter,
  MetricGroup,
  MetricValue,
} from '../../lib/data/types';

type MetricSelectProps = {
  onSelect: (metric: Metric) => void;
};

const buildMetric = (
  values: MetricValue[],
  groups: MetricGroup[],
  filters: MetricFilter[],
): Metric => ({
  values,
  groups,
  filters,
});

const MetricSelect = (props: MetricSelectProps) => {
  const {onSelect} = props;
  const metricValues = getMetricValues();

  const [values, setValues] = useState<MetricValue[]>([]);
  const [groups, setGroups] = useState<MetricGroup[]>([]);
  const [filters, setFilters] = useState<MetricFilter[]>([]);

  const commonGroups = useMemo(() => {
    if (values.length === 0) {
      return [];
    }

    // return groups shared by all values
    return values.reduce((acc, value) => {
      const groups = getGroupsForMetric(value);
      return acc.filter((g) => groups.includes(g));
    }, getGroupsForMetric(values[0]));
  }, [values]);

  const hasPossibleGroups = commonGroups.length > 0;

  useEffect(() => {
    if (values.length > 0 && groups.length > 0) {
      const metric = buildMetric(values, groups, filters);
      console.log(metric);
      onSelect(metric);
    }
  }, [values, groups, onSelect]);

  return (
    <div className="MetricSelect">
      <Grid container spacing={2}>
        <Grid item>
          <Autocomplete
            disablePortal
            multiple
            options={metricValues}
            sx={{width: 400}}
            renderInput={(params) => (
              <TextField {...params} label="Metric" variant="standard" />
            )}
            onChange={(event, values) => {
              setValues(values as MetricValue[]);
            }}
          />
        </Grid>
        {hasPossibleGroups && <Grid item>group by</Grid>}

        {hasPossibleGroups && (
          <Grid item>
            <Autocomplete
              disablePortal
              multiple
              options={commonGroups}
              sx={{width: 300}}
              renderInput={(params) => (
                <TextField {...params} label="group" variant="standard" />
              )}
              onChange={(event, values) => {
                setGroups(values as MetricGroup[]);
              }}
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default MetricSelect;
