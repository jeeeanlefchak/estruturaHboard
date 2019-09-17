import { Base } from './base';
import { AssessmentTemplateParameterOption } from './assessmentTemplateParameterOption';
export class AssessmentTemplateParameterOptionSet extends Base{
    name: string;
    description: string;
    options: AssessmentTemplateParameterOption[];
}
