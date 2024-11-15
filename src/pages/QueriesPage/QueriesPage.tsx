import React from 'react';
import QueryGraph from './QueryGraph';
import useWindowSize from '../../hooks/useWindowSize';
import DisplayNode from './DisplayNode';
import { useDataManager } from '../../WombatDataFramework/DataContext';
import { Card, CardContent } from '@mui/material';
const QueriesPage = () => {
  const size = useWindowSize();
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  const dataManager = useDataManager();

  console.log('Size', size.width, size.height);

  return (
    <div>
      <QueryGraph width={size.width || 1000} height={500} selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
      {selectedNode && (
        <Card>
          <CardContent>
            <DisplayNode node={dataManager.getNodeOrDie(selectedNode)} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QueriesPage;
