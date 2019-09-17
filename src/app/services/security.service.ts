import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DataConnService } from './shared/data-conn.service';
import { AbstractService } from './abstract.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})


export class SecurityService extends AbstractService<any>{
  constructor(http: HttpClient, public dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'Security';
  }


  // public post(_formObject: User){
  //   /* return this.http.post(this._baseUrl + this._getManagerUrl, _formObject, httpOptions).pipe(
  //     tap(user => console.log('authenticathed', user)), catchError(this.handleError<User>('post')));     */   
  //     return this.http.post(this._baseUrl + this._getManagerUrl, _formObject, httpOptions).toPromise()

  // /* private handleError<T> (operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {

  //     const toast = await this.toastController.create({
  //       message: 'Leave ' + grp.name + ' successfully.',
  //       position: 'top',
  //       duration: 2000
  //     });
  //     toast.present();

  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // } */
  // }
}
