import { Base } from "./base";
import { IntercommDevice } from "./intercommDevice";

export class IntercommDeviceAllocation extends Base {
    intercommDeviceId?: number;
    allocatedOn?: Date;
    deallocatedOn?: Date;
    carrierType?: number;
    carrierId?: number;
    intercommDevice?: IntercommDevice;
}
