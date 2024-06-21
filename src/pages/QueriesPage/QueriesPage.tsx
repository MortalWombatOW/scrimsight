import React from 'react';
import QueryGraph from './QueryGraph';
import useWindowSize from '../../hooks/useWindowSize';
import DisplayNode from './DisplayNode';
import {useDataManager} from '../../WombatDataFramework/DataContext';
import {Card, CardContent} from '@mui/material';
import QueryBuilder from './QueryBuilder/QueryBuilder';
const QueriesPage = () => {
  const size = useWindowSize();
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  const [tick, setTick] = React.useState<number>(0); // eslint-disable-line no-unused-vars
  const dataManager = useDataManager([
    'QueriesPage',
    () => {
      setTick((tick) => tick + 1);
    },
  ]);

  console.log('Size', size.width, size.height);

  return (
    <div>
      <QueryGraph width={size.width || 1000} height={500} selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
      <Card>
        <CardContent>{selectedNode ? <DisplayNode node={dataManager.getNodeOrDie(selectedNode)} /> : <QueryBuilder />}</CardContent>
      </Card>
    </div>
  );
};

export default QueriesPage;
