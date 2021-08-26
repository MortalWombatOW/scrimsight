import { Component } from "@trixt0r/ecs";

export class ReadStorageComponent implements Component {
    public value: any;
    constructor(public key: string) {
    }
}

export class WriteStorageComponent implements Component {
    constructor(public key: string, public value: any) {
    }
}