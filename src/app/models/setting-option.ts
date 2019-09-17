import { Base } from "./base";

export class SettingOption extends Base {
    name?: string;
    displayName?: string;
    description?: string;
    comments?: string;
    value?: string;
    uid?: string;
    settingTemplateId?: number;
}