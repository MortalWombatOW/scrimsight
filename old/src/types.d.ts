declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}

declare module "*.html" {
  const value: string;
  export default value;
}

declare module 'tabulator-tables';