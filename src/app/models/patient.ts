import { PersonIdentifier } from './personIdentifier';
import { Base } from './base';
import { Person } from './person';

export class Patient extends Base {
    person: Person;
    personIdentifier: PersonIdentifier;
    description: string;
    createdOn: Date;
    createdBy: number;
    expireOn: Date;
    emrIndtifier: string;
    privacyName: string;
    modifiedBy: number;
    modifiedOn: Date;
}
