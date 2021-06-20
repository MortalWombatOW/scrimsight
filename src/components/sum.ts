import { Component } from "@trixt0r/ecs";

export class SumComponent implements Component {
    constructor(public type: string, public players: Map<string, number>) {
    }
}