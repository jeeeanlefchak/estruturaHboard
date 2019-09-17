import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';
import { InterventionInstance } from '../models/interventionInstance';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class InterventionInstancesService extends AbstractService<InterventionInstance>{


  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'InterventionInstances';
  }

  public postRange(admissionId: number, intervention: InterventionInstance[]) {
    var promise = new Promise<InterventionInstance[]>((resolve, reject) => {
      this.http.post(this.urlBase + '/PostRange/admission/' + admissionId, intervention, httpOptions).toPromise()
        .then((interventionInstance: InterventionInstance[]) => {
          resolve(interventionInstance)
        })
    })
    return promise;
  }

  public deleteRange(admissionId: number, ids: number[]) {
    var promise = new Promise<any[]>((resolve, reject) => {
      this.http.post(this.urlBase + '/deleteRange/admission/' + admissionId, ids, httpOptions).toPromise()
        .then((r: any[]) => {
          resolve(r)
        })
    })
    return promise;
  }


}
