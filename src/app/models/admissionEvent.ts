import { Base } from './base';
export class AdmissionEvent extends Base {
    admissionId: number;
    recipientType: number;
    recipientId: number;
    comments: string;
    happenedOn: Date;    
}
