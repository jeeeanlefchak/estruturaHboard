import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';
import { AbstractService } from './abstract.service';
import { Condition } from '../models/condition';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ConditionService extends AbstractService<Condition>{

  public getService(): string {
    return 'conditionInstances';
  }

  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getPresencesById(id: number) {
    var promise = new Promise<any[]>((resolve, reject) => {
      this.http.get(this.urlBase + "/" + id + "/presences").toPromise().then((res: any[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

  public postRange(admissionId: number, conditionList: Condition[]) {
    var promise = new Promise<Condition[]>((resolve, reject) => {
      this.http.post(this.urlBase + '/admission/' + admissionId, conditionList).toPromise().then((res: Condition[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

}