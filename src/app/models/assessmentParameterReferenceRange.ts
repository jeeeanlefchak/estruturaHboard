import { Base } from './base';
export class AssessmentParameterReferenceRange extends Base{
    type: number;
    assessmentTemplateToParameterTemplateId: number;
    name: string;
    description: string;
    comments: string;
    ageTimeUnit: number;
    minAge: number;
    maxAge: number;
    sex: number;
    raceId: number;
    conditionTemplateId: number;
    valueUnitId: number;
    maxValue: number;
    minValue: number;
    activatedOn: Date;
    inactivatedOn: Date;
}
