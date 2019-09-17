import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';
import { AbstractService } from './abstract.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UtilService extends AbstractService<any>{

  public getService(): string {
    return '';
  }

  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public get(urlService: string) {
    return this.http.get(this.urlBase + urlService, null)
      .toPromise();
  }

  public postCustom(urlService: string, body: any) {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.post(this.urlSystem + urlService, body, null).toPromise().then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }


  public GetApiDateTime() {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.get(`${this.urlBase}Util/Now`, { withCredentials: false }).toPromise().then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }
}