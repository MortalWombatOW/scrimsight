import ScrimsightWorker from "worker-loader!./worker";
import { StateProvider } from "./statemanager";
import { WorkerDirective } from "./util";

function onWorkerMessage(event:any) {
    console.log("Worker sent message");
    console.log(event.data);
}



export class WorkerManager {
    private static worker: ScrimsightWorker;

    static get(): ScrimsightWorker {
        if (!this.worker) {
            this.worker = new ScrimsightWorker();
            this.worker.onmessage = onWorkerMessage;
            console.log('initializing');
        }

        

        return this.worker;
    }

    static loadNode(path: string) {
        // todo verify task can be run
        const msg: WorkerDirective = {path: path, maphash: StateProvider.maphash};
        this.get().postMessage(msg);
    }
}