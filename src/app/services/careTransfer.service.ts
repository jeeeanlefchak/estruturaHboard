import { Injectable } from '@angular/core';
import { CareTransfer } from '../models/careTransfer';
import { AbstractService } from './abstract.service';
import { HttpClient } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';

@Injectable()
export class CareTransferService extends AbstractService<any>{


  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'careTransfers';
  }

  public getByPlayerIdPositionId(playerId: number, positionId: number) {
    var promise = new Promise<CareTransfer>((resolve, reject) => {
      this.http.get(this.urlBase + "/Player/" + playerId + "/Position/" + positionId).toPromise().then((res: CareTransfer) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }


  public getById(id: number, lazyLoad: boolean = false) {
    let lazyLoadParam: string = "";
    if (lazyLoad) {
      lazyLoadParam = "?lazyLoad=true";
    }
    var promise = new Promise<CareTransfer>((resolve, reject) => {
      this.http.get(this.urlBase + "/" + id + lazyLoadParam).toPromise().then((res: CareTransfer) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

  public getNew(_formObject) {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.post(this.urlBase, _formObject).toPromise().then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

}
