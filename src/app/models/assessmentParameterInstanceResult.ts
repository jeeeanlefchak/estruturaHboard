import { Base } from './base';
import { AssessmentTemplateParameterOption } from './assessmentTemplateParameterOption';
import { CRUDAction } from './publicEnums';
export class AssessmentParameterInstanceResult extends Base{
    parameterInstanceId: number;
    resultOption: AssessmentTemplateParameterOption;
    resultOptionId: number;
    resultOptionID: number;
    resultText: any;
    resultValue: string;
    availableOn: Date;
    editionId: number;
    unitId: number;
    comments: string;    
    delMode: boolean;
    crudAction: CRUDAction;
    deletedOn: Date;
}
