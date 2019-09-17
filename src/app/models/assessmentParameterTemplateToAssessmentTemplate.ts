import { Base } from "./base";
import { AssessmentTemplateParameterTemplate } from "./assessmentTemplateParameterTemplate";
import { AssessmentTemplate } from "./assessmentTemplate";

export class AssessmentParameterTemplateToAssessmentTemplate extends Base{
    parameterId: number;
    templateId: number;
    minInstances: number;
    maxInstances: number;
    parameter: AssessmentTemplateParameterTemplate;
    template: AssessmentTemplate;
}
