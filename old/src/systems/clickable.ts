import { AbstractEntitySystem } from "@trixt0r/ecs";
import { ClickableComponent } from "../components/clickable";
import { UIComponent } from "../components/ui";
import { ScrimsightEntity } from "../entity";

export class ClickableSystem extends AbstractEntitySystem<ScrimsightEntity> {

    constructor() {
        super(0, [UIComponent, ClickableComponent])
    }

    processEntity(entity: ScrimsightEntity) {
        const clickable = entity.components.get(ClickableComponent);
        if (!clickable.active) {
            entity.components.get(UIComponent).el.addEventListener('click', () => clickable.action());
            clickable.active = true;
        }
    }
}