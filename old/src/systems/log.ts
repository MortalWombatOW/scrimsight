import { AbstractEntitySystem } from "@trixt0r/ecs";
import { ClickableComponent } from "../components/clickable";
import { LogComponent } from "../components/log";
import { MetadataComponent } from "../components/metadata";
import { ReadStorageComponent, WriteStorageComponent } from "../components/storage";
import { PlayerOverviewComponent } from "../components/playeroverview";
import { UIComponent } from "../components/ui";
import { storedDataRenderer } from "../entities/ui";
import { ScrimsightEntity } from "../entity";

export class LogSystem extends AbstractEntitySystem<ScrimsightEntity> {
    constructor() {
        super(0, [LogComponent, ReadStorageComponent])
    }

    processEntity(entity: ScrimsightEntity) {
        const log = entity.components.get(LogComponent);
        const read = entity.components.get(ReadStorageComponent);
        
        if (read.value == undefined) {
            return;
        }
        const lines = read.value as Array<Array<string>>;

        if (entity.components.get(MetadataComponent) === undefined) {
            entity.components.add(new MetadataComponent());
            // const metadataUI = new ScrimsightEntity();
            // metadataUI.components.add(new UIComponent(document.getElementsByClassName('metadata')[0], metadataTemplate, new Map([["{team1}", metadata.team1.map(name => "<li>"+name+"</li>").join('\n')], ["{team2}", metadata.team2.map(name => "<li>"+name+"</li>").join('\n')]])));
            
        }

        if (entity.components.get(PlayerOverviewComponent) === undefined) {
            entity.components.add(new PlayerOverviewComponent());
        }
    }
}
