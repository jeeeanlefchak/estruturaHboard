import { Base } from './base';
import { Institution } from './institution';
import { CRUDAction } from './publicEnums';
import { PlayerGroup } from './playerGroup';
export class Team extends Base{
    name: string;    
    shortName: string;
    displayName : string;
    description: string;
    teamGroupId: number;
    institutionId: number;
    cssClassId: number;
    uid: string;    
    cssClassContent: string;
    crudAction : CRUDAction;
    institution : Institution;
    
    playerGroupId : number;
    playerGroup ;
}
