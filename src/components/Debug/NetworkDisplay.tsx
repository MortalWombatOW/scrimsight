import {DataSet} from 'vis-data/esnext';
import {Edge, Network, Node} from 'vis-network/esnext';
import 'vis-network/styles/vis-network.css';
import {stringHash} from '../../lib/string';

class NetworkDisplay {
  private nodes: DataSet<Node, 'id'>;
  private edges: DataSet<Edge, 'id'>;
  private network: Network | null = null;

  constructor() {
    this.nodes = new DataSet([]);
    this.edges = new DataSet([]);
  }

  public initialize(container: HTMLElement) {
    const options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      locale: 'en',
      layout: {
        hierarchical: {
          enabled: true,
          direction: 'UD',
          sortMethod: 'directed',
        },
      },
      physics: {
        barnesHut: {
          avoidOverlap: 1,
        },
      },
      edges: {
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.5,
          },
        },
      },
    };
    this.network = new Network(
      container,
      {nodes: this.nodes, edges: this.edges},
      options,
    );
  }

  private nodeIdFromName(name: string) {
    const node = this.nodes.get().find((n) => n.id === stringHash(name));
    if (!node) return undefined;
    return node.id;
  }

  public setNode(
    name: string,
    stateColor: string,
    shape: string,
    label: string,
    opacity: number,
  ) {
    const existingNodeId = this.nodeIdFromName(name);
    if (existingNodeId !== undefined) {
      this.nodes.update({
        id: existingNodeId,
        color: {background: stateColor},
        shape: shape,
        label: label,
        opacity: opacity,
      });
      return;
    }
    this.nodes.add({
      id: stringHash(name),
      label: label,
      color: {background: stateColor},
      shape: shape,
      opacity: opacity,
    });
  }

  public setEdge(fromName: string, toName: string) {
    const fromId = this.nodeIdFromName(fromName);
    const toId = this.nodeIdFromName(toName);

    console.log(
      `Adding edge from ${fromName} to ${toName} (${fromId} to ${toId})`,
    );

    if (fromId === undefined || toId === undefined) {
      return;
    }

    const existingEdge =
      this.edges.get().find((e) => e.from === fromId && e.to === toId) !==
      undefined;

    if (existingEdge) return;

    this.edges.add({from: fromId, to: toId});
  }
}

export default NetworkDisplay;
