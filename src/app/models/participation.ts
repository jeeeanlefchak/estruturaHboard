import { Base } from './base';
export class Participation extends Base{
    admissionEventId: number;
    playerToPlayerRoleId: number;
    participationTaskId: number;
    startedOn: Date;
    endedOn: Date;    
}
