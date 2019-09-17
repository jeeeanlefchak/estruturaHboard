import { Base } from './base';
export class StationStatus extends Base{
    name: string;
    description: string;
    activatedOn: Date;
    inactivatedOn: Date;
    cssClassContent? :any;
}
