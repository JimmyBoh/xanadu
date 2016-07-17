import * as _ from 'lodash';

export interface Stats {
    health: number;
    strength: number;
    intelligence: number;
    agility: number;
}

export interface PartialStats {
    health?: number;
    strength?: number;
    intelligence?: number;
    agility?: number;
}

export function changeStats(stats: Stats, changes: PartialStats): Stats {
    return {
        health: changes.health ? stats.health + changes.health : stats.health,
        strength: changes.strength ? stats.strength + changes.strength : stats.strength,
        intelligence: changes.intelligence ? stats.intelligence + changes.intelligence : stats.intelligence,
        agility: changes.agility ? stats.agility + changes.agility : stats.agility
    };
}

export function meetsRequirements(stats: Stats, requirements: PartialStats): boolean {
    return _.every([
        requirements.health ? stats.health >= requirements.health : true,
        requirements.strength ? stats.strength >= requirements.strength : true,
        requirements.intelligence ? stats.intelligence >= requirements.intelligence : true,
        requirements.agility ? stats.agility >= requirements.agility : true
    ]);
}
