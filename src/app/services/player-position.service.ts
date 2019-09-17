import { Injectable } from '@angular/core';
import { DataConnService } from './shared/data-conn.service';
import { AbstractService } from './abstract.service';
import { PlayerPosition } from '../models/playerPosition';
import { HttpClient } from '@angular/common/http';
import { PlayerPositionOccupation } from '../models/playerPositionOccupation';

@Injectable()
export class PlayerPositionService extends AbstractService<PlayerPosition>{

  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'playerpositions';
  }

  public getOccupationByPosUID(uid: string) {
    var promise = new Promise<PlayerPositionOccupation[]>((resolve, reject) => {
      this.http.get(this.urlBase + "/" + uid + "/Occupations").toPromise().then((res: PlayerPositionOccupation[]) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

}
