import { InterventionTemplate } from './interventionTemplate';
import { Base } from './base';
export class InterventionGroup extends Base{
    name: string;
    description: string;
    interventionTemplates : InterventionTemplate[];
}
