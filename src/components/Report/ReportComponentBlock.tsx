import {Grid, IconButton} from '@mui/material';
import React, {useMemo} from 'react';
import {calculateMetricNew} from '../../lib/data/metrics';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  BaseData,
  ReportComponent,
  ReportComponentType,
} from '../../lib/data/types';
import StackedBarChart from '../Chart/StackedBarChart';
import TimeChart, {TimeChartSeries} from '../Chart/TimeChart/TimeChart';
import ComponentControl from '../ComponentControl/ComponentControl';

const componentStrToType: (str: string) => ReportComponentType = (str) => {
  const [lStr, rStr] = str.split('-');
  const l = parseInt(lStr, 10);
  const r = parseInt(rStr, 10);
  const componentType: ReportComponentType = l;
  return componentType;
};

const ReportComponentBlock = ({
  component,
  baseData,
  setComponent,
}: {
  component: ReportComponent;
  baseData: BaseData | undefined;
  setComponent: (component: ReportComponent | null) => void;
}) => {
  const [size, setSize] = React.useState<number>(3);
  const {type, metric} = component;

  const metricData = useMemo(
    () =>
      metric.values.length === 0 || metric.groups.length === 0
        ? {}
        : calculateMetricNew(metric, baseData),
    [JSON.stringify(metric), JSON.stringify(baseData)],
  );
  console.log('Metric:', metric, metricData);
  const timeData: TimeChartSeries[] = Object.keys(metricData).map((group1) => {
    return {
      label: group1,
      data: Object.keys(metricData[group1]).map((time) => {
        return {
          time: parseInt(time),
          val: Object.keys(metricData[group1][time]).reduce(
            (acc, group2) => acc + (metricData[group1][time][group2] as number),
            0,
          ),
        };
      }),

      clazz: '',
    };
  });
  return (
    <Grid item xs={size}>
      <div
        style={{
          borderRadius: '4px',
          border: '1px solid #ccc',
          // boxShadow: '0px 0px 4px #ccc',
          padding: 5,
        }}>
        <IconButton
          component="span"
          style={{
            float: 'right',
          }}
          onClick={() =>
            setComponent({
              type: ReportComponentType.default,
              metric: component.metric,
            })
          }>
          <SettingsIcon />
        </IconButton>
        {type === ReportComponentType.default && (
          <ComponentControl
            component={component}
            setComponent={setComponent}
            setSize={setSize}
            size={size}
          />
        )}
        {type === ReportComponentType.chart && (
          <StackedBarChart data={metricData} barHeight={30} />
        )}
      </div>
    </Grid>
  );
};

export default ReportComponentBlock;
