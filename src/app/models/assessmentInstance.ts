import { AssessmentLabel } from './assessmentLabel';
import { AssessmentTemplate } from './assessmentTemplate';
import { AssessmentParameterInstance } from './assessmentParameterInstance';
import { Base } from './base';
import { AssessmentInstanceToAssessmentInstance } from './assessmentInstanceToAssessmentInstance';
import { CRUDAction } from './publicEnums';
export class AssessmentInstance extends Base{
    assessmentTemplateId: number;
    objectId: number;
    regardingToType: number;
    regardingToId: number;
    status: number;
    interpretationId: number;
    assessmentLabelId: number;
    orderedOn: any;
    orderedBy: number;
    specimenCollectedOn: Date;
    specimenCollectedBy: number;
    expectedOn: Date;
    endExecutionOn: Date;
    executionPlayerId: number;
    executionInstitutionId: number;
    reviewedBy: number;
    reviewedOn: Date;
    publishedBy: number;
    publishedOn: Date;
    resultValidUntil: Date;
    comments: string;
    parameters: AssessmentParameterInstance[];
    assessmentTemplate: AssessmentTemplate;
    assessmentLabel: AssessmentLabel;
    changed: boolean = false;
    touched: boolean = false;
    children: AssessmentInstance[];
    assessmentInstanceToAssessmentInstances: AssessmentInstanceToAssessmentInstance[];
    crudAction: CRUDAction;
    deletedOn: Date;
    createdOn: Date;
}
