import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractService } from './abstract.service';
import { DataConnService } from './shared/data-conn.service';
import { Admission } from '../models/admission';
import { Attachment } from '../models/attachment';
import { Condition } from '../models/condition';


@Injectable({
  providedIn: 'root'
})
export class AdmissionService extends AbstractService<Admission>{

  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'admissions';
  }

  public getAttachmentsByAdmission(admissionId: number) {
    var promise = new Promise<Attachment[]>((resolve, reject) => {
      this.http.get(this.urlBase + "/" + admissionId + '/Attachments').toPromise().then((res: Attachment[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

  public getConditionsByAdmission(admissionId: number, indexType?: number) {
    var promise = new Promise<Condition[]>((resolve, reject) => {
      let url = this.urlBase + '/' + admissionId + '/Conditions'
      if (!indexType) {
        url += '/Conditions?indexType=' + indexType;
      }
      this.http.get(url).toPromise().then((res: Condition[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

}
