import { Base } from './base';
import { CssClass } from './cssClass';
export class AdmissionSetting extends Base {
    name: string;
    shortName: string;
    description: string;
    parentId: number;
    type: number;
    uid: string;
    parent: AdmissionSetting;
    cssClass: CssClass;
    parentUid: string;
    cssClassContent: string;
}
