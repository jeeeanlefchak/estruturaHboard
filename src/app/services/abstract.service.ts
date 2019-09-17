import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { DataConnService } from "./shared/data-conn.service";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()

export abstract class AbstractService<T>{

  protected urlBase: string;
  protected urlSystem: string;

  constructor(protected http: HttpClient, protected dataConnService: DataConnService) {
    this.urlBase = `${this.stringConnection()}${this.getService()}`;
    this.urlSystem = this.stringConnection();
  }

  public abstract getService(): string;

  protected stringConnection(): string {
    return this.dataConnService.stringConnection();
  }

  public getAll() {
    var promise = new Promise<T[]>((resolve, reject) => {
      this.http.get(this.urlBase, httpOptions).toPromise().then((res: T[]) => {
        resolve(res);
      }).catch(error => {
        reject(this.handleError(error));
      })
    })
    return promise;
  }

  public getById(id: number) {
    var promise = new Promise<T>((resolve, reject) => {
      this.http.get(this.urlBase + '/' + id, httpOptions).toPromise().then((res: T) => {
        resolve(res);
      }).catch(error => {
        reject(this.handleError(error));
      })
    })
    return promise;
  }

  public put(obj) {
    var promise = new Promise<T>((resolve, reject) => {
      this.http.put(this.urlBase + '/' + obj.id, obj, httpOptions).toPromise().then((res: T) => {
        resolve(res);
      }).catch(error => {
        reject(this.handleError(error));
      })
    })
    return promise;
  }

  public post(obj: T) {
    var promise = new Promise<T>((resolve, reject) => {
      this.http.post(this.urlBase, obj, httpOptions).toPromise().then((res: T) => {
        resolve(res);
      }).catch(error => {
        reject(this.handleError(error));
      })
    })
    return promise;
  }

  public remove(id: number) {
    var promise = new Promise<T>((resolve, reject) => {
      this.http.delete(this.urlBase + '/' + id, httpOptions).toPromise().then((res: T) => {
        resolve(res);
      }).catch(error => {
        reject(this.handleError(error));
      })
    })
    return promise;
  }

  protected handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÂO", error);
    return throwError(error);
  }
} 