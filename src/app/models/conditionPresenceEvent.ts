import { Base } from './base';
export class ConditionPresenceEvent extends Base{
    conditionPresenceId: number;
    eventId: number;
    interventionInstanceId: number;
    typeId: number;
}
