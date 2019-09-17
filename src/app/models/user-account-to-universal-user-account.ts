import { Base } from "./base";
import { UniversalUserAccount } from "./universalUserAccount";
import { UserAccount } from "./user-account";

export class UserAccountToUniversalUserAccount extends Base {
    public login: string;
    public password: string;
    public userAccountId: number;
    public universalUserAccountid: number;
    public universalUserAccount: UniversalUserAccount;
    public userAccount: UserAccount;
}