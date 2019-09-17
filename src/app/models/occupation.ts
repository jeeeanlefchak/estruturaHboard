import { Base } from './base';

export class Occupation extends Base {
    name: string;
    idCode: string;
    inactivatedOn: Date;
    issuedOn: Date;
    description: string;
}
