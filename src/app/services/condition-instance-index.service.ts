import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { DataConnService } from './shared/data-conn.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConditionInstanceIndex } from '../models/conditionInstanceIndex';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ConditionInstanceIndexesService extends AbstractService<ConditionInstanceIndex>{


  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'ConditionInstanceIndexes';
  }

  public postRange(conditionInstanceIndex: ConditionInstanceIndex[]) {
    var promise = new Promise<ConditionInstanceIndex[]>((resolve, reject) => {
      this.http.post(this.urlBase + '/Range', conditionInstanceIndex).toPromise().then((res: ConditionInstanceIndex[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }
}
