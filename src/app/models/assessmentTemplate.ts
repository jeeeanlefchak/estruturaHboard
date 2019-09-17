import { AssessmentLabelSet } from './assessmentLabelSet';
import { AssessmentTemplateGroup } from './assessmentTemplateGroup';
import { AssessmentTemplateInstruction } from './assessmentTemplateInstruction';
import { Base } from './base';
import { AssessmentInstance } from './assessmentInstance';
import { AssessmentLabel } from './assessmentLabel';
import { AssessmentTemplateParameter } from './assessmentTemplateParameter';
import { AssessmentTemplateParameterTemplate } from './assessmentTemplateParameterTemplate';

export class AssessmentTemplate extends Base {    
    name: string;
    shortName: string;
    version: string;
    description: string;
    comments: string;
    instructions: string;
    type: number;
    objectType: number;
    regardingToType: number;
    activatedOn: Date;
    inactivatedOn: Date;
    regardingTypeId: number; //Vai ser um Objeto
    regarding: Object;
    labelSetId: number;
    assessmentLabelSet: AssessmentLabelSet;
    labels: AssessmentLabel[];
    AssessmentTemplateInstructions: AssessmentTemplateInstruction[];
    AssessmentTemplateGroups: AssessmentTemplateGroup[];
    layout: any;
    assessmentInstance: AssessmentInstance;
    parameters: AssessmentTemplateParameterTemplate[];   
    parametersToTemplate: AssessmentTemplateParameterTemplate[];
    uid: string;
    identityColor: string;
    displayName: string;
    templateHash: string;
    createdOn: Date;
    modifiedOn: Date;
    modifiedBy: number;
}
