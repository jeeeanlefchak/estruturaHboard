import { AssessmentTemplateParameterTemplate } from './assessmentTemplateParameterTemplate';
import { AssessmentTemplateParameter } from './assessmentTemplateParameter';
import { Base } from './base';
export class AssessmentTemplateParameterOption extends Base{
    assessmentTemplateParameterOptionSetId: number;
    name: string;
    shortName: string;
    description: string;
    displayName: string;
    comments: string;
    instruction: string;
    tip: string;
    orderPosition: number;
    value: string;
    assessmentTemplateParameter: AssessmentTemplateParameter;
    assessmentTemplateParameterTemplate: AssessmentTemplateParameterTemplate;
    selected: boolean;
    default: boolean;
    cssClassContent: string;
    parentId: number;
}
