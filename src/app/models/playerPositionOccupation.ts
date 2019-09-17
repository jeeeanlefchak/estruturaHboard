import { PlayerPosition } from './playerPosition';
import { Base } from './base';
import { Player } from './player';
import { PlayerPositionOccupationToSetting } from './playerPositionOccupationToSetting';

export class PlayerPositionOccupation extends Base{
    playerId: number;
    playerPositionId: number;
    admissionId: number;
    checkoutOn: Date;
    checkinOn: Date;
    player: Player;
    position: PlayerPosition;
    settings: PlayerPositionOccupationToSetting[];
    roomName: string;
    patientName: string;
    positionShortName: string;
    positionUID: string;
    stationId: number;
    roomId: number;
}
