import React, {useContext, useEffect, useRef} from 'react';
import {DataSet} from 'vis-data/esnext';
import {Edge, Network, Node} from 'vis-network/esnext';
import 'vis-network/styles/vis-network.css';
import {DataContext} from '../../lib/data/DataContext';
import {DataNode} from '../../lib/data/types';

// interface NodeData {
//   id: number;
//   label: string;
//   color: {
//     background: string;
//   };
// }

function getStateColor(node: DataNode<any> | undefined) {
  if (!node) {
    return '#000000';
  }
  const state = node.state;
  switch (state) {
    case 'pending':
      return '#f0ad4e';
    case 'running':
      return '#5bc0de';
    case 'done':
      return '#3c912b';
    case 'error':
      return '#af684c';
    default:
      return '#000000';
  }
}

const DebugQueries = () => {
  const ref = useRef(null);
  const dataManager = useContext(DataContext);

  // never change the object reference, only mutate the object
  const [nodes] = React.useState<DataSet<Node, 'id'>>(new DataSet([]));
  const [edges] = React.useState<DataSet<Edge, 'id'>>(new DataSet([]));

  const nodeIdFromName = (name: string) => {
    // iterate over all nodes and find the one with the matching name. return the id
    return nodes.get().find((n) => n.label === name)?.id!;
  };

  useEffect(() => {
    const container = ref.current;
    const data = {
      nodes: nodes,
      edges: edges,
    };
    const options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      locale: 'en',
      // layout: {
      //   hierarchical: {
      //     enabled: true,
      //     direction: 'UD',
      //     sortMethod: 'directed',
      //   },
      // },
      // physics: {
      //   barnesHut: {
      //     avoidOverlap: 1,
      //   },
      // },
      edges: {
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.5,
          },
        },
      },
    };
    if (container === null) {
      return;
    }
    new Network(container, data, options);
  }, []);

  // updates
  useEffect(() => {
    if (dataManager === null) {
      return;
    }
    console.log('updating graph');
    const queryNames = dataManager.getNodeNames() ?? [];

    // add nodes for queries that aren't in the graph yet
    const newNodes = queryNames.filter(
      (name) => !nodes.get().find((n) => n.label === name),
    );
    nodes.add(
      newNodes.map((name, i) => ({
        id: nodes.length + i,
        label: name,
        color: {
          background: getStateColor(dataManager.getNode(name)),
        },
      })),
    );

    // add edges for queries that aren't in the graph yet

    const newEdges = dataManager
      .getEdges()
      .filter(
        ([name, depName]) =>
          !edges.get().find((e) => e.to === nodeIdFromName(depName)),
      )
      .map(([name, depName]) => ({
        from: nodeIdFromName(name),
        to: nodeIdFromName(depName),
      }));
    edges.add(newEdges as Edge[]);

    // update colors for nodes that are in the graph
    queryNames.forEach((name) => {
      const node = nodes.get(nodeIdFromName(name))!;
      node.color = {
        background: getStateColor(dataManager.getNode(name)),
      };
      nodes.update(node);
    });
  }, [dataManager]);

  return (
    <div>
      <div
        ref={ref}
        style={{
          height: 500,
          border: '1px solid lightgray',
        }}></div>
    </div>
  );
};

export default DebugQueries;
