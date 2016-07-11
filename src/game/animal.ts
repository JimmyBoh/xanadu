import { MoveableEntity } from './entity';
import { Inventory } from './inventory';
import { Stats } from './stats';

export interface Animal extends MoveableEntity {
    hp: number,
    stats: Stats,
    inventory: Inventory,
    nextAction: any // I don't think this field is a good idea
}
