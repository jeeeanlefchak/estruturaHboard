import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';
import { AbstractService } from './abstract.service';
import { Patient } from '../models/patient';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class PatientService extends AbstractService<Patient>{

    constructor(http: HttpClient, protected dataConnService: DataConnService) {
        super(http, dataConnService);
    }

    public getService(): string {
        return 'patients';
    }

    public getMyPatients(idNurse) {
        var promise = new Promise<any[]>((resolve, reject) => {
            this.http.get(`${this.urlBase}/getbyplayer/${idNurse}`).toPromise().then((res: any[]) => {
                resolve(res);
            }).catch(error => {
                reject(error);
            })
        })
        return promise;
    }
}
