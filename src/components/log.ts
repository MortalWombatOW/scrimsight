import { Component } from "@trixt0r/ecs";

export class LogComponent implements Component {
    constructor(public log: Array<Array<string>>) {
    }
}