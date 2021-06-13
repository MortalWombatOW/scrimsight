import ScrimsightWorker from "worker-loader!./worker";
import { StateProvider } from "./statemanager";
import { getTask, Task, TaskType } from "./task";

function onWorkerMessage(event:any) {
    console.log("Worker sent message");
    console.log(event.data);
}

export class WorkerManager {
    private static worker: ScrimsightWorker;

    static get(): ScrimsightWorker {
        if (!this.worker) {
            this.worker = new ScrimsightWorker();
        }

        this.worker.onmessage = (event: any) => {
            console.log(event.data);
            // console.log(storage.getCratesOfType(CrateType.Log));
            // document.getElementById("primes").innerHTML = event.data.primes;
          };

        return this.worker;
    }

    static runTask(taskType: TaskType) {
        // todo verify task can be run
        const task: Task = getTask(taskType);
        this.get().postMessage({taskType, maphash: StateProvider.maphash})
    }
}