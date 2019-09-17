import { Base } from './base';
import { IndexType } from './publicEnums';

export class ConditionInstanceIndex extends Base{
    conditionInstanceId: number;
    type: IndexType;
    position: number;
}

