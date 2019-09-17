import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractService } from './abstract.service';
import { Institution } from '../models/institution';
import { DataConnService } from './shared/data-conn.service';
import { Storage } from '@ionic/storage';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
    providedIn: 'root'
})
export class InstitutionService extends AbstractService<Institution>{

    constructor(http: HttpClient, protected dataConnService: DataConnService, @Inject('configurations') private storgeConfigurations: Storage) {
        super(http, dataConnService)
    }

    public getService(): string {
        return 'institutions';
    }

    getByOwner(ownerId, ownerType) {
        var promise = new Promise<any[]>((resolve, reject) => {
            this.http.get(this.urlBase + '/GetByOwner/' + ownerId + '/' + ownerType, httpOptions).toPromise().then((res: any[]) => {
                resolve(res);
            }).catch(error => {
                reject(error);
            })
        })
        return promise;
    }

    saveLocal(institution, storge) {
        if (institution.arraySector) delete institution.arraySector
        if (institution.sector) delete institution.sector

        this.storgeConfigurations.set('currentInstitution', institution);
        this.storgeConfigurations.set('currentSector', storge);
    }


}
