import { AbstractEntitySystem } from "@trixt0r/ecs";
import { MetadataComponent } from "../components/metadata";
import { ReadStorageComponent } from "../components/storage";
import { UIComponent } from "../components/ui";
import { storedDataRenderer } from "../entities/ui";
import { ScrimsightEntity } from "../entity";
import metadataTemplate from "../templates/metadata.html";
export class MetadataSystem extends AbstractEntitySystem<ScrimsightEntity> {

    constructor() {
        super(0, [MetadataComponent, ReadStorageComponent])
    }

    processEntity(entity: ScrimsightEntity) {
        const metadata = entity.components.get(MetadataComponent);
        const read = entity.components.get(ReadStorageComponent);

        if (read.value === undefined) {
            return;
        }

        if (metadata.team1 !== undefined) {
            return;
        }

        const team1 = [], team2 = [];

        for (const line of read.value) {
            if (line.length == 5 && line[1] == "player_team") {
                if (line[3] == "Team 1") {
                    team1.push(line[2]);
                } else {
                    team2.push(line[2]);
                }
            }
        }

        metadata.team1 = team1;
        metadata.team2 = team2;

    // entity.components.add(new WriteStorageComponent("metadata", metadata));
    entity.components.add(new UIComponent(document.getElementsByClassName('metadata')[0], metadataTemplate, new Map([["{team1}", metadata.team1.map(name => "<li>"+name+"</li>").join('\n')], ["{team2}", metadata.team2.map(name => "<li>"+name+"</li>").join('\n')]])));
    }
}