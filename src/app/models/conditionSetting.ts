import { Base } from './base';
import { CssClass } from './cssClass';
export class ConditionSetting extends Base{
    name: string;
    shortName: string;
    description: string;
    type: number;
    parentId: number;
    cssClass: CssClass;
    uid: string;
    cssClassId: number;
}