import { PlayerGroup } from './../models/playerGroup';
import { PlayerRole } from './../models/playerRole';
import { PlayerPositionOccupation } from './../models/playerPositionOccupation';
import { PlayerPosition } from './../models/playerPosition';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';
import { AbstractService } from './abstract.service';
import { Player } from '../models/player';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PlayerService extends AbstractService<Player> {

  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'players';
  }



  getPlayerPositions(playerId: number) {
    var promise = new Promise<PlayerPosition[]>((resolve, reject) => {
      this.http.get(this.urlBase + '/' + playerId + '/positions/device', httpOptions).toPromise().then((playerpositions: PlayerPosition[]) => {
        resolve(playerpositions)
      })
    })
    return promise;
  }

  public enterPosition(playerId: number, positionId: number) {
    var promise = new Promise<any[]>((resolve, reject) => {
      this.http.post(this.urlBase + '/' + playerId + "/Positions/" + positionId + "/Occupations/Enter", httpOptions).toPromise().then((res: any) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

  public leavePosition(playerId: number, positionId: number, occupancyId: number) {
    var promise = new Promise<any[]>((resolve, reject) => {
      this.http.put(this.urlBase + '/' + playerId + "/Positions/" + positionId + "/Occupations/" + occupancyId + "/Leave", httpOptions).toPromise().then((res: any) => {
        resolve(res);
      }).catch(error => {
        reject(error);
      })
    })
    return promise;
  }

  // public getPlayerRoles(playerId: number) {
  //   var promise = new Promise<PlayerRole[]>((resolve, reject) => {
  //     this.http.get(this.urlBase + '/' + playerId + '/Roles', httpOptions).toPromise().then((playerRoles: PlayerRole[]) => {
  //       resolve(playerRoles)
  //     })
  //   })
  //   return promise;
  // }


  public getPlayerGroups(playerId: number) {
    var promise = new Promise<PlayerGroup[]>((resolve, reject) => {
      this.http.get(this.urlBase + '/' + playerId + '/PlayerGroups', httpOptions).toPromise().then((playerGroups: PlayerGroup[]) => {
        resolve(playerGroups)
      })
    })
    return promise;
  }

  public getPlayerIdPositions(id: number) {
    var promisse = new Promise<PlayerPosition[]>((resolve, reject) => {
      this.http.get(this.urlBase + '/' + id + '/positions', httpOptions).toPromise().then((positions: PlayerPosition[]) => {
        resolve(positions)
      }, error => {
        reject(error)
      });
    });
    return promisse;
  }

  public getByPlayerPositionGroupUid(uid: string) {
    var promisse = new Promise<any[]>((resolve, reject) => {
      this.http.get(this.urlBase + '/ByPlayerPositionGroupUid/' + uid, httpOptions).toPromise().then((positions: PlayerPosition[]) => {
        resolve(positions)
      }, error => {
        reject(error)
      });
    });
    return promisse;
  }

  public getRolesByPlayerPositionId(id: number) {
    var promisse = new Promise<any[]>((resolve, reject) => {
      this.http.get(this.urlBase + '/' + id + '/Roles', httpOptions).toPromise().then((positions: PlayerPosition[]) => {
        resolve(positions)
      }, error => {
        reject(error)
      });
    });
    return promisse;
  }

  public put(obj) {
    var promise = new Promise<Player>((resolve, reject) => {
      this.http.put(this.urlBase + '/' + obj.id, obj, httpOptions).toPromise().then((res: Player) => {
        resolve(res);
      }).catch(error => {
        reject(this.handleError(error));
      })
    })
    return promise;
  }
}
