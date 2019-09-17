import { Base } from './base';
import { AssessmentLabel } from './assessmentLabel';
export class AssessmentLabelSet extends Base{
    name: string;
    description: string;
    labels: AssessmentLabel[];
}
