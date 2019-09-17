import { Base } from "./base";

export interface PlayerPositionGroup extends Base {
    name: string;
    description: string;
    parentId: number;
    sectorId: number;
    uid: string;
    groups: PlayerPositionGroup[];
}
