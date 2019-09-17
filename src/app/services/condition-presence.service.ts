import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractService } from './abstract.service';
import { DataConnService } from './shared/data-conn.service';
import { ConditionTemplateGroup } from '../models/conditionTemplateGroup';


@Injectable({
  providedIn: 'root'
})
export class ConditionPresenceService extends AbstractService<any>{

  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'ConditionPresences';
  }

  public setPresenceEnd(id: number, dateTime) {
    var promise = new Promise<any[]>((resolve, reject) => {
      this.http.put(this.urlBase + "/" + id + "/SetPresenceEnd", { dateTime }).toPromise().then((res: any[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }
}
