import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerToGroup } from '../models/playerToGroup';
import { DataConnService } from './shared/data-conn.service';
import { AbstractService } from './abstract.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PlayerToGroupService extends AbstractService<PlayerToGroup> {

  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'PlayerToGroups';
  }

  public save(_formObject: PlayerToGroup) {
    var promise = new Promise<PlayerToGroup>((resolve, reject) => {
      this.http.post(this.urlBase, _formObject, httpOptions).toPromise().then((playerToGroup: PlayerToGroup) => {
        resolve(playerToGroup)
      })
    })
    return promise;
  }

  public put(_formObject: PlayerToGroup) {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.put(this.urlBase + "/" + _formObject.id, _formObject, httpOptions).toPromise().then((resp) => {
        resolve(resp)
      })
    })
    return promise;
  }
}
