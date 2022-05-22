import React, {FC, useMemo} from 'react';
import Header from '../../components/Header/Header';
import MetricDisplay from '../../components/MetricDisplay/MetricDisplay';
import useData from '../../hooks/useData';
import {calculateMetric, calculateMetricNew} from '../../lib/data/metrics';
import {decodeReport} from '../../lib/data/report';
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

// const componentMap: Record<string, MetricComponent> = {
//   'default': MetricDisplay,
// };

const ReportPage = () => {
  const [title, setTitle] = useQueryParam('t', StringParam);
  // controls
  const [players, setPlayers] = useQueryParam('p', ArrayParam);
  const [mapIds, setMapIds] = useQueryParam('m', NumericArrayParam);
  // view is a component + metric pair encoded as {component type}-{metric values seperated by commas}-{metric groups separated by commas}
  // e.g. 4-3,4,5-2,3
  const [componentStrings, setComponentStrings] = useQueryParam(
    'c',
    ArrayParam,
  );

  const [maps, mapsUpdates] = useData<OWMap>('map');
  const [interactions, updates] =
    useData<PlayerInteraction>('player_interaction');
  const [statuses, statusUpdates] = useData<PlayerStatus>('player_status');
  const [abilities, abilityUpdates] = useData<PlayerAbility>('player_ability');

  const components: ReportComponent[] = useMemo(() => {
    if (!componentStrings) {
      return [];
    }
    return componentStrings.map((componentString) => {
      const [componentType, metricValuesStr, metricGroupsStr] =
        componentString!.split('-');
      const metricValues: MetricValue[] = metricValuesStr
        .split(',')
        .map((v) => parseInt(v, 10));
      const metricGroups: MetricGroup[] = metricGroupsStr
        .split(',')
        .map((v) => parseInt(v, 10));
      return {
        type: parseInt(componentType, 10) as ReportComponentType,
        metric: {
          values: metricValues,
          groups: metricGroups,
        },
      };
    });
  }, [componentStrings]);

  if (!interactions || !maps || !statuses || !abilities || maps.length === 0) {
    return <div>Loading...</div>;
  }

  const baseData: BaseData = {
    maps,
    interactions,
    statuses,
    abilities,
  };

  console.log('ReportPage:', title, players, mapIds, components);

  // const metricGroups = report.metricGroups.map((group) => {
  //   const {metric} = group;
  //   const metricData = calculateMetricNew(metric, baseData);
  //   console.log(metricData);
  // });

  return (
    <div className="ReportPage">
      <Header refreshCallback={undefined} />
      <div className="container">
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default ReportPage;
