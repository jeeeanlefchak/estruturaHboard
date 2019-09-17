import { Base } from './base';
export class Unit extends Base{
    greatnessId: number;
    name: string;
    shortName: string;
    primary: boolean;
    units: Unit[];
}
