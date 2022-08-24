import {Box, Fade, Grid, IconButton} from '@mui/material';
import React, {useMemo} from 'react';
import {
  sumRechart,
  calculateMetricNew,
  calculateMetricNewRechart,
} from '../../lib/data/metrics';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  BaseData,
  MetricGroup,
  MetricValue,
  ReportComponent,
  ReportComponentStyle,
  ReportComponentType,
} from '../../lib/data/types';
import StackedBarChart from '../Chart/StackedBarChart';
import TimeChart, {TimeChartSeries} from '../Chart/TimeChart/TimeChart';
import ComponentControl from '../ComponentControl/ComponentControl';
import CloseIcon from '@mui/icons-material/Close';
import './ReportComponentBlock.scss';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
} from 'recharts';
import {valueColor} from '../../lib/color';
import ReplayIcon from '@mui/icons-material/Replay';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import {computeMetric} from '../../lib/data/metricsv2';

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
  isEditing,
}: {
  component: ReportComponent;
  baseData: BaseData | undefined;
  setComponent: (component: ReportComponent | null) => void;
  isEditing: boolean;
}) => {
  const [size, setSize] = React.useState<number>(5);
  const {type, style, metric} = component;

  const metricData: {[key: string]: number | string}[] = useMemo(
    () =>
      metric.values.length === 0 ||
      metric.groups.length === 0 ||
      baseData === undefined
        ? []
        : computeMetric(metric, baseData),
    [(JSON.stringify(metric), JSON.stringify(baseData))],
  );
  console.log('Metric:', metric, metricData);

  const isEmphasized = style === ReportComponentStyle.emphasized;

  const width = isEmphasized ? 300 : 600;
  const height = isEmphasized ? 100 : 400;

  const [menuOpen, setMenuOpen2] = React.useState<boolean>(false);
  const setMenuOpen = (open: boolean) => {
    if (open !== menuOpen) {
      console.log('setMenuOpen', open);
      setMenuOpen2(open);
    }
  };

  const menuItems = [
    <SettingsIcon
      key="settings"
      onClick={() =>
        setComponent({
          type: ReportComponentType.default,
          metric: component.metric,
          style: component.style,
        })
      }
    />,
    <ReplayIcon key="reload" />,
    <CopyAllIcon key="copy" />,
    <CloseIcon key="close" onClick={() => setComponent(null)} />,
  ];

  return (
    <Grid item xs={size}>
      <div className="component-block">
        <div
          className="editbutton"
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}>
          {menuItems.map((item, index) => (
            <Fade
              key={`${index}-menuitem`}
              in={menuOpen}
              timeout={100}
              style={{
                transitionDelay: `${index * 25}ms`,
              }}>
              <Box component="span">
                <IconButton>{item}</IconButton>
              </Box>
            </Fade>
          ))}
        </div>

        {type === ReportComponentType.default && (
          <ComponentControl
            component={component}
            setComponent={setComponent}
            setSize={setSize}
            size={size}
          />
        )}
        {type === ReportComponentType.barChart && (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              width={width}
              height={height}
              layout="vertical"
              data={metricData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 25,
              }}>
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <YAxis
                dataKey={`${MetricGroup[metric.groups[0]]}`}
                width={180}
                type="category">
                <Label
                  value={MetricGroup[metric.groups[0]]}
                  position="left"
                  offset={-30}
                />
              </YAxis>
              <XAxis type="number" dataKey={'value'}>
                <Label
                  value={MetricValue[metric.values[0]]}
                  position="bottom"
                />
              </XAxis>
              <Tooltip />
              {/* <Legend /> */}

              {metric.values.map((value, index) => (
                <Bar key={value} dataKey={`value`} fill={valueColor(value)} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Grid>
  );
};

export default ReportComponentBlock;
