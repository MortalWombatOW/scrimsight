import React, {useEffect, useMemo, useState} from 'react';

import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import {
  OWMap,
  PlayerStatus,
  PlayerAbility,
  PlayerInteraction,
  Dataset,
  Transform,
  Extractor,
  Metric,
  Column,
  Aggregation,
} from '../../lib/data/types';
import {join, makeAggregation} from '../../lib/data/data';
import {metricsMap, computeSimpleMetric} from '../../lib/data/metrics';
import {open} from 'idb-factory';
interface ReportBuilderProps {
  maps: OWMap[];
  status: PlayerStatus[];
  abilities: PlayerAbility[];
  interactions: PlayerInteraction[];
  dataCallback: (data: Dataset) => void;
  updateInd: number;
}

// const transforms: [string, Transform][] = [
//   [
//     // 'damage <- sum(amount) by player and timestamp',
//     makeAggregation(['player', 'timestamp'], 'amount', 'sum', 'damage'),
//   ],
// ];
const ReportBuilder = (props: ReportBuilderProps) => {
  const {maps, status, abilities, interactions, dataCallback, updateInd} =
    props;
  // console.log(maps, status, abilities, interactions);
  const [metricKeys, setMetricKeys] = useState<string[]>([]);

  const [sharedColumnState, setSharedColumnState] = useState<{
    [key: string]: boolean;
  }>({});
  const [metricMethods, setMetricMethods] = useState<{
    [key: string]: string;
  }>({});

  // const [aspects, setAspects] = useState<{[key: string]: string}>({});
  // const allAspects = Object.keys(aspects);
  const metrics = useMemo(() => {
    return metricKeys.map((key) => {
      return metricsMap[key];
    });
  }, [metricKeys]);

  const sharedColumns = useMemo(
    () =>
      metrics.length === 0
        ? []
        : metrics
            .map((metric) => metric.columns)
            .reduce((a, b) =>
              a.filter((c) => {
                // return true if c name and type is in b
                return b.some((d) => c.name === d.name && c.type === d.type);
              }),
            ),
    [metricKeys],
  );

  // map metric name to column name
  const uniqueColumns: {[key: string]: string} = useMemo(() => {
    const unique: {[key: string]: string} = {};
    metrics.forEach((metric) => {
      metric.columns.forEach((column) => {
        if (!sharedColumns.some((c) => c.name === column.name)) {
          unique[metric.displayName] = column.name;
        }
      });
    });
    return unique;
  }, [metricKeys]);

  // when metricKeys change, get the new metrics and set aspects to the shared columns
  useEffect(() => {
    // update sharedColumnState with sharedColumns
    const newSharedColumnState = {};
    sharedColumns.forEach((column) => {
      newSharedColumnState[column.name] = false;
    });
    setSharedColumnState((state) => ({...state, ...newSharedColumnState}));
    // log state
    // console.log(
    //   'metricKeys',
    //   metricKeys,
    //   'metrics',
    //   metrics,
    //   'sharedColumns',
    //   sharedColumns,
    // );
  }, [metricKeys]);

  useEffect(() => {
    const newMetricMethods = {};
    Object.values(uniqueColumns).forEach((column) => {
      newMetricMethods[column] = 'sum';
    });
    setMetricMethods((state) => ({...state, ...newMetricMethods}));
  }, [uniqueColumns]);

  // calculate aggregation for each metric then join datasets
  useEffect(() => {
    const newDatasets = metricKeys.map((metric) =>
      computeSimpleMetric(metric, maps, status, abilities, interactions),
    );
    const activeSharedColumns = Object.keys(sharedColumnState).filter(
      (key) => sharedColumnState[key],
    );

    if (newDatasets.length > 1) {
      const aggregations = metrics.map((metric): Aggregation => {
        return {
          by: activeSharedColumns,
          method: metricMethods[metric.displayName],
          col: uniqueColumns[metric.displayName],
        };
      });
      const aggregatedDatasets = newDatasets.map((dataset, i) => {
        const aggregation = makeAggregation(aggregations[i]);
        return aggregation(dataset);
      });

      const joinedDataset = join(aggregatedDatasets, activeSharedColumns);
      dataCallback(joinedDataset);
      console.log(
        'newDatasets',
        newDatasets,
        'aggregations',
        aggregations,
        'aggregatedDatasets',
        aggregatedDatasets,
        'joinedDataset',
        joinedDataset,
      );
    } else {
      dataCallback(newDatasets[0]);
    }
    // log all variables
  }, [
    metricKeys,
    JSON.stringify(sharedColumnState),
    JSON.stringify(metricMethods),
  ]);

  // when aspects change, compute the new metrics and join the data on the active aspects
  // useEffect(() => {
  //   const datasets = metricKeys.map((metric) => computeSimpleMetric(
  //       metric,
  //       maps,
  //       status,
  //       abilities,
  //       interactions,
  //     ));
  //     const joinedData = join(datasets, activeAspects);

  // console.log(dataset);
  console.log(`metrics: ${metrics}`);
  console.log(`metricKeys: ${metricKeys}`);
  return (
    <div className="ReportBuilder">
      <div className="ReportBuilder-metrics">
        <Autocomplete
          multiple
          id="metrics"
          options={Object.keys(metricsMap)}
          getOptionLabel={(option) => option}
          value={metricKeys}
          onChange={(event, newValue) => {
            setMetricKeys(newValue as string[]);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Metrics"
              placeholder="Metrics"
              variant="standard"
            />
          )}
        />
      </div>
      <div className="ReportBuilder-aspects">
        <FormGroup>
          {sharedColumns.map((column) => {
            return (
              <FormControlLabel
                key={column.name}
                control={
                  <Checkbox
                    checked={sharedColumnState[column.name] || false}
                    onChange={(event) => {
                      setSharedColumnState((state) => ({
                        ...state,
                        [column.name]: event.target.checked,
                      }));
                    }}
                    value={column.name}
                  />
                }
                label={column.name}
              />
            );
          })}
        </FormGroup>
        <FormGroup>
          {Object.values(uniqueColumns).map((column) => {
            return (
              <FormControlLabel
                key={column}
                control={
                  <Select
                    value={metricMethods[column]}
                    onChange={(event) => {
                      setMetricMethods((state) => ({
                        ...state,
                        [column]: event.target.value,
                      }));
                    }}>
                    <MenuItem value="sum">Sum</MenuItem>
                    <MenuItem value="avg">Average</MenuItem>
                    <MenuItem value="count">Count</MenuItem>
                  </Select>
                }
                label={column}
              />
            );
          })}
        </FormGroup>
      </div>
    </div>
  );
};

export default ReportBuilder;
