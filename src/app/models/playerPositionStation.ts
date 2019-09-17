import { PlayerPosition } from './playerPosition';
import { Base } from './base';
export class PlayerPositionStation extends Base{
    stationId: number;
    positionId: number;
    assignedOn: Date;
    dismissedOn: Date;
    followThePatient: boolean;    
    position: PlayerPosition;
}
