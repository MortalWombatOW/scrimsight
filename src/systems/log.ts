import { AbstractEntitySystem } from "@trixt0r/ecs";
import { ClickableComponent } from "../components/clickable";
import { LogComponent } from "../components/log";
import { MetadataComponent } from "../components/metadata";
import { WriteStorageComponent } from "../components/storage";
import { SumComponent } from "../components/sum";
import { UIComponent } from "../components/ui";
import { ScrimsightEntity } from "../entity";
import metadataTemplate from '../templates/metadata.html';

export class LogSystem extends AbstractEntitySystem<ScrimsightEntity> {

    constructor() {
        super(0, [LogComponent])
    }

    processEntity(entity: ScrimsightEntity) {
        const log = entity.components.get(LogComponent).log;

        if (entity.components.get(MetadataComponent) === undefined) {
            const metadata = extractMetadata(log);
            entity.components.add(metadata);
            entity.components.add(new WriteStorageComponent("metadata", metadata));

            const metadataUI = new ScrimsightEntity();
            metadataUI.components.add(new UIComponent(document.getElementsByClassName('metadata')[0], metadataTemplate, new Map([["{team1}", metadata.team1.map(name => "<li>"+name+"</li>").join('\n')], ["{team2}", metadata.team2.map(name => "<li>"+name+"</li>").join('\n')]])));
            this.engine.entities.add(metadataUI);
        }

        if (entity.components.get(SumComponent) === undefined) {
            entity.components.add(new SumComponent('damage_dealt', null));
        }
    }
}

function extractMetadata(log: Array<Array<string>>) {
    const team1 = [], team2 = [];

    for (const line of log) {
        if (line.length == 5 && line[1] == "player_team") {
            if (line[3] == "Team 1") {
                team1.push(line[2]);
            } else {
                team2.push(line[2]);
            }
        }
    }
    console.log(team1, team2);
    return new MetadataComponent(team1, team2);
}

function listify(arr: Array<any>) {
    return arr.map(e => JSON.stringify(e))
}