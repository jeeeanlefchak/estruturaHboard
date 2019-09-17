import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';
import { AbstractService } from './abstract.service';
import { CommChannel } from '../models/commChannel';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PersonCommChannelService extends AbstractService<CommChannel> {

  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'PersonCommChannels';
  }

  public postRange(_formObject: CommChannel[]) {
    var promise = new Promise<CommChannel[]>((resolve, reject) => {
      this.http.post(this.urlBase + '/range', _formObject, httpOptions).toPromise().then((commChannel: CommChannel[]) => {
        resolve(commChannel)
      })
    })
    return promise;
  }

  public putRange(_formObject: CommChannel[]) {
    var promise = new Promise<CommChannel[]>((resolve, reject) => {
      this.http.put(this.urlBase + '/range', _formObject, httpOptions).toPromise().then((commChannel: CommChannel[]) => {
        resolve(commChannel)
      })
    })
    return promise;
  }

}
