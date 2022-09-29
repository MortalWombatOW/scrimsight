import React, {FC, useMemo, useState} from 'react';
import Header from '../../components/Header/Header';
import MetricDisplay from '../../components/MetricDisplay/MetricDisplay';
import useData from '../../hooks/useData';
import {calculateMetric, calculateMetricNew} from '../../lib/data/metrics';
import {decodeReport} from '../../lib/data/report';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  BaseData,
  MetricComponent,
  MetricGroup,
  MetricValue,
  OWMap,
  PlayerAbility,
  PlayerInteraction,
  PlayerStatus,
  ReportComponent,
  ReportComponentStyle,
  ReportComponentType,
} from '../../lib/data/types';
import {
  useQueryParam,
  NumberParam,
  StringParam,
  ArrayParam,
  NumericArrayParam,
} from 'use-query-params';
import './ReportPage.scss';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import PlayerSelector from '../../components/PlayerSelector/PlayerSelector';
import IconAndText from '../../components/Common/IconAndText';
import MapSelector from '../../components/MapSelector/MapSelector';
import ReportComponentBlock from '../../components/Report/ReportComponentBlock';
import {isStringLiteral} from 'typescript';

// const componentMap: Record<string, MetricComponent> = {
//   'default': MetricDisplay,
// };

function parseRawQueryParam<T extends string | number>(
  raw: (T | null)[] | null | undefined,
) {
  if (!raw) {
    return [];
  }
  return raw.filter(
    (p) =>
      p !== undefined &&
      p !== null &&
      (typeof p === 'string' || !isNaN(p as number)),
  ) as T[];
}

const componentToString = (component: ReportComponent) =>
  [
    component.type,
    component.style,
    component.metric.values.join('l'),
    component.metric.groups.join('l'),
  ].join('-');

const stringToComponent = (str: string) => {
  const [type, style, values, groups] = str.split('-');
  if (
    !type ||
    !style ||
    !values ||
    !groups ||
    !values.length ||
    !groups.length
  ) {
    console.error('Invalid component string:', str);
  }

  console.log('stringToComponent', type, style, values, groups);
  return {
    type: parseInt(type, 10) as ReportComponentType,
    style: parseInt(style, 10) as ReportComponentStyle,
    metric: {
      values: parseRawQueryParam(
        values.split('l').map((v) => parseInt(v, 10)),
      ) as MetricValue[],
      groups: parseRawQueryParam(
        groups.split('l').map((g) => parseInt(g, 10)),
      ) as MetricGroup[],
    },
  };
};

