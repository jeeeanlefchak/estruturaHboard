import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractService } from './abstract.service';
import { DataConnService } from './shared/data-conn.service';
import { UniversalUserAccount } from '../models/universalUserAccount';


@Injectable({
    providedIn: 'root'
})
export class UniversalUserAccountService  extends AbstractService<UniversalUserAccount>{

    constructor(http: HttpClient, protected dataConnService: DataConnService) {
        super(http, dataConnService)
    }

    public getService(): string {
        return 'UniversalUserAccounts';
    }


}
