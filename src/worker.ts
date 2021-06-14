import { loadData, MapInfo } from "./data/data";
import log from "./logger";
import { Storage, StorageCrate } from "./storage";
import {getTask, Task, TaskType,} from './task';

const ctx: Worker = self as any;

log("setting up");

// main
ctx.addEventListener("message", (event) => {
  const data = event.data;
  log(data);

  // if (data.type == "task") {
  //     // const task = getTask(data.content as TaskType);
  //     const map = Storage.withDb().then(s => 
  //       s.getAllMaps(log))
  // }

  Storage.withDb().then((s) =>
    s.getAllMaps((request) => {
      const maps: Array<MapInfo> = request.target.result;
      // log(maps);
      for (const map of maps) {
        log('++++++++++++++++')
        log(Object.keys(map));
        loadData(map);
        log(Object.keys(map));
      }
    })
  );

  console.log("(worker) message recieved: " + JSON.stringify(data));
  ctx.postMessage("fdsfds");
});