const ReportPage = () => {
  // controls
  const [playersRaw, setPlayers] = useQueryParam('p', ArrayParam);
  const [mapIdsRaw, setMapIds] = useQueryParam('m', NumericArrayParam);
  // view is a component + metric pair encoded as {component type}-{metric values seperated by commas}-{metric groups separated by commas}
  // e.g. 4-3,4,5-2,3
  const [componentStringsRaw, setComponentStrings] = useQueryParam(
    'c',
    ArrayParam,
  );

  const [isEditing, setIsEditing] = useState(false);

  const componentsEqual = (a: ReportComponent, b: ReportComponent) =>
    a.type === b.type &&
    a.style === b.style &&
    a.metric.values.join(',') === b.metric.values.join(',') &&
    a.metric.groups.join(',') === b.metric.groups.join(',');

  const updateComponent = (
    oldComponent: ReportComponent,
    newComponent: ReportComponent | null,
  ) => {
    const newComponents = [...components];
    const index = newComponents.findIndex((c) =>
      componentsEqual(c, oldComponent),
    );
    if (index === -1) {
      console.error('Could not find component to update');
      return;
    }

    if (newComponent) {
      newComponents[index] = newComponent;
    } else {
      newComponents.splice(index, 1);
    }
    setComponentStringsFromComponents(newComponents);
  };

  const setComponentStringsFromComponents = (components: ReportComponent[]) => {
    setComponentStrings(components.map(componentToString));
  };

  const addBlankComponent = () => {
    const newComponent = {type: 0, style: 0, metric: {values: [], groups: []}};
    if (!componentStringsRaw) {
      setComponentStringsFromComponents([newComponent]);
    } else {
      setComponentStringsFromComponents([...components, newComponent]);
    }
  };

  // clean up query params in case they are malformed
  const players = useMemo(() => parseRawQueryParam(playersRaw), [playersRaw]);
  const mapIds = useMemo(
    () => parseRawQueryParam(mapIdsRaw) ?? [],
    [mapIdsRaw],
  );
  const componentStrings = useMemo(
    () => parseRawQueryParam(componentStringsRaw),
    [componentStringsRaw],
  );

  console.log('componentStrings', componentStrings);
  console.log('componentStringsRaw', componentStringsRaw);

  const [maps, mapsUpdates] = useData<OWMap>('map');
  const [interactions, updates] =
    useData<PlayerInteraction>('player_interaction');
  const [statuses, statusUpdates] = useData<PlayerStatus>('player_status');
  const [abilities, abilityUpdates] = useData<PlayerAbility>('player_ability');
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const components: ReportComponent[] = useMemo(() => {
    if (!componentStrings) {
      return [];
    }
    return componentStrings.map(stringToComponent);
  }, [componentStrings, mapsUpdates, updates, statusUpdates, abilityUpdates]);

  const topLineComponents: ReportComponent[] = useMemo(() => {
    if (!components) {
      return [];
    }
    return components.filter((c) => c.style === ReportComponentStyle.topLine);
  }, [components]);

  const emphasizedComponents: ReportComponent[] = useMemo(() => {
    if (!components) {
      return [];
    }
    return components.filter(
      (c) => c.style === ReportComponentStyle.emphasized,
    );
  }, [components]);

  const defaultComponents: ReportComponent[] = useMemo(() => {
    if (!components) {
      return [];
    }
    return components.filter((c) => c.style === ReportComponentStyle.default);
  }, [components]);

  const baseData: BaseData | undefined =
    maps && interactions && statuses && abilities
      ? {
          maps,
          interactions,
          statuses,
          abilities,
        }
      : undefined;

  // const metricGroups = report.metricGroups.map((group) => {
  //   const {metric} = group;
  //   const metricData = calculateMetricNew(metric, baseData);
  //   console.log(metricData);
  // });

  return (
    <div className="ReportPage">
      <Header
        refreshCallback={undefined}
        filters={filters}
        setFilters={setFilters}
      />

      <div className="toplinecontainer">
        <Grid container spacing={2} className="topLineComponents">
          {topLineComponents.map((component, i) => (
            <ReportComponentBlock
              key={componentToString(component)}
              baseData={baseData}
              component={component}
              filters={filters}
              setComponent={(c) => updateComponent(component, c)}
              isEditing={isEditing}
            />
          ))}
        </Grid>
      </div>
      <div className="emphasizedcontainer">
        <Grid container spacing={2} className="topLineComponents">
          {emphasizedComponents.map((component, i) => (
            <ReportComponentBlock
              key={componentToString(component)}
              baseData={baseData}
              component={component}
              filters={filters}
              setComponent={(c) => updateComponent(component, c)}
              isEditing={isEditing}
            />
          ))}
        </Grid>
      </div>
      <div className="container">
        {/* controls */}
        {/* <Grid container spacing={2}>
          <Grid item xs={2}>
            {/*control panel in left column
            <Stack spacing={0}>
              <Accordion disableGutters elevation={0} square>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  <IconAndText icon={<PeopleAltIcon />} text="Players" />
                </AccordionSummary>
                <AccordionDetails>
                  <PlayerSelector
                    data={baseData}
                    current={players}
                    setCurrent={setPlayers}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion disableGutters elevation={0} square>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header">
                  <IconAndText icon={<LocationOnIcon />} text="Maps" />
                </AccordionSummary>
                <AccordionDetails>
                  <MapSelector
                    data={baseData}
                    current={mapIds}
                    setCurrent={setMapIds}
                  />
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Grid> */}

        <Grid
          container
          spacing={2}
          sx={{
            marginTop: emphasizedComponents.length > 0 ? '100px' : '0',
          }}>
          {defaultComponents.map((component, i) => (
            <ReportComponentBlock
              key={componentToString(component)}
              baseData={baseData}
              filters={filters}
              component={component}
              setComponent={(c) => updateComponent(component, c)}
              isEditing={isEditing}
            />
          ))}
          <Grid item xs={3}>
            <Button onClick={addBlankComponent}>Add Component</Button>
          </Grid>
          {/* {componentStrings.map(componentStrToType).map((componentType) => {
              const component = components.find(
                (c) => c.type === componentType,
              );
              if (!component) {
                return null;
              }
              const {metric} = component;
              const metricData = calculateMetricNew(metric, baseData);
              return <MetricDisplay metric={metricData} />; */}
        </Grid>
        {/* </Grid> */}
      </div>
    </div>
  );
};

export default ReportPage;
