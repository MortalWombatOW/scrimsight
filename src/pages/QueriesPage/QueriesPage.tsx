import React from 'react';
import QueryGraph from './QueryGraph';
import useWindowSize from '../../hooks/useWindowSize';
import DisplayNode from './DisplayNode';
import {useDataManager} from '../../WombatDataFramework/DataContext';

const QueriesPage = () => {
  const size = useWindowSize();
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);
  const dataManager = useDataManager();

  return (
    <div>
      <QueryGraph
        width={size.width}
        height={selectedNode ? 500 : size.height - 87}
        setSelectedNode={setSelectedNode}
      />
      {selectedNode && (
        <DisplayNode node={dataManager.getNodeOrDie(selectedNode)} />
      )}
    </div>
  );
};

export default QueriesPage;
