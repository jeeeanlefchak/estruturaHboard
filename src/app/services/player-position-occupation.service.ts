import { PlayerPositionOccupation } from '../models/playerPositionOccupation';
import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { HttpClient } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';

@Injectable()
export class PlayerPositionOccupationService extends AbstractService<PlayerPositionOccupation>{

  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'playerPositionOccupations';
  }


  public postWithStation(_formObject: PlayerPositionOccupation, stationId: number) {
    return this.http.post(this.urlBase + '/station/' + stationId, _formObject)
      .toPromise();
  }

  public putWithStation(_formObject: PlayerPositionOccupation, stationId: number) {
    return this.http.put(this.urlBase + "/" + _formObject.id + '/station/' + stationId, _formObject)
      .toPromise();
  }

  public putRange(_formObject: PlayerPositionOccupation[]) {
    return this.http.put(this.urlBase + "/Range", _formObject)
      .toPromise();
  }

  public postRange(_formObject : PlayerPositionOccupation[]){
    return this.http.post(this.urlBase + '/station', _formObject)
                    .toPromise();                   
  }

  // public getAnotAdmission() {
  //   var promise = new Promise<any[]>((resolve, reject) => {
  //       this.http.get(`${this.urlBase}/notAdmission`).toPromise().then((res: any[]) => {
  //           resolve(res);
  //       }).catch(error => {
  //           reject(error);
  //       })
  //   })
  //   return promise;
  // }

  // public postRange(_formObject : PlayerPositionOccupation[]){
  //   return this.http.post(this._baseUrl + this._getManagerUrl + '/station', _formObject)
  //                   .toPromise();                   
  // }

  // public putRange(_formObject : PlayerPositionOccupation[]){
  //   return this.http.put(this._baseUrl + this._getManagerUrl + "/Range", _formObject)
  //                   .toPromise();
  // } 

  // public putWithStation(_formObject : PlayerPositionOccupation, stationId: number){
  //   return this.http.put(this._baseUrl + this._getManagerUrl + "/"+  _formObject.id + '/station/' + stationId, _formObject)
  //                   .toPromise();
  // } 

  // public put(_formObject : PlayerPositionOccupation){
  //     return this.http.put(this._baseUrl + this._getManagerUrl + "/"+  _formObject.id, _formObject)
  //                     .map(res => res.json());
  // }

  // public postSetting(occupationId: number, _formObject : PlayerPositionOccupationToSetting){
  //   return this.http.post(this._baseUrl + this._getManagerUrl + "/"+ occupationId + "/Settings", _formObject)
  //                   .map(res => res.json());
  // }

  // public putSetting(occupationId: number, _formObject : PlayerPositionOccupationToSetting){
  //   return this.http.put(this._baseUrl + this._getManagerUrl + "/"+ occupationId + "/Settings/" + _formObject.id, _formObject)
  //                   .map(res => res.json());
  // }

}
