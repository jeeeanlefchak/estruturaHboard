import { AssessmentLabelSet } from './assessmentLabelSet';
import { Base } from './base';
export class AssessmentLabel extends Base{
    name: string;
    shortName: string;
    description: string;
    labelSetId: number;  
    assessmentLabelSet: AssessmentLabelSet;  
}
