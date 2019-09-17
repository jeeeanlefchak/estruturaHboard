import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractService } from './abstract.service';
import { DataConnService } from './shared/data-conn.service';
import { ConditionTemplateGroup } from '../models/conditionTemplateGroup';


@Injectable({
    providedIn: 'root'
})
export class ConditionTemplateGroupService extends AbstractService<ConditionTemplateGroup>{

    constructor(http: HttpClient, protected dataConnService: DataConnService) {
        super(http, dataConnService)
    }

    public getService(): string {
        return 'conditionTemplateGroups';
    }


    public getAllGroupsAndTemplates() {
        var promise = new Promise<ConditionTemplateGroup[]>((resolve, reject) => {
            this.http.get(this.urlBase + '/GroupsAndTemplates').toPromise().then((res: ConditionTemplateGroup[]) => {
                resolve(res);
            }).catch(error => {
                reject(error);
            })
        })
        return promise;
    }
}
