import { Base } from './base';
export class AssessmentTemplateParameter extends Base{
    assessmentTemplateId: number;    
    name: string;
    shortName: string;
    dataType: number;
    resultFromOptionsOnly: boolean;
    instructions: string;
    maxValue: number;
    minValue: number;
    step: number;
    defaultUnitId: number;
    activatedOn: Date;
    inactivatedOn: Date;
    version: string;
    description: string;
    uid: string;
    storeUnitId: number;
}
