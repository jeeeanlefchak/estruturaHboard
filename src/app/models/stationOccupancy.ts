import { Base } from './base';
import { Station } from './station';
export class StationOccupancy extends Base{
    stationId: number;
    checkinOn: Date;
    checkoutOn: Date;
    station: Station;
}
