import { canLoadNode, loadNode, MapInfo } from "./data/data";
import log from "./logger";
import { Storage, StorageCrate } from "./storage";
import {getTask, Task, TaskType,} from './task';
import { WorkerDirective } from "./util";

const ctx: Worker = self as any;


// main
ctx.addEventListener("message", (event) => {
  const data: WorkerDirective = event.data;

  // if (data.type == "task") {
  //     // const task = getTask(data.content as TaskType);
  //     const map = Storage.withDb().then(s => 
  //       s.getAllMaps(log))
  // }

  Storage.withDb().then((s) =>
    s.getMap(data.maphash, (map: MapInfo) => {
      if(canLoadNode(map, data.path)) {
        loadNode(map, data.path);
        console.log(map)
        s.set(map);
      }
    })
  );

  console.log("(worker) message recieved: " + JSON.stringify(data));
  ctx.postMessage("fdsfds");
});
