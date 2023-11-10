import React from 'react';

import {useDataManager} from '../../lib/data/DataContext';
import {
  DataNode,
  isTransformNode,
  isJoinNode,
  isObjectStoreNode,
  isWriteNode,
  getLatestExecution,
  DataNodeExecution,
} from '../../lib/data/types';

const DisplayNode = ({node}: {node: DataNode<any>}) => {
  const latestExecution = getLatestExecution(node);

  return (
    <div>
      <div>{node?.name}</div>
      <div>{node?.state}</div>
      <div>{latestExecution?.duration}</div>
      <div>
        {latestExecution?.inputRows} {latestExecution?.outputRows}
      </div>
      <div>{JSON.stringify(node.output)}</div>
    </div>
  );
};

export default DisplayNode;
