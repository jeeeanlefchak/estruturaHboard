import { PlayerPosition } from './playerPosition';
import { Base } from './base';
export class PlayerRole extends Base{
    name: string;  
    shortName: string;
    positions:  PlayerPosition[];
    uid: string;
}
