import { Base } from './base';
export class ConditionTemplate extends Base{
    name: string;
    shortName: string;
    description: string;
    displayName: string;
    objectType: number;
    cssClassId: number;
    icon: string;
    usageCount: number;
    ConditionRelateds: ConditionTemplate[];
    check: boolean;
    defaultSettingId: number;
    uid: string;
}
