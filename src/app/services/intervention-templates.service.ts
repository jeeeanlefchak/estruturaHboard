import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';
import { InterventionTemplate } from '../models/interventionTemplate';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class interventionTemplatesService extends AbstractService<InterventionTemplate>{


  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'interventionTemplates';
  }

  public getByAdmissionId(admissionId: number) {
    var promise = new Promise<InterventionTemplate[]>((resolve, reject) => {
      const url = this.urlBase + "/AdmissionId/" + admissionId;
      this.http.get(url, httpOptions).toPromise()
        .then((r: InterventionTemplate[]) => {
          resolve(r)
        })
    })
    return promise;
  }


}
