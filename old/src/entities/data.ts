import { Engine } from "@trixt0r/ecs";
import { LogComponent } from "../components/log";
import { ReadStorageComponent } from "../components/storage";
import { ScrimsightEntity } from "../entity";

export function logParser(id: number): ScrimsightEntity {
    const entity = new ScrimsightEntity();
    entity.components.add(new ReadStorageComponent(""+id));
    entity.components.add(new LogComponent());
    return entity;
}