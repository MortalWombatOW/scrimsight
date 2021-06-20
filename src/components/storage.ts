import { Component } from "@trixt0r/ecs";

export class ReadStorageComponent implements Component {
    constructor(public key: string, public value: any) {
    }
}

export class WriteStorageComponent implements Component {
    constructor(public key: string, public value: any) {
    }
}