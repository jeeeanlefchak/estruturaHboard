import { Base } from "./base";
import { SettingOption } from "./setting-option";
import { SettingContextType } from "./setting-context-type";
import { SettingTemplate } from "./setting-template";

export class SettingInstance extends Base{
    templateId?: number;
    contextId?: number;
    contextTypeId?: number;
    optionId?: number;
    optionUid?: string;
    value?: string;
    validOn?: Date;
    expiresOn?: Date;
    createdBy?: number;
    createdOn?: Date;
    modifiedBy?: number;
    modifiedOn?: Date;
    option?: SettingOption;
    contextType?: SettingContextType;
    template?: SettingTemplate;
}