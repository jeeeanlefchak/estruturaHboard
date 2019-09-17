import { PlayerPosition } from './playerPosition';
import { Base } from './base';
export class AdmissionPositionFte extends Base{
    admissionId: number;
    playerPositionId: number;
    requiredOn: Date;
    dismissedOn: Date;
    fte: string;    
    position: PlayerPosition;
}
