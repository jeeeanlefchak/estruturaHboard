import { PlayerToGroup } from './playerToGroup';
import { Base } from "./base";

export class PlayerGroup extends Base{
    name: string;
    shortName: string;
    uid: string;
    children: PlayerGroup[];
    playerToGroups: PlayerToGroup[];
}