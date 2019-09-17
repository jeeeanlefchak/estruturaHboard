import { Base } from "./base";

export class ConditionInstanceAndPresenceToSetting extends Base{
    conditionInstanceId: number;
    conditionPresenceId: number;
    conditionSettingId: number;
    setOn: Date;
    setOff: Date;
    createdOn: Date;
    createdBy: number;
    modifiedOn: Date;
    modifiedBy: number;
}