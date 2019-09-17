import { Base } from './base';
import { CRUDAction } from './publicEnums';
export class AssessmentInstanceToAssessmentInstance extends Base{
    partId: number;
    counterPartId: number;
    parameterInstanceId: number;
    resultId: number;
    crudAction: CRUDAction;
}