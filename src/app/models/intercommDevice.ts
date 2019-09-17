import { Base } from "./base";

export class IntercommDevice extends Base {
    name: string;
    callIdentificator: string;
    activatedOn: Date;
    deactivatedOn: Date;
    allocated: boolean;
}
