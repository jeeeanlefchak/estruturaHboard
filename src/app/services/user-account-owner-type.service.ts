import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractService } from './abstract.service';
import { DataConnService } from './shared/data-conn.service';
import { OwnerType } from '../models/user-account-owner-type';


@Injectable({
    providedIn: 'root'
})
export class UserAccountOwnerTypesService extends AbstractService<OwnerType>{

    constructor(http: HttpClient, protected dataConnService: DataConnService) {
        super(http, dataConnService)
    }

    public getService(): string {
        return 'UserAccountOwnerType';
    }


}
