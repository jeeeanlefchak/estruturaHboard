import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';
import { AssessmentInstance } from '../models/assessmentInstance';
import { AbstractService } from './abstract.service';
import { ObjectTypes } from '../models/assessmentParams';
import { ExecuteActionWhen } from '../models/publicEnums';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AssessmentInstanceService extends AbstractService<AssessmentInstance>{

  public getService(): string {
    return 'assessmentInstances';
  }

  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }


  public getNewInstance(uid: string, objectType?: number, objectId?: number, admissionId?: number) {
    let url = `${this.urlBase}/new/uid/${uid}`;
    if (admissionId) url += '?admissionId=' + admissionId;
    if (objectType) url += '&objectType=' + objectType;
    if (objectId) url += '&objectId=' + objectId;
    return this.http.get(url).toPromise();
  }

  public postNewInstance(_formObject: any, _admissionId: number = -1) {
    const url = `${this.urlBase}/new?admissionId=${_admissionId}`;
    return this.http.post(url, _formObject, httpOptions).toPromise();
  }

  public postRangeNewInstance(_formObject: any, _admissionId: number = -1) {
    const url = `${this.urlBase}/new/range?admissionId=${_admissionId}`;

    return this.http.post(url, _formObject, httpOptions).toPromise();
  }

  public putNewInstance(_formObject: any, id: number) {
    const url = `${this.urlBase}/new/${id}`;
    return this.http.put(url, _formObject, httpOptions).toPromise();
  }

  public getByIdLazyLoad(id: number) {
    return this.http.get(this.urlBase + "/" + id + "?lazyload=true").toPromise();
  }

  public postSave(_formObject: AssessmentInstance, _objectType: ObjectTypes, _objectId: number, _admissionId: number = undefined) {
    let uRL: string = this.urlBase;
    uRL = uRL + '/objectType/' + _objectType + '/objectId/' + _objectId;

    if (_admissionId != undefined || _admissionId != null) {
      uRL = uRL + '?admissionId=' + _admissionId;
    }

    return this.http.post(uRL, _formObject)
      .toPromise();
  }

  public getByUids(uids: string, patientId: number, admissionId: number) {
    var promise = new Promise<AssessmentInstance[]>((resolve, reject) => {
      this.http.get(this.urlBase + '/GetByUids/' + uids + '/PatientId/' + patientId + '?admissionId=' + admissionId).toPromise().then((res: any[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

  getNewTemplateByUid(templateUid: string, objectType: number, objectId: number) {
    var promise = new Promise<AssessmentInstance[]>((resolve, reject) => {
      this.http.get(this.urlBase + '/newbyuid/' + templateUid + '/objecttype/' + objectType + '/objectid/' + objectId).toPromise().then((res: any[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

  getNew(templateId: number, objectType: number, objectId: number) {
    var promise = new Promise<AssessmentInstance[]>((resolve, reject) => {
      this.http.get(this.urlBase + '/new/' + templateId + '/objecttype/' + objectType + '/objectid/' + objectId).toPromise().then((res: any[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

  // public put(_formObject: AssessmentInstance, _admissionId: number = undefined) {
  //   let uRL: string = this._baseUrl + this._getManagerUrl + '/' + _formObject.id;
  //   if (_admissionId != undefined || _admissionId != null) {
  //     uRL = uRL + '?admissionId=' + _admissionId;
  //   }
  //   return this.http.put(uRL, _formObject, httpOptions).toPromise();
  // }

  public executeActions(id: number, executeActionWhen: ExecuteActionWhen, _admissionId: number = undefined) {
    let url: string = this.urlBase + "/" + id + '/ExecuteActions/' + executeActionWhen;
    var promise = new Promise<AssessmentInstance[]>((resolve, reject) => {
      this.http.post(url, null).toPromise().then((res: any[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

  public deleteRange(ids: number[]) {
    let url: string = this.urlBase + "/DeleteRange";
    var promise = new Promise<AssessmentInstance[]>((resolve, reject) => {
      this.http.post(url, ids).toPromise().then((res: any[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

}