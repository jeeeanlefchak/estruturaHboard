import { Base } from "./base";

export class PlayerToGroup extends Base{
    groupId: number;
    playerId: number;
    enteredOn: Date;
    leftOn: Date;
    playerRoleId: number;    
}
