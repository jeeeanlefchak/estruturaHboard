import { AssessmentTemplateParameterTemplate } from "./assessmentTemplateParameterTemplate";

export interface AssessmentTemplateLayoutCol {
    id: number;
    cssClass: string;
    parameterTemplate: AssessmentTemplateParameterTemplate;
    comp: Object;
}
