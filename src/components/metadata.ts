import { Component } from "@trixt0r/ecs";

export class MetadataComponent implements Component {
    constructor(public team1: Array<string>, public team2: Array<string>) {
    }
}