import { Base } from './base';
export class ConditionInstanceEvent extends Base {    
    conditionInstanceId: number;
    conditionPresenceId: number;
    eventType: number;
    eventId: number;    
    startOn: Date;
    endOn: Date;    
}