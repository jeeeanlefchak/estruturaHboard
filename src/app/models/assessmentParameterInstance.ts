import { AssessmentParameterInstanceResult } from './assessmentParameterInstanceResult';
import { Base } from './base';
import { AssessmentTemplateParameterTemplate } from './assessmentTemplateParameterTemplate';
import { AssessmentInstance } from './assessmentInstance';
import { CRUDAction } from './publicEnums';
export class AssessmentParameterInstance extends Base{
    assessmentInstanceId: number;
    assessmentTemplateToParameterTemplateId: number;
    parameterTemplate: AssessmentTemplateParameterTemplate;
    interpretation: number;      
    results: AssessmentParameterInstanceResult[];  
    delMode: boolean;
    assessmentInstances: AssessmentInstance[]=[];
    crudAction: CRUDAction;
    deletedOn: Date;
}
