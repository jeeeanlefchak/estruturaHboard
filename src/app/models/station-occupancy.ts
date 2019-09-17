import { Base } from './base';

export interface StationOccupancy extends Base  {
    stationId: number;
    checkinOn: Date;
    checkoutOn: Date
}
