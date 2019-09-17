import { Base } from './base';
import { ConditionTemplate } from './conditionTemplate';
import { CRUDAction } from './publicEnums';
export class ConditionTemplateGroup extends Base {
    name: string;
    displayName: string;
    shortName: string;
    conditionTemplates: any[];
    hasChildren: boolean;
    parentID: number;
    groups: ConditionTemplateGroup[];
    isChecked: string;
    expanded: boolean;
    selected: boolean;
    title: boolean;
    description:string;
    sortOrder: number;
    crudAction: CRUDAction;
    cssClassContent: string;
}
