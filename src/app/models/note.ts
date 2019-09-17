import { Base } from "./base";

export class Note extends Base{
    text: string;
    createdOn: Date;
    regardingToType: number;
    regardingToId: number;
    createdBy: number;
    modifiedOn: Date;
    modifiedBy: number;
}
