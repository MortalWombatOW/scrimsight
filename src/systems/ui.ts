import { AbstractEntitySystem } from "@trixt0r/ecs";
import { UIComponent } from "../components/ui";
import { ScrimsightEntity } from "../entity";

export class UISystem extends AbstractEntitySystem<ScrimsightEntity> {

    constructor() {
        super(0, [UIComponent])
    }

    processEntity(entity: ScrimsightEntity) {
        const ui = entity.components.get(UIComponent);
        // entity.components.get(UIComponent).el.innerHTML = "yas" + this.i;
        // this.i++;
        if (ui.template === null) {
            return;
        }
        if (ui.needsRender) {
            ui.needsRender = false;
            let template = ui.template;
            ui.injections.forEach((value, key) => {
                console.log(key);
                template = template.replaceAll(key, value);
            });
            ui.el.innerHTML = template;
        }
    }
}