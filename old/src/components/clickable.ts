import { Component } from "@trixt0r/ecs";

export class ClickableComponent implements Component {
    public active = false;
    constructor(public action: Function) {
    }
}