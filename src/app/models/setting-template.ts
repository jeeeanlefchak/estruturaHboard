import { Base } from "./base";
import { SettingInstance } from "./setting-instance";
import { SettingOption } from "./setting-option";
import { SettingDefaultValueType } from "./publicEnums";

export class SettingTemplate extends Base {
        name?: string;
        displayName?: string;
        description?: string;
        comment?: string;
        uid?: string;
        valueType?: SettingDefaultValueType;
        defaultValue?: string;
        defaultOptionId?: number;
        defaultOption?: SettingInstance;
        options?: SettingOption[];
}

