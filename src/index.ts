import "./main.scss";

import {Engine} from '@trixt0r/ecs';
import { ScrimsightEntity } from "./entity";
import { UIComponent } from "./components/ui";
import { StoredDataUISystem, UISystem } from "./systems/ui";
import { ClickableComponent } from "./components/clickable";
import { ClickableSystem } from "./systems/clickable";
import uploadTemplate from './templates/upload.html';
import { UploadSystem } from "./systems/upload";
import { UploadComponent } from "./components/upload";
import { LogSystem } from "./systems/log";
import { StorageSystem } from "./systems/storage";
import { PlayerOverviewSystem } from "./systems/playeroverview";
import { MetadataSystem } from "./systems/metadata";



const engine = new Engine;

engine.systems.add(new UISystem());
engine.systems.add(new ClickableSystem());
engine.systems.add(new UploadSystem());
engine.systems.add(new LogSystem());
engine.systems.add(new StorageSystem());
engine.systems.add(new PlayerOverviewSystem());
engine.systems.add(new StoredDataUISystem());
engine.systems.add(new MetadataSystem());
engine.systems.add(new PlayerOverviewSystem());



const uploadContent = new ScrimsightEntity();
uploadContent.components.add(new UIComponent(document.getElementsByClassName('content')[0], uploadTemplate, new Map([["{injection}", ""]])));
uploadContent.components.add(new UploadComponent());

const uploadButton = new ScrimsightEntity();
uploadButton.components.add(new UIComponent(document.getElementsByClassName('uploadbutton')[0], null, null));
uploadButton.components.add(new ClickableComponent(() => engine.entities.add(uploadContent)));
engine.entities.add(uploadButton);



let t = Date.now();
function run() {
  requestAnimationFrame(() => {
    const now = Date.now();
    const delta = now - t;
    t = now;
    engine.run(delta);
    run();
  });
}


run();