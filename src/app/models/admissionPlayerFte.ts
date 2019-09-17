import { Player } from './player';
import { Base } from './base';
export class AdmissionPlayerFte extends Base{
    admissionId: number;
    playerPositionId: number;
    requiredOn: Date;    
    dismissedOn: Date;
    assignedToAdmission: string;
    assignedToAllAdmission: string;
    available: string;
    playerId: number;
    player: Player;    
}