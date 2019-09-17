import { Base } from './base';
export class AssessmentTemplateGroup extends Base{
    name: string;
    description:string;
    hasChildren: boolean;
    parentID: number;
    groups: AssessmentTemplateGroup[];
    isChecked: string;
    selected: boolean;
    expanded: boolean;
}
