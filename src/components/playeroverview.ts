import { Component } from "@trixt0r/ecs";

export type PlayerOverview = {
    name: string;
    role: string;
    damage_done: number;
    damage_taken: number;
    healing_done: number;
    healing_recieved: number;
    deaths: number;
    final_blows: number;
    eliminations: number;
    ultimates_used: number;
};

export class PlayerOverviewComponent implements Component {
    public players: Array<PlayerOverview>;
    constructor() {
    }
}