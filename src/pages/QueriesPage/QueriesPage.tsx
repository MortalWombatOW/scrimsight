import React from 'react';
import QueryGraph from './QueryGraph';
import useWindowSize from '../../hooks/useWindowSize';

const QueriesPage = () => {
  const size = useWindowSize();
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null);

  return (
    <div>
      <QueryGraph
        width={size.width}
        height={size.height - 87}
        setSelectedNode={setSelectedNode}
      />
    </div>
  );
};

export default QueriesPage;
