import { Base } from "./base";
import { PlayerPosition } from "./playerPosition";

export class PlayerPositionToPlayerPosition extends Base{
    public partId : number;
    public counterPartId : number;
    public typeId : number;
    public counterPart : PlayerPosition;
    public type : any;
}