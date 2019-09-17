import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';
import { CareTransferItem } from '../models/careTransferItem';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class CareTransferItemsService extends AbstractService<CareTransferItem> {


  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'careTransferItems';
  }


  // public getById(id: number, lazyLoad: boolean = false) {
  //   let lazyLoadParam: string = "";
  //   if (lazyLoad) {
  //     lazyLoadParam = "?lazyload=true";
  //   }

  //   return this.http.get(this._baseUrl + this._getManagerUrl + "/" + id + lazyLoadParam, this.options)
  //     .toPromise();
  // }

  // public post(_formObject: CareTransferItem) {
  //   return this.http.post(this._baseUrl + this._getManagerUrl, _formObject, this.options)
  //     .toPromise();
  // }

  // public put(_formObject: CareTransferItem, id: number) {
  //   return this.http.put(this._baseUrl + this._getManagerUrl + "/" + id, _formObject, this.options)
  //     .toPromise();
  // }

  // public delete(id: number) {
  //   return this.http.delete(this._baseUrl + this._getManagerUrl + "/" + id, this.options)
  //     .toPromise();
  // }

  public postRange(careTransferItems: CareTransferItem[]) {
    var promise = new Promise<any[]>((resolve, reject) => {
      this.http.post(this.urlBase + "/range", careTransferItems).toPromise().then((res: any[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }
  // public putRange(careTransferItems: any) {
  //   return this.http.put(this._baseUrl + this._getManagerUrl + "/range", careTransferItems, this.options)
  //     .toPromise();
  // }
}