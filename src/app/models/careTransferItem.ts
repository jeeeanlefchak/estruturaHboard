import { Base } from "./base";
import { CRUDAction } from "./publicEnums";

export class CareTransferItem extends Base{
    careTransferId: number;
    stationOccupancyId: number;
    admissionId: number;
    summary: any;
    startedOn: Date;
    endedOn: Date;
    admission: any;
    station: any;
    dataSnapshot: any;
    crudAction: CRUDAction;
    room: any;
}