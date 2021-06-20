import { AbstractEntitySystem, Engine } from "@trixt0r/ecs";
import { LogComponent } from "../components/log";
import { WriteStorageComponent } from "../components/storage";
import { UIComponent } from "../components/ui";
import { UploadComponent } from "../components/upload";
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
    map.components.add(new LogComponent(lines));
    map.components.add(new WriteStorageComponent('testmap', lines));
    engine.entities.add(map);
    console.log('map added');

    
  };
  reader.readAsText(file);
}