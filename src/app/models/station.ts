import { PlayerPositionStation } from './playerPositionStation';
import { Base } from './base';
import { Room } from './room';
import { PlayerPosition } from './playerPosition';
import { Admission } from './admission';
import { Player } from './player';
import { StationStatus } from './stationStatus';

export class Station extends Base{
    roomId: number;
    name: string;
    shortName: string;
    activatedOn: Date;
    room: Room;
    positions: PlayerPosition[];
    admission: Admission;
    playerPositionStations: PlayerPositionStation[];
    nursing: Player[];
    status: StationStatus;    
}
