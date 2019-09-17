import { Institution } from './institution';
import { PlayerPositionStation } from './playerPositionStation';
import { PlayerPositionOccupation } from './playerPositionOccupation';
import { PlayerPosition } from './playerPosition';
import { PlayerRole } from './playerRole';
import { Base } from './base';
import { Person } from './person';
import { IntercommDeviceAllocation } from './intercommDeviceAllocation';
import { AdmissionPlayerFte } from './admissionPlayerFte';
import { PlayerGroup } from './playerGroup';
import { PlayerToGroup } from './playerToGroup';

export class Player extends Base{
    personId: number;
    activatedOn: Date;
    displayColor: string;
    person: Person;
    roles: PlayerRole[];
    groups: PlayerGroup[];
    positions:  PlayerPosition[];
    positionOccupations: PlayerPositionOccupation[];
    intercommDeviceAllocations: IntercommDeviceAllocation[];
    modifiedBy: number;
    modifiedOn: Date;
    createdBy: number;
    createdOn: Date;   
    fte: AdmissionPlayerFte[];
    institution: Institution;
    positionShortName: string;
    positionUID: string;
    playerPositionId: number;
    playerToGroups: PlayerToGroup[];    
    currentOccupations: PlayerPositionOccupation[];
    position: PlayerPosition;
}
