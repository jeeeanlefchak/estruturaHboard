import { Base } from "./base";
import { CareTransferItem } from "./careTransferItem";

export class CareTransfer extends Base{
    sectorId: number;
    outPlayerPositionId: number;
    outPlayerId: number;
    inPlayerPositionId: number;
    inPlayerId: number;
    startedOn: Date;
    endedOn:Date;
    items: CareTransferItem[];
    comments: string;    
}