import { AbstractEntitySystem } from "@trixt0r/ecs";
import { ClickableComponent } from "../components/clickable";
import { LogComponent } from "../components/log";
import { MetadataComponent } from "../components/metadata";
import { WriteStorageComponent } from "../components/storage";
import { SumComponent } from "../components/sum";
import { UIComponent } from "../components/ui";
import { ScrimsightEntity } from "../entity";
import metadataTemplate from "../templates/metadata.html";

export class SumSystem extends AbstractEntitySystem<ScrimsightEntity> {
  constructor() {
    super(0, [LogComponent, SumComponent]);
  }

  processEntity(entity: ScrimsightEntity) {
    const sum = entity.components.get(SumComponent);
    if (sum.players !== null) {
      return;
    }

    const log = entity.components.get(LogComponent).log;
    sum.players =  extractSum(log, sum.type);
    entity.components.add(
      new WriteStorageComponent("sum", sum)
    );

    const sumUI = new ScrimsightEntity();
    let uiStr = "";
    for (let [key, value] of Array.from(sum.players.entries())) {
        uiStr += "<li>" +
        key +
        ": " +
        value +
        "</li>";
    }
    sumUI.components.add(
      new UIComponent(
        document.getElementsByClassName("content")[0],
        metadataTemplate,
        new Map([
          [
            "{team1}",
            uiStr
          ],
          ["{team2}", "fuck"],
        ])
      )
    );
    this.engine.entities.add(sumUI);
  }
}

function extractSum(log: Array<Array<string>>, type: string) {
  const players: Map<string, number> = new Map();

  for (const line of log) {
    if (line[1] == type) {
      if (!players.has(line[2])) {
        players.set(line[2], 0);
      }
      players.set(line[2], players.get(line[2]) + Number.parseFloat(line[3]));
    }
  }

  return players;
}
