import { Institution } from './institution';
import { Base } from './base';
import { ConceptionProduct } from './conceptionProduct';
import { Team } from './team';
export class ConditionPresence extends Base{
    comments: string;
    conditionId: number;
    intensity: number;
    presenceStart: Date;
    presenceEnd: Date;
    probability: number;
    recipientId: number;
    recipientType: number;
    conditionInstanceId: number;
    onceptionProducts: ConceptionProduct[];
    institutions: Institution[];
    playerTeams: Team[];
}
