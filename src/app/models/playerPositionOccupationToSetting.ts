import { PlayerPositionOccupationSetting } from './playerPositionOccupationSetting';
import { Base } from './base';
export class PlayerPositionOccupationToSetting extends Base{
    positionOccupancyId: number;
    positionOccupancySettingId: number;
    setOn: Date;
    setOff: Date;
    setting: PlayerPositionOccupationSetting;
}
