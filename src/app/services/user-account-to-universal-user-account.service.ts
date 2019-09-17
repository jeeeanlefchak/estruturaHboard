import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractService } from './abstract.service';
import { DataConnService } from './shared/data-conn.service';
import { Sector } from '../models/sector';
import { UserAccountToUniversalUserAccount } from '../models/user-account-to-universal-user-account';


@Injectable({
    providedIn: 'root'
})
export class UserAccountToUniversalUserAccountService extends AbstractService<UserAccountToUniversalUserAccount>{

    constructor(http: HttpClient, protected dataConnService: DataConnService) {
        super(http, dataConnService)
    }

    public getService(): string {
        return 'UserAccountToUniversalUserAccounts';
    }

    public getByOwnerId(ownerId: number) {
        var promise = new Promise<UserAccountToUniversalUserAccount>((resolve, reject) => {
            this.http.get(this.urlBase + "/getByOwnerId/" + ownerId).toPromise().then((res: UserAccountToUniversalUserAccount) => {
                resolve(res);
            }).catch(error => {
                reject(error);
            })
        })
        return promise;
    }

}
