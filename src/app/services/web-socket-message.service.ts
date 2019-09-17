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
export class WebSocketMessageService extends AbstractService<any>{

  public getService(): string {
    return 'message';
  }

  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public sendToHub(hubId: string, target: string[], type: string, payload: any, action: string) {
    const url = `${this.urlBase}message?owner=${hubId}`;
    let apiHeader = new HttpHeaders();
    const obj = {
      target: target,
      type: type,
      action: action,
      payload: payload
    }
    return this.http.post(url, obj, { headers: apiHeader, withCredentials: false }).toPromise();
  }

  getAfterDateTime(dateTime: Date) {
    var promise = new Promise<any>((resolve, reject) => {
      const url = `${this.urlBase}/${dateTime}`;
      let apiHeader = new HttpHeaders();
      this.http.get(url, { headers: apiHeader, withCredentials: false }).toPromise().then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }
}