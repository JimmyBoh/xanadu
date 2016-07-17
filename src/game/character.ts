import { Animal } from './animal';
import { ModernTranslationBook } from './items/books';
import * as Ingestible from './items/ingestible';
import { createInventory, hasItem, Inventory } from './inventory';
import { meetsRequirements, Stats } from './stats';

export interface Character extends Animal {
    name: string,
    characterClass: CharacterClass,
    allegiance: Allegiance
    modifiers: Modifiers,
    goldAmount: number
}

interface CharacterClass {
    name: string,
    startingStats: Stats,
    startingGold: number,
    startingInventory: Inventory
}

export const NoClass: CharacterClass = {
    name: 'None',
    startingStats: {
        health: 0,
        strength: 0,
        intelligence: 0,
        agility: 0
    },
    startingGold: 0,
    startingInventory: createInventory([], 0)
};

export const Benefactor: CharacterClass = {
    name: 'Benefactor',
    startingStats: {
        health: 0,
        strength: 0,
        intelligence: 0,
        agility: 0
    },
    startingGold: 0,
    startingInventory: createInventory([], 0)
};

export const Gunslinger: CharacterClass = {
    name: 'Gunslinger',
    startingStats: {
        health: 0,
        strength: 0,
        intelligence: 0,
        agility: 0
    },
    startingGold: 0,
    startingInventory: createInventory([], 0)
};

export const Excavator: CharacterClass = {
    name: 'Excavator',
    startingStats: {
        health: 0,
        strength: 0,
        intelligence: 0,
        agility: 0
    },
    startingGold: 0,
    startingInventory: createInventory([], 0)
};

export const Doctor: CharacterClass = {
    name: 'Doctor',
    startingStats: {
        health: 30,
        strength: 10,
        intelligence: 50,
        agility: 10
    },
    startingGold: 0,
    startingInventory: createInventory([Ingestible.Morphine, Ingestible.Opium, Ingestible.MedicalKits], 0)
};

export const Chef: CharacterClass = {
    name: 'Chef',
    startingStats: {
        health: 0,
        strength: 0,
        intelligence: 0,
        agility: 0
    },
    startingGold: 0,
    startingInventory: createInventory([], 0)
};

export const Shaman: CharacterClass = {
    name: 'Shaman',
    startingStats: {
        health: 0,
        strength: 0,
        intelligence: 0,
        agility: 0
    },
    startingGold: 0,
    startingInventory: createInventory([], 0)
};

export const Caveman: CharacterClass = {
    name: 'Caveman',
    startingStats: {
        health: 0,
        strength: 0,
        intelligence: 0,
        agility: 0
    },
    startingGold: 0,
    startingInventory: createInventory([], 0)
};

export const Cartographer: CharacterClass = {
    name: 'Cartographer',
    startingStats: {
        health: 0,
        strength: 0,
        intelligence: 0,
        agility: 0
    },
    startingGold: 0,
    startingInventory: createInventory([], 0)
};

export const Professor: CharacterClass = {
    name: 'Professor',
    startingStats: {
        health: 0,
        strength: 0,
        intelligence: 0,
        agility: 0
    },
    startingGold: 0,
    startingInventory: createInventory([], 0)
};

export const Smith: CharacterClass = {
    name: 'Smith',
    startingStats: {
        health: 0,
        strength: 0,
        intelligence: 0,
        agility: 0
    },
    startingGold: 0,
    startingInventory: createInventory([], 0)
};

export type Allegiance = 'None' | 'Eastern' | 'Western';

export interface Modifiers {
    killer?: boolean,
    immortal?: boolean,
    psycho?: boolean,
    racist?: boolean,
    cannibal?: boolean,
    fatalist?: boolean,
    pacifist?: boolean,
    rusky?: boolean,
    arsonist?: boolean,
    angelOfDeath?: boolean,
    collector?: boolean
    scalper?: boolean,
    missionary?: boolean
}

export function canTranslateModern(c: Character): boolean {
    return hasItem(c.inventory, ModernTranslationBook) ||  meetsRequirements(c.stats, {
        intelligence: 50
    });
}

export function canTranslateAncient(c: Character): boolean {
    return meetsRequirements(c.stats, {
        intelligence: 50
    });
}

export function canIdentifyPoison(c: Character): boolean {
    return meetsRequirements(c.stats, {
        intelligence: 50
    });
}

export function canIdentifyTraps(c: Character): boolean {
    return meetsRequirements(c.stats, {
        intelligence: 30,
        agility: 30
    });
}

export function isHunter(c: Character): boolean {
    return meetsRequirements(c.stats, {
        intelligence: 10,
        agility: 30,
        strength: 30
    });
}

export function canFillet(c: Character): boolean {
    return meetsRequirements(c.stats, {
        intelligence: 10,
        strength: 30
    });
}

export function canSetUpCamp(c: Character): boolean {
    return meetsRequirements(c.stats, {
        strength: 40
    });
}

export function canSmelt(c: Character): boolean {
    return meetsRequirements(c.stats, {
        intelligence: 20,
        strength: 30
    });
}

export function canRepairSmall(c: Character): boolean {
    return meetsRequirements(c.stats, {
        intelligence: 10,
        strength: 10
    });
}

export function canRepairMedium(c: Character): boolean {
    return meetsRequirements(c.stats, {
        intelligence: 20,
        strength: 20
    });
}

export function canRepairFull(c: Character): boolean {
    return meetsRequirements(c.stats, {
        intelligence: 30,
        strength: 30
    });
}

export function canHealSmall(c: Character): boolean {
    return meetsRequirements(c.stats, {
        health: 10,
        intelligence: 30,
        strength: 10
    });
}

export function canHealMedium(c: Character): boolean {
    return meetsRequirements(c.stats, {
        health: 10,
        intelligence: 40,
        strength: 10
    });
}

export function canHealFull(c: Character): boolean {
    return meetsRequirements(c.stats, {
        health: 20,
        intelligence: 50,
        strength: 10
    });
}

export function canCraftEasy(c: Character): boolean {
    return meetsRequirements(c.stats, {
        intelligence: 20,
        agility: 20,
        strength: 20
    });
}

export function canCraftMedium(c: Character): boolean {
    return meetsRequirements(c.stats, {
        intelligence: 40,
        agility: 20,
        strength: 30
    });
}

export function canCraftDifficult(c: Character): boolean {
    return meetsRequirements(c.stats, {
        intelligence: 40,
        agility: 20,
        strength: 30
    });
}
