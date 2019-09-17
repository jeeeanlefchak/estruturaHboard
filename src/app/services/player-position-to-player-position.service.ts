import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractService } from './abstract.service';
import { DataConnService } from './shared/data-conn.service';
import { PlayerPositionToPlayerPosition } from '../models/playerPositionToPlayerPosition';


@Injectable({
    providedIn: 'root'
})
export class PlayerPositionToPlayerPositionService extends AbstractService<PlayerPositionToPlayerPosition>{

    constructor(http: HttpClient, protected dataConnService: DataConnService) {
        super(http, dataConnService)
    }

    public getService(): string {
        return 'PlayerPositionToPlayerPositions';
    }


    public getRelated(positionId: number, typeUid: String) {
        var promise = new Promise<PlayerPositionToPlayerPosition[]>((resolve, reject) => {
            this.http.get(this.urlBase + '/' + positionId + '/relatedType/' + typeUid).toPromise().then((res: PlayerPositionToPlayerPosition[]) => {
                resolve(res);
            }).catch(error => {
                reject(error);
            })
        })
        return promise;
    }
}
