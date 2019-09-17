import { Base } from "./base";
import { OwnerType } from "./user-account-owner-type";

export class UserAccount extends Base{

    public ownerTypeId : number;
    public ownerId : number;
    public ownerType : OwnerType;
    public email : string;
    public mobilePhone : string;

}