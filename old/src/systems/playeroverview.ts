import { AbstractEntitySystem } from "@trixt0r/ecs";
import { ClickableComponent } from "../components/clickable";
import { LogComponent } from "../components/log";
import { MetadataComponent } from "../components/metadata";
import { ReadStorageComponent, WriteStorageComponent } from "../components/storage";
import { PlayerOverview, PlayerOverviewComponent } from "../components/playeroverview";
import { UIComponent } from "../components/ui";
import { ScrimsightEntity } from "../entity";
import metadataTemplate from "../templates/metadata.html";
import { storedDataRenderer } from "../entities/ui";
import playerOverviewTemplate from '../templates/playeroverview.html'
import playerOverviewRowTemplate from '../templates/playeroverviewrow.html'

export class PlayerOverviewSystem extends AbstractEntitySystem<ScrimsightEntity> {
  constructor() {
    super(0, [ReadStorageComponent, PlayerOverviewComponent]);
  }

  processEntity(entity: ScrimsightEntity) {
    const overview = entity.components.get(PlayerOverviewComponent);
    if (overview.players !== undefined) {
      return;
    }

    const log = entity.components.get(ReadStorageComponent).value;

    if (log == null) {
      return;
    }

    const players = extractPlayerOverviewData(log);
    overview.players = players;
    console.log(players);
    entity.components.add(new WriteStorageComponent('playeroverview', players))


    const rows = players.map(player => playerOverviewRowTemplate.replace('{name}', player.name)
    .replace('{role}', player.role)
    .replace('{damage_dealt}', player.damage_done.toFixed(2))
    .replace('{damage_recieved}', player.damage_taken.toFixed(2))
    .replace('{healing_dealt}', player.healing_done.toFixed(2))
    .replace('{healing_recieved}', player.healing_recieved.toFixed(2))
    .replace('{final_blows}', player.final_blows.toFixed(0))
    .replace('{eliminations}', player.eliminations.toFixed(0))
    .replace('{deaths}', player.deaths.toFixed(0))
    .replace('{ults_used}', player.ultimates_used.toFixed(0)));
    const ui = new ScrimsightEntity();
    ui.components.add(new UIComponent(document.getElementsByClassName('content')[0], playerOverviewTemplate, new Map([["{rows}", rows.join('\n')]])))
    this.engine.entities.add(ui);
  }
}

function extractPlayerOverviewData(log: Array<Array<string>>) : Array<PlayerOverview> {
  const players: Map<string, PlayerOverview> = new Map();

  for (const line of log) {
    const type = line[1];
    const player = line[2];
    const player2 = line[4];
    const value = line[3];

    if (!["did_healing", "damage_dealt", "did_final_blow", "did_elim", 'used_ultimate'].includes(type)) {
      continue;
    }


    if (!players.has(player)) {
      players.set(player, {
        name: player,
        role: '?',
        damage_done: 0,
        damage_taken: 0,
        healing_done: 0,
        healing_recieved: 0,
        deaths: 0,
        eliminations: 0,
        final_blows: 0,
        ultimates_used: 0,
      });
    }

    if (!players.has(player2)) {
      players.set(player2, {
        name: player2,
        role: '?',
        damage_done: 0,
        damage_taken: 0,
        healing_done: 0,
        healing_recieved: 0,
        deaths: 0,
        eliminations: 0,
        final_blows: 0,
        ultimates_used: 0,
      });
    }

    if (type == 'did_healing') {
      players.get(player).healing_done += Number.parseFloat(value);
      players.get(player2).healing_recieved += Number.parseFloat(value);
    }
    if (type == 'damage_dealt') {
      players.get(player).damage_done += Number.parseFloat(value);
      players.get(player2).damage_taken += Number.parseFloat(value);
    }
    if (type == 'did_final_blow') {
      players.get(player).final_blows += 1;
      players.get(player2).deaths += 1;
    }
    if (type == 'did_elim') {
      players.get(player).eliminations += 1;
    }
    if (type == 'used_ultimate') {
      players.get(player).ultimates_used += 1;
    }
  }

  return Array.from(players.values());
}
