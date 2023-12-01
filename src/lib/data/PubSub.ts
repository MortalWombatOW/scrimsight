import {DataNodeName} from './DataTypes';

class PubSub {
  private listeningNodes: {[source: DataNodeName]: DataNodeName[]} = {};
  private listeningFunctions: {[source: DataNodeName]: (() => void)[]} = {};
  private globalListeners: (() => void)[] = [];

  constructor(private onNotify: (source: DataNodeName) => void) {}

  // Subscribe to an event
  subscribe(source: DataNodeName, dest: DataNodeName): void {
    if (!this.listeningNodes[source]) {
      this.listeningNodes[source] = [];
    }
    if (this.listeningNodes[source].includes(dest)) {
      return;
    }
    this.listeningNodes[source].push(dest);
  }

  subscribeFn(source: DataNodeName, fn: () => void): void {
    if (!this.listeningFunctions[source]) {
      this.listeningFunctions[source] = [];
    }
    this.listeningFunctions[source].push(fn);
  }

  subscribeAll(fn: () => void): void {
    this.globalListeners.push(fn);
  }

  // Publish an event to all subscribers
  notify(source: DataNodeName): void {
    console.log(`${source} done, running subscribers`);
    this.globalListeners.forEach((fn) => {
      fn();
    });

    this.listeningNodes[source]?.forEach((dest) => {
      this.onNotify(dest);
    });

    this.listeningFunctions[source]?.forEach((fn) => {
      fn();
    });
  }
}

export default PubSub;
