import { CareTransfer } from './careTransfer';
import { AdmissionPositionFte } from './admissionPositionFte';
import { PlayerPositionOccupation } from './playerPositionOccupation';
import { Base } from './base';
import { PlayerRole } from './playerRole';
import { PlayerPositionGroup } from './playerPositionGroup';
import { Station } from './station';
import { PlayerPositionStation } from './playerPositionStation';
import { IntercommDeviceAllocation } from './intercommDeviceAllocation';

export class PlayerPosition extends Base{
    name: string;
    shortName: string;
    description: string;
    instructions: string;
    carryOnPhoneNumber: string;
    sectorId: number;
    linkType: number;    
    supervisingPositionId: number;
    occupations: PlayerPositionOccupation[];
    roles: PlayerRole[];
    uid: string;
    fte: string;
    groups: PlayerPositionGroup[];
    stations: Station[];
    admissionPositionFte: AdmissionPositionFte;
    lastOccupation: string;
    requestAdmissionType: number;    
    playerPositionToStations: PlayerPositionStation[];
    intercommDeviceAllocations: IntercommDeviceAllocation[];
    active: boolean;
    careTransfer: CareTransfer;
    handoff: boolean;
    sortOrder: number;
    cssClassContent: string;
}
