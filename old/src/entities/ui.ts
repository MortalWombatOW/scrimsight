import { Engine } from "@trixt0r/ecs";
import { LogComponent } from "../components/log";
import { ReadStorageComponent } from "../components/storage";
import { UIComponent } from "../components/ui";
import { ScrimsightEntity } from "../entity";

export function storedDataRenderer(element: Element, key: string): ScrimsightEntity {
    const entity = new ScrimsightEntity();
    entity.components.add(new ReadStorageComponent(key));
    entity.components.add(new UIComponent(element, null, null));
    return entity;
}