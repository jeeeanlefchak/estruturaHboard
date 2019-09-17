import { AssessmentInstance } from './assessmentInstance';
import { Base } from './base';
export class InterventionInstance extends Base {
    comments: string;
    fullFillRate: number;
    templateId : number;
    assessmentInstanceId : number;
    regardingToType : number;
    regardingToId : number;
    // interventionId: number;
    // presetId: number;
    // type: number;
    // Assessments: AssessmentInstance[];
}
