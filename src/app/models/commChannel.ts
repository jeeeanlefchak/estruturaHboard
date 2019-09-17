import { Base } from './base';

export class CommChannel extends Base {
    identificator: string;
    channelType: number;
    inactivatedOn: Date;
    comments: string;
    personId: number;
    edited: boolean;
    type  : any; 
}
