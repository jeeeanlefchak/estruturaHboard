import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractService } from './abstract.service';
import { DataConnService } from './shared/data-conn.service';
import { Sector } from '../models/sector';
import { PlayerPositionStation } from '../models/playerPositionStation';


@Injectable({
    providedIn: 'root'
})
export class PlayerPositionStationService extends AbstractService<PlayerPositionStation>{

    constructor(http: HttpClient, protected dataConnService: DataConnService) {
        super(http, dataConnService)
    }

    public getService(): string {
        return 'PlayerPositionToStations';
    }


    public putPositionDismissed(positionId: number, stationId: number) {
        var promise = new Promise<PlayerPositionStation>((resolve, reject) => {
            this.http.get(this.urlBase + "/dismissed/" + positionId + "/" + stationId).toPromise().then((res: PlayerPositionStation) => {
                resolve(res);
            }).catch(error => {
                reject(error);
            })
        })
        return promise;
    }
}
