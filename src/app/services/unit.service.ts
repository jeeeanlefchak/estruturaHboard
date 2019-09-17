import { Injectable } from '@angular/core';
import { Unit } from './../models/unit';
import { AbstractService } from './abstract.service';
import { HttpClient } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';

@Injectable({
  providedIn: 'root'
})
export class UnitService extends AbstractService<Unit>{


  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'units';
  }

  // private getAllRelationsServer(){
  //     return this.http.get(this.urlBase + '/AllRelations/')
  //         .toPromise();
  // }

  // public getAllRelations(){
  //   return new Promise<any>(async (resolve, reject) =>{
  //     let relations = await this._indexedDBService.getAll('unitRelations');
  //     if(relations.length > 0){
  //       resolve(relations)
  //     }else{
  //       await this.getAllRelationsServer().then(r=>{
  //         let relations = r.json();
  //         if(relations.length > 0){
  //           relations.forEach(rel =>{
  //             this._indexedDBService.add('unitRelations',rel).then().catch( (e) => {});
  //           });
  //           resolve(relations);
  //         }else{
  //           reject('Relations not found');
  //         }
  //       })
  //     }
  //   });
  // }

  public getUnitToUnits(id: number) {
    return this.http.get(this.urlBase + '/GetUnitToUnits/' + id)
      .toPromise()
  }

  // public getAll(){
  //   return new Promise<Array<Unit>>(async (resolve,reject) => {
  //     let units = await this._indexedDBService.getAll('units');
  //     if(units.length > 0){
  //       resolve(units);
  //     }else{
  //       await this.getAllServer().then(async r =>{
  //         let units = r.json();
  //         units.forEach(unit =>{
  //           this._indexedDBService.add('units',unit).then().catch(() =>{});
  //         });
  //         resolve(units);
  //       });
  //     }
  //   });
  // }

  // public getById(id: number){
  //   return new Promise<Unit>(async (resolve,reject) =>{
  //     let unit:any = this._indexedDBService.getByKey('units',id);
  //     if(unit.id){
  //       resolve(unit);
  //     }else{
  //       this.getByIdServer(id).then(r =>{
  //         let unit = r.json();
  //         if(unit){
  //           this._indexedDBService.add('units',unit).then().catch(() =>{});
  //           resolve(unit);
  //         }else{
  //           reject('Unit not found');
  //         }
  //       });
  //     }
  //   });
  // }

  // private getAllServer() {
  //   return this.http.get(this._baseUrl + this._getManagerUrl, this.options)
  //   .toPromise();
  // }

  // private getByIdServer(id : number) {
  //     return this.http.get(this._baseUrl + this._getManagerUrl + "/"+ id, this.options)
  //     .toPromise();
  // }

  // public post(_formObject : Unit){
  //   return this.http.post(this._baseUrl + this._getManagerUrl, _formObject, this.options)
  //   .toPromise();
  // }
  // public put(_formObject : Unit){
  //     return this.http.put(this._baseUrl + this._getManagerUrl + "/"+  _formObject.id, _formObject, this.options)
  //     .toPromise();
  // }
  // public delete(id : number){
  //     return this.http.delete(this._baseUrl + this._getManagerUrl + "/"+ id, this.options)
  //     .toPromise();    
  // }
}
