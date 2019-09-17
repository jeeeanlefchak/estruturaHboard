import { Base } from "./base";
import { Occupation } from "./occupation";
import { Race } from "./race";
import { CommChannel } from "./commChannel";

export class Person extends Base {
    prefix: string;
    displayName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    fullName: string;
    nickName: string;
    suffix: string;
    dateOfBirth: string;
    sex: number;
    sexualOrientation: number;
    maritalStatus: number;
    educationLevel: number;
    occupations: Occupation[];
    race: Race;  
    raceId: number;
    picture: string;
    modifiedBy: number;
    modifiedOn: Date;
    createdBy: number;
    createdOn: Date;
    employmentCategory: number
    commChannels: CommChannel[];
    age : string;
}
