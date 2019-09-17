import { Base } from './base';
import { Person } from './person';
export class ConceptionProduct extends Base {    
    personId: number;
    person: Person;
    name: string;
    sex: number;
    abBloodType: string;
    rhBloodType: string;    
}
