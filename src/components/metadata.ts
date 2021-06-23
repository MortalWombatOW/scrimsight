import { Component } from "@trixt0r/ecs";

export class MetadataComponent implements Component {
    public team1: Array<string>;
    public team2: Array<string>;
    constructor() {
    }
}