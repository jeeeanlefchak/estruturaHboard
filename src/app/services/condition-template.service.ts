import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractService } from './abstract.service';
import { DataConnService } from './shared/data-conn.service';
import { ConditionTemplate } from '../models/conditionTemplate';


@Injectable({
    providedIn: 'root'
})
export class ConditionTemplateService extends AbstractService<ConditionTemplate>{

    constructor(http: HttpClient, protected dataConnService: DataConnService) {
        super(http, dataConnService)
    }

    public getService(): string {
        return 'conditionTemplates';
    }


    
}
