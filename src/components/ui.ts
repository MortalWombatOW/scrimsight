import { Component } from "@trixt0r/ecs";

export class UIComponent implements Component {
    public needsRender: Boolean;
    constructor(public el: Element, public template: string, public injections: Map<string, string>) {
        this.needsRender = true;
    }
}