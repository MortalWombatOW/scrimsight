import {Box, CircularProgress, Fade, Grid, IconButton} from '@mui/material';
import React, {useEffect, useMemo} from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  BaseData,
  MetricGroup,
  ReportComponent,
  ReportComponentStyle,
  ReportComponentType,
} from '../../lib/data/types';
import ComponentControl from '../ComponentControl/ComponentControl';
import CloseIcon from '@mui/icons-material/Close';
import './ReportComponentBlock.scss';
import ReplayIcon from '@mui/icons-material/Replay';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import {computeMetric} from '../../lib/data/metricsv2';
import BarChartComponent from '../Component/BarChartComponent';
import TimeChartComponent from '../Component/TimeChartComponent';
// const componentStrToType: (str: string) => ReportComponentType = (str) => {
//   const [lStr, rStr] = str.split('-');
//   const l = parseInt(lStr, 10);
//   const r = parseInt(rStr, 10);
//   const componentType: ReportComponentType = l;
//   return componentType;
// };

const ReportComponentBlock = ({
  component,
  baseData,
  setComponent,
}: {
  component: ReportComponent;
  baseData: BaseData | undefined;
  setComponent: (component: ReportComponent | null) => void;
  isEditing: boolean;
  filters: {[key: string]: string[]};
}) => {
  const [size, setSize] = React.useState<number>(5);
  const [sortBy, setSortBy] = React.useState<string>(
    MetricGroup[component.metric.groups[0]],
  );
  const {type, style, metric} = component;

  const [metricData, setMetricData] = React.useState<
    {[key: string]: number | string}[]
  >([]);

  useEffect(
    () =>
      setMetricData(
        component.type === ReportComponentType.default ||
          metric.values.length === 0 ||
          metric.groups.length === 0 ||
          baseData === undefined
          ? []
          : computeMetric(metric, baseData),
      ),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [(JSON.stringify(metric), baseData == undefined)],
  );

  const sortedData = useMemo(
    () =>
      [...metricData].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (typeof aValue === 'string') {
          return (bValue as string).localeCompare(aValue as string);
        }
        return (bValue as number) - (aValue as number);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortBy, metricData.length],
  );

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
    // sortBy === 'label' ? (
    //   <SortByAlphaIcon key="sortByLabel" onClick={() => setSortBy('value')} />
    // ) : (
    //   <SignalCellularAltIcon
    //     key="sortByValue"
    //     onClick={() => setSortBy('label')}
    //   />
    // ),
    <ReplayIcon key="reload" />,
    <CopyAllIcon key="copy" />,
    <CloseIcon key="close" onClick={() => setComponent(null)} />,
  ];

  // const uniqueGroupCount = new Set(
  //   sortedData.map((d) => d[MetricGroup[metric.groups[0]]]),
  // ).size;
  // const uniqueGroupCount = sortedData.length;
  // const colorPalette = getColorPaletteOfSize(uniqueGroupCount);
  console.log('sortedData', sortedData);

  return (
    <Grid
      item
      style={{
        width: `${width}px`,
      }}>
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
        {sortedData.length === 0 && type !== ReportComponentType.default ? (
          <div
            style={{
              position: 'relative',
              top: height / 2,
              left: width / 2,
              width: 0,
              height: 0,
            }}>
            <CircularProgress />
          </div>
        ) : null}

        {type === ReportComponentType.default && (
          <ComponentControl
            component={component}
            setComponent={setComponent}
            setSize={setSize}
            size={size}
          />
        )}
        {type === ReportComponentType.barChart && (
          <BarChartComponent
            width={width}
            height={height}
            data={sortedData}
            metric={metric}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        )}
        {type === ReportComponentType.timeChart && (
          <TimeChartComponent
            width={width}
            height={height}
            data={sortedData}
            metric={metric}
          />
        )}
      </div>
    </Grid>
  );
};

export default ReportComponentBlock;
