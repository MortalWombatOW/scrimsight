import React, {useContext, useEffect, useState} from 'react';

import {DataNode} from './DataTypes';
import {DataContext} from './DataContext';
import {useDataNodes} from '../hooks/useData';

// const useNodeChainOutput = <T>(nodes: DataNode<any>[]): T[] | undefined => {
//   const dataManager = useContext(DataContext);

//   const [tick, setTick] = useState(0);

//   if (!dataManager) {
//     throw new Error('useDataNode must be used within a GraphProvider');
//   }

//   useEffect(() => {
//     nodes.forEach((node) => {
//       dataManager.addNode(node);
//     });
//   }, [nodes, dataManager]);

//   useEffect(() => {
//     dataManager.process();
//   }, [dataManager]);

//   dataManager.addNodeCallback(nodes[nodes.length - 1].getName(), () => {
//     setTick((tick) => tick + 1);
//   });

// //   return nodes[nodes.length - 1].getOutput();
// // };

// function makeDataComponent(
//   dataNodes: DataNode<any>[],
//   render: (data: T[]) => JSX.Element,
// ): () => JSX.Element {
//   const data = useDataNodes(dataNodes);

//   if (!data) {
//     return () => {
//       const div = document.createElement('div');
//       div.innerText = 'Loading...';
//       return (div as unknown) as JSX.Element;
//     };
//   }

//   return () => render(data);
// }

// export default makeDataComponent;
