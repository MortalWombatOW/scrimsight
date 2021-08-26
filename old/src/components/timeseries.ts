import { Component } from "@trixt0r/ecs";

export class AggregateComponent implements Component {
    constructor(public groupBy: string) {
    }
}