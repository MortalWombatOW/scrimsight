import { AbstractEntitySystem, Engine } from "@trixt0r/ecs";
import { LogComponent } from "../components/log";
import { WriteStorageComponent } from "../components/storage";
import { UIComponent } from "../components/ui";
import { UploadComponent } from "../components/upload";
import { logParser } from "../entities/data";
import { ScrimsightEntity } from "../entity";

export class UploadSystem extends AbstractEntitySystem<ScrimsightEntity> {

    constructor() {
        super(0, [UploadComponent])
    }

    processEntity(entity: ScrimsightEntity) {
        document
        .getElementsByClassName("fileinput")[0]
        .addEventListener("change", e => readFile(e, this.engine));
        entity.components.remove(entity.components.get(UploadComponent));
        console.log('on file submit set')
    }
}


function readFile(evt: any, engine: Engine) {
  var files = evt.target.files;
  var file = files[0];
  console.log(file);
  var reader = new FileReader();
  reader.onload = function (event) {
    const map = new ScrimsightEntity();
    const logFull = event.target.result as string;
    const lines = logFull.split('\n').map(line => line.split(';'));
    // map.components.add();
    const id = cyrb53(logFull);
    map.components.add(new WriteStorageComponent(""+id, lines));
    engine.entities.add(map);
    engine.entities.add(logParser(id));
    console.log('map added');

    
  };
  reader.readAsText(file);
}

// function parseLogEvent(line: Array<string>): LogEvent {

// }


const imul = (opA: number, opB: number) => {
  opB |= 0;
  var result = (opA & 0x003fffff) * opB;
  if (opA & 0xffc00000 /*!== 0*/) result += ((opA & 0xffc00000) * opB) | 0;
  return result | 0;
};

const cyrb53 = function (str: string, seed: number = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = imul(h1 ^ ch, 2654435761);
    h2 = imul(h2 ^ ch, 1597334677);
  }
  h1 = imul(h1 ^ (h1 >>> 16), 2246822507) ^ imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = imul(h2 ^ (h2 >>> 16), 2246822507) ^ imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};