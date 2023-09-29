import React, {useContext, useEffect, useRef} from 'react';
import {DataSet} from 'vis-data/esnext';
import {Edge, Network, Node} from 'vis-network/esnext';
import 'vis-network/styles/vis-network.css';
import {QueryManagerContext} from '../../lib/data/QueryManagerContext';

// interface NodeData {
//   id: number;
//   label: string;
//   color: {
//     background: string;
//   };
// }

const DebugQueries = () => {
  const ref = useRef(null);
  const [tick, setTick] = React.useState(0);
  const queryManager = useContext(QueryManagerContext);

  // never change the object reference, only mutate the object
  const [nodes] = React.useState<DataSet<Node, 'id'>>(new DataSet([]));
  const [edges] = React.useState<DataSet<Edge, 'id'>>(new DataSet([]));

  const nodeIdFromName = (name: string) => {
    // iterate over all nodes and find the one with the matching name. return the id
    return nodes.get().find((n) => n.label === name)?.id!;
  };

  useEffect(() => {
    // const queryNames = Object.keys(ResultCache.getBuildGraph());
    // const nodes = new DataSet(
    //   queryNames.map((name, i) => ({
    //     id: i,
    //     label: name,
    //     color: {
    //       background: ResultCache.hasResults(name) ? 'green' : 'red',
    //     },
    //   })),
    // );

    // const nodeIdForName = (name: string) => {
    //   // return the id from the nodes list where the label is name. if not, return a new id that's the length of the nodes list
    //   const node = nodes.get().find((n) => n.label === name);
    //   if (node) {
    //     return node.id;
    //   }
    //   return nodes.length;
    // };

    queryManager.registerGlobalListener(() => {
      // console.log('debug global listener');
      setTick((tick) => tick + 1);
    });

    // const edges = new DataSet(
    //   Object.entries(ResultCache.getBuildGraph()).flatMap(([name, deps], i) =>
    //     deps.map((dep) => ({
    //       from: i,
    //       to: nodeIdForName(dep.name),
    //     })),
    //   ) as Edge[],
    // );

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
    const network = new Network(container, data, options);
  }, []);

  // updates
  useEffect(() => {
    console.log('tick', tick);
    const queryNames = queryManager.getAllQueryNames();

    // add nodes for queries that aren't in the graph yet
    const newNodes = queryNames.filter(
      (name) => !nodes.get().find((n) => n.label === name),
    );
    nodes.add(
      newNodes.map((name, i) => ({
        id: nodes.length + i,
        label: name,
        color: {
          background: queryManager.hasResults(name) ? '#3c912b' : '#af684c',
        },
      })),
    );

    // add edges for queries that aren't in the graph yet

    const newEdges = queryManager.getAllEdges().filter(
            ([name, depName]) =>
              !edges.get().find((e) => e.to === nodeIdFromName(depName)),
          )
          .map(([name, depName]) => ({
            from: nodeIdFromName(name),
            to: nodeIdFromName(depName),
          });
    edges.add(newEdges as Edge[]);

    // update colors for nodes that are in the graph
    queryNames.forEach((name) => {
      const node = nodes.get(nodeIdFromName(name))!;
      node.color = {
        background: queryManager.hasResults(name) ? '#3c912b' : '#af684c',
      };

      nodes.update(node);
    });
  }, [tick]);

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
