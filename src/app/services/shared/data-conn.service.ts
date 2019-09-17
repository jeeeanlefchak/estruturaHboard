import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataConnService {
  // https://hboard.gentus.com.br:5002/api/
  connServer = new BehaviorSubject("http://localhost:5001/api/");

  constructor(@Inject('configurations') private storgeConfigurations: Storage,
              private http: HttpClient) { 
                this.getConnection();
  }

  private getConnection(){
    this.storgeConfigurations.get("connServer").then(async (result) =>{
      if(result){       
        this.connServer.next(result);
      }else{
        this.http.get('assets/database/server.json').toPromise().then((data) =>{        
          if(data){
            this.connServer.next(data['connServer']);
            this.storgeConfigurations.set("connServer", data['connServer']).then(() =>{})
          }
        })               
      }
    })      
  }

  public stringConnection(): string {
    return this.connServer.value;
  } 
}
