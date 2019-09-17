import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractService } from './abstract.service';
import { DataConnService } from './shared/data-conn.service';


@Injectable({
    providedIn: 'root'
})
export class FileService extends AbstractService<any>{

    constructor(http: HttpClient, protected dataConnService: DataConnService) {
        super(http, dataConnService)
    }

    public getService(): string {
        return 'Files';
    }


    public downloadFile(id: number) {
        var promise = new Promise<Blob>((resolve, reject) => {
            /// https://github.com/angular/angular/issues/18586 arraybuffer
            this.http.get(this.urlBase + "/" + id + '/download', { responseType: 'arraybuffer' as 'json' }).toPromise().then((res: any) => {
                // var blob = new Blob([res]);
                // resolve(blob);
                let blob = new Blob([new Uint8Array(res)]);
                resolve(blob);
            }).catch(error => {
                reject(error);
            })
        })
        return promise;
    }


}

